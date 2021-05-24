import Entity from "../entities/Entity";
import GameScene from "./GameScene";
import MathUtils from "../utils/MathUtils";
import Line from "../entities/Line";
import Sphere from "../entities/Sphere";
import SquareFactory from "../factories/SquareFactory";
import {EventEmitter} from "../utils/EventEmitter";
import {Events} from "../constants/Events";
import {InnerChart} from "../utils/InnerChart";
import Cube from "../entities/Cube";

type Coordinates =  "x"|"y"|"z";

export default class Task2dNoRender {
    private dimensions: number;
    private scene: GameScene;
    private _objects: Cube[] = [];
    private _resetObjects: Cube[] = [];
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
        EventEmitter.addListener(Events.ITERATE_STATS, this.iterateQuantity.bind(this))
    }

    private addSquares(objectNumber:number) {
        this.objects = [];
        const actualNumber = Math.pow(objectNumber, 2);
        for (let i = 0; i < actualNumber; i++) {
            const square = SquareFactory.build();
            this.objects.push(square);
        }
        this.formSquare(objectNumber);
    }

    private async addTaskObjectsToScene(objectNumber?:number) {
        objectNumber = objectNumber || MathUtils.getRandomNumber(2, 6);

        this.addSquares(2);
        this.center = Sphere.build(25, 50, 50, 0xFF0000, 0, 0, -50);
        this.centerMass = Sphere.build(25, 50, 50, 0x008000, 10, 0, -30);

        this._resetObjects = [...this._objects];
        await this.doGreedy();
        // await this.doImproveGreedy();
        // await this.pyramidAlgorithm();
        // this.scene.add(this.center, this.centerMass, ...this.objects);

    }

    // @ts-ignore
    private iterate(iterations:number, squaresNumber:number, maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        this.addSquares(squaresNumber);
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

    // @ts-ignore
    private iterateTime(iterations:number, squaresNumber:number, maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        for(let i = 0; i < iterations; i++) {
            this.addSquares(i);
            this.randomizeWeights(maxWeight);
            console.log(i);
            this._resetObjects = [...this._objects];
            const greedy = this.checkTime(this.doGreedy.bind(this));
            const bruteForce = this.checkTime(this.doImproveGreedy.bind(this));
            const pyramid = this.checkTime(this.pyramidAlgorithm.bind(this));
            results.greedy.push(greedy);
            results.bruteForce.push(bruteForce);
            results.pyramid.push(pyramid);
        }
        new InnerChart(results);
    }

    private iterateQuantity(iterations:number, maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        for(let i = 0; i < iterations; i++) {
            this.addSquares(i + 1);
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

    private checkTime(cb: () => number) {
        const t1 = performance.now();
        cb();
        const t2 = performance.now();
        return t2 - t1;
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

    private formSquare(objectNumber:number) {
        let xCurr = -(objectNumber) * 100 + (objectNumber / 2) * 100;
        xCurr += objectNumber % 2 ? 50 : 50;
        let yCurr = -(objectNumber / 2) * 100;
        yCurr += objectNumber % 2 ? 50 : 50;
        this.objects = this.objects.map((square, i)=> {
            square.position.x = xCurr;
            square.position.y = yCurr;
            xCurr += 100;
            if ((i + 1) % objectNumber === 0) {
                yCurr += 100;
                xCurr = -(objectNumber) * 100 + (objectNumber / 2) * 100;
                xCurr += objectNumber % 2 ? 50 : 50;
            }
            return square;
        });
    }

    public doImproveGreedy() {
        this.moveCenterMass();
        let difference = this.getDifference();
        let bestStructure:Cube[] = [...this._objects];
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
        let bestStructure:Cube[] = [];
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
        this.moveCenterMass();
        console.log(this.getDifference(), 'start')
        const sortedObjects = this._objects.sort((a, b) => a.weight - b.weight);
        this.moveCenterMass();
        let newObjects = [...sortedObjects];
        newObjects = newObjects.sort((a, b) => a.weight - b.weight);
        const left:Cube[] = [];
        const right:Cube[] = [];
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
        this.moveCenterMass();
        this.formSquare(Math.sqrt(this._objects.length));
        console.log(this.getDifference());
        let difference = this.getDifference();
        const resetObjects = [...this._objects];
        let bestStructure:Cube[] = [];
        for (let i = 0; i < this._objects.length; i++) {
            this.swap(this._objects, i, this._objects.length - 1 - i);
            this.moveCenterMass();
            const newDifference =  this.getDifference();
            if (difference > newDifference) {
                bestStructure = [...this.objects];
                difference = newDifference;
                console.log(difference);
            }
            this._objects = [...resetObjects];
        }
        this._objects = [...bestStructure];
        this.moveCenterMass();
        this.reset();
        console.log(difference, 'Pyramid');
        return difference;
    }

    public async refreshScene(isSkipAwait?:boolean, isSkipLine?: boolean) {
        if (!isSkipLine) {
            this.centerMass.visible = true;
            this.center.visible = true;
            this.formSquare(Math.sqrt(this.objects.length));
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

    private swap(arr:Cube[], i:number, j:number) {
        const {x, y, z} = arr[i].position;
        arr[i].position.x = arr[j].position.x;
        arr[i].position.y = arr[j].position.y;
        arr[i].position.z = arr[j].position.z;
        arr[j].position.x = x;
        arr[j].position.y = y;
        arr[j].position.z = z;
    }

    private getDifference = () => {
        let reducer = 0;
        reducer += Math.pow(this.center.position.x - this.centerMass.position.x, 2);
        if (this.dimensions > 1) {
            reducer += Math.pow(this.center.position.y - this.centerMass.position.y, 2);
        }
        if (this.dimensions > 2) {
            reducer += Math.pow(this.center.position.z - this.centerMass.position.z, 2);
        }
        return Math.sqrt(reducer);
    }

    public moveCenterMass() {
        this.centerMass.position.x = this.getCenterMass()[0];
        if (this.dimensions > 1) {
            this.centerMass.position.y = this.getCenterMass()[1];
        }
    }

    get objects():Cube[] {
        return this._objects;
    }
    set objects(value:Cube[]) {
        this._objects = value;
    }
}