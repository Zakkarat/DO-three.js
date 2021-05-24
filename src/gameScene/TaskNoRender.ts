import Entity from "../entities/Entity";
import GameScene from "./GameScene";
import MathUtils from "../utils/MathUtils";
import Line from "../entities/Line";
import {EventEmitter} from "../utils/EventEmitter";
import {Events} from "../constants/Events";
import {InnerChart} from "../utils/InnerChart";
import LineFactory from "../factories/LineFactory";

type Coordinates =  "x"|"y"|"z";

export default class TaskNoRender {
    private dimensions: number;
    private scene: GameScene;
    private _objects: Line[] = [];
    private _resetObjects: Line[] = [];
    public center: Entity = Line.build(0xFF0000, 5, 0, true);
    public centerMass: Entity = Line.build(0xFF0000, 5, 0, true);
    private _resolver: (value:unknown) => void = () => {};
    public isSequential: boolean = false;

    constructor(dimensions:number, scene:GameScene, objectNumber?:number) {
        this.dimensions = dimensions;
        this.scene = scene;

        this.addTaskObjectsToScene(objectNumber);
        this.addHandlers();
    }

    private addHandlers() {
        EventEmitter.addListener(Events.ITERATE_STATS, this.iterate.bind(this))
    }

    private addLines(objectNumber:number) {
        for (let i = 0; i < objectNumber; i++) {
            const line = LineFactory.build();
            this._objects.push(line);
        }
        this._resetObjects = [...this._objects];
    }

    private async addTaskObjectsToScene(objectNumber?:number) {
        objectNumber = objectNumber || MathUtils.getRandomNumber(2, 6);

        this.addLines(2);

        this._resetObjects = [...this._objects];
        await this.doGreedy();
        // await this.doImproveGreedy();
        // await this.pyramidAlgorithm();
        // this.scene.add(this.center, this.centerMass, ...this.objects);

    }

    private iterate(iterations:number, lineNumber:number, maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        this.addLines(lineNumber);
        for(let i = 0; i < iterations; i++) {
            this.randomizeWeights(maxWeight);
            console.log(i);
            this._resetObjects = [...this._objects];
            const greedy = this.doGreedy();
            const bruteForce = this.doImproveGreedy();
            const pyramid = this.pyramidAlgorithm();
            results.greedy.push(greedy);
            results.bruteForce.push(bruteForce);
            results.pyramid.push(pyramid);
        }
        new InnerChart(results);
    }

    private randomizeWeights(maxWeight:number) {
        this._objects.forEach(elem => elem.weight = MathUtils.getRandomNumber(0, maxWeight));
    }

    private getCenterMass() {
        const overallWeight = this._objects.reduce((acc, curr) => {
            acc += curr.weight;
            return acc;
        }, 0);
        const coordinates:Coordinates[] = ["x", "y", "z"];
        return coordinates.map(coordinate => this.getCenterMassCoordinate(overallWeight, coordinate));
    }

    private getCenterMassCoordinate(overallWeight:number, coordinate:Coordinates) {
        return this._objects.reduce((acc, curr) => {
            acc += curr.position[coordinate] * curr.weight;
            return acc;
        }, 0) / overallWeight;
    }

    private formLine() {
        const lineWidth = this._objects.reduce((acc, curr) => {
            acc += curr.width;
            return acc;
        }, 0)
        const start = this.center.position.x - lineWidth / 2;
        this._objects.reduce((acc,curr) => {
            curr.position.x = acc + curr.width / 2;
            acc += curr.width;
            return acc;
        }, start);
    }

    public doImproveGreedy() {
        this.moveCenterMass();
        let difference = this.getDifference();
        let bestStructure:Line[] = [...this._objects];
        console.log(difference, 'startDifference');
        let resetObjects = [...this._objects];
        for (let i = 0; i < this._objects.length; i++) {
            for (let j = 0; j < this._objects.length; j++) {
                this.swap(bestStructure, i, j);
                this.moveCenterMass();
                if (difference > this.getDifference()) {
                    resetObjects = [...bestStructure];
                    difference = this.getDifference();
                } else {
                    bestStructure = [...resetObjects];
                }
            }
        }
        this._objects = [...bestStructure];
        this.reset();
        console.log(difference, 'BruteForce');
        return difference;
    }

    public doGreedy() {
        this.moveCenterMass();
        let difference = this.getDifference();
        let bestStructure:Line[] = [];
        const resetObjects = [...this._objects];
        for (let i = 0; i < this._objects.length; i++) {
            for (let j = 0; j < this._objects.length; j++) {
                this.swap(this._objects, i, j);
                this.moveCenterMass();
                const newDifference =  this.getDifference();
                if (difference > newDifference) {
                    bestStructure = [...this.objects];
                    difference = newDifference;
                }
                this._objects = [...resetObjects];
            }
        }
        console.log(difference, 'Greedy');
        this._objects = [...bestStructure];
        this.reset();
        return difference;
    }

    public pyramidAlgorithm() {
        this._objects = this._objects.sort((a, b) => a.weight - b.weight);
        this.formLine();
        let newObjects = [...this._objects];
        newObjects = newObjects.sort((a, b) => a.weight - b.weight);
        const left:Line[] = [];
        const right:Line[] = [];
        newObjects.forEach((elem, i) => {
            if (i % 2 === 0) {
                left.push(elem);
            } else {
                right.push(elem);
            }
        });
        right.sort((a, b) => {
            return b.weight - a.weight;
        });
        this._objects = left.concat(right);
        let difference = this.getDifference();
        this.formLine();
        let resetObjects = [...this._objects];
        let bestStructure:Line[] = [...this._objects];
        for (let i = 0; i < this._objects.length; i++) {
            this.swap(bestStructure, i, bestStructure.length - 1 - i);
            this.formLine();
            if (difference > this.getDifference()) {
                bestStructure = [...bestStructure];
                resetObjects = [...bestStructure];
                difference = this.getDifference();
            } else {
                bestStructure = [...resetObjects];
            }
        }
        this._objects = [...bestStructure];
        this.formLine();
        this.reset();
        return difference;
    }

    public async refreshScene(isSkipAwait?:boolean, isSkipLine?: boolean) {
        if (!isSkipLine) {
            this.centerMass.visible = true;
            this.center.visible = true;
            this.formLine();
        }
        this.moveCenterMass();
        this.scene.render();
        if (this.isSequential && !isSkipAwait) {
            await this.createAwaiter();
        }
    }

    public reset() {
        this._objects = [...this._resetObjects];
    }

    private createAwaiter() {
        return new Promise(resolve => {
            this._resolver = resolve;
        })
    }

    public next() {
        this._resolver(true);
    }

    private swap(arr:Line[], i:number, j:number) {
        const {x} = arr[i].position;
        arr[i].position.x = arr[j].position.x;
        arr[j].position.x = x;
    }

    private getDifference = () => {
        let reducer = 0;
        reducer += Math.pow(this.center.position.x - this.centerMass.position.x, 2);
        return Math.sqrt(reducer);
    }

    public moveCenterMass() {
        this.centerMass.position.x = this.getCenterMass()[0];
    }

    get objects():Line[] {
        return this._objects;
    }
    set objects(value:Line[]) {
        this._objects = value;
    }
}