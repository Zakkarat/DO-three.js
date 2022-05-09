import Entity from "../entities/Entity";
import GameScene from "./GameScene";
import MathUtils from "../utils/MathUtils";
import Line from "../entities/Line";
import Sphere from "../entities/Sphere";
import SquareFactory from "../factories/SquareFactory";
import {InnerChart} from "../utils/InnerChart";

type Coordinates =  "x"|"y"|"z";

export default class Task2d {
    private scene: GameScene;
    private _objects: Entity[] = [];
    private _resetObjects: Entity[] = [];
    public center: Entity = Line.build(0xFF0000, 5, 0, true);
    public centerMass: Entity = Line.build(0xFF0000, 5, 0, true);
    private _resolver: (value:unknown) => void = () => {};
    public isSequential: boolean = false;

    constructor(dimensions:number, scene:GameScene, objectNumber?:number) {
        this.scene = scene;

        this.addTaskObjectsToScene(objectNumber);
        this.addHandlers();
    }

    private addHandlers() {
        // EventEmitter.addListener(Events.ITERATE_STATS, this.iterate.bind(this))
    }

    private addSquares(objectNumber:number) {
        this.scene.remove(...this.objects);
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

        this.center = Sphere.build(25, 50, 50, 0xFF0000, 0, 0, -50);
        this.centerMass = Sphere.build(25, 50, 50, 0x008000, 10, 0, -30);
        this.addSquares(objectNumber);


        this._resetObjects = [...this._objects];
        // await this.doGreedy();
        // await this.doImproveGreedy();
        // await this.pyramidAlgorithm();
        this.scene.add(this.center, this.centerMass, ...this.objects);

    }

    public clearIntersection():boolean {
        let isRecheckNeeded = false;
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = 0; j < this.objects.length; j++) {
                if (i === j) {
                    break;
                }
                let currentObjectBounds = this.objects[i].getBoundaries();
                let neighborObjectBounds = this.objects[j].getBoundaries();
                let mover = 1;
                if (MathUtils.isIntersect(currentObjectBounds, neighborObjectBounds)){
                    isRecheckNeeded = true;
                    this.objects[i].position.x += 1;
                    currentObjectBounds = this.objects[i].getBoundaries();
                    neighborObjectBounds = this.objects[j].getBoundaries();
                    if (this.objects[i].position.x > 400 || this.objects[i].position.x < 400) {
                        mover = -mover;
                    }
                }
            }
        }
        return isRecheckNeeded;
    }

    private async iterate(iterations:number, squaresNumber:number,  maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        for(let i = 0; i < iterations; i++) {
            this.addSquares(squaresNumber);
            this.randomizeWeights(maxWeight);
            this._resetObjects = [...this._objects];
            this.scene.add(...this.objects);
            const greedy = await this.doGreedy();
            const bruteForce = await this.doImproveGreedy();
            const pyramid = await this.pyramidAlgorithm();
            results.greedy.push(greedy);
            results.bruteForce.push(bruteForce);
            results.pyramid.push(pyramid);
        }
        new InnerChart(results);
    }

    private async iterateTime(iterations:number, squaresNumber:number, maxWeight:number) {
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
            const greedy = await this.checkTime(this.doGreedy.bind(this));
            const bruteForce = await this.checkTime(this.doImproveGreedy.bind(this));
            const pyramid = await this.checkTime(this.pyramidAlgorithm.bind(this));
            results.greedy.push(greedy);
            results.bruteForce.push(bruteForce);
            results.pyramid.push(pyramid);
        }
        new InnerChart(results);
    }

    private async iterateQuantity(iterations:number, maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        for(let i = 1; i < iterations; i++) {
            this.addSquares(i + 1);
            this.randomizeWeights(maxWeight);
            console.log(i);
            this._resetObjects = [...this._objects];
            const greedy = await this.doGreedy();
            const bruteForce = await this.doImproveGreedy();
            const pyramid = await this.pyramidAlgorithm();
            results.greedy.push(greedy);
            results.bruteForce.push(bruteForce);
            results.pyramid.push(pyramid);
        }
        new InnerChart(results);
    }

    private async checkTime(cb: () => Promise<number>) {
        const t1 = performance.now();
        await cb();
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

    public async doImproveGreedy() {
        await this.refreshScene(true);
        let difference = Infinity;
        let bestStructure:Entity[] = [];
        let resetObjects = [...this._objects];
        for (let i = 0; i < this._objects.length; i++) {
            for (let j = 0; j < this._objects.length; j++) {
                this.swap(this._objects, i, j);
                await this.refreshScene();
                if (difference > this.getDifference()) {
                    bestStructure = [...this._objects];
                    resetObjects = [...bestStructure];
                    difference = this.getDifference();
                    j = 0;
                } else {
                    this._objects = [...resetObjects];
                }
            }
        }
        this._objects = [...bestStructure];
        await this.refreshScene();
        this.reset();
        console.log(difference, 'BruteForce');
        return difference;
    }

    public async doGreedy() {
        await this.refreshScene(true);
        let difference = Infinity;
        let bestStructure:Entity[] = [];
        const resetObjects = [...this._objects];
        for (let i = 0; i < this._objects.length; i++) {
            for (let j = 0; j < this._objects.length; j++) {
                this.swap(this._objects, i, j);
                await this.refreshScene();
                if (difference > this.getDifference()) {
                    bestStructure = [...this.objects];
                    difference = this.getDifference();
                }
                this._objects = [...resetObjects];
            }
        }
        console.log(difference, 'Greedy');
        this._objects = [...bestStructure];
        await this.refreshScene(true);
        this.reset();
        return difference;
    }


    public async pyramidAlgorithm() {
        await this.refreshScene();
        this.moveCenterMass();
        this._objects = this._objects.sort((a, b) => a.weight - b.weight);
        await this.refreshScene();
        let newObjects = [...this._objects];
        newObjects = newObjects.sort((a, b) => a.weight - b.weight);
        const left:Entity[] = [];
        const right:Entity[] = [];
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
        await this.refreshScene();
        let difference = this.getDifference();
        let resetObjects = [...this._objects];
        let bestStructure:Entity[] = [...this.objects];
        for (let i = 0; i < this._objects.length; i++) {
            this.swap(this.objects, i, this.objects.length - 1 - i);
            await this.refreshScene();
            this.moveCenterMass();
            if (difference > this.getDifference()) {
                bestStructure = [...this.objects];
                resetObjects = [...bestStructure];
                difference = this.getDifference();
                console.log(difference);
            } else {
                bestStructure = [...resetObjects];
            }
        }
        this._objects = [...bestStructure];
        await this.refreshScene();
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
        if (this.isSequential && !isSkipAwait) {
            await this.createAwaiter();
        }
    }

    public reformScene(newEntities: Entity[]) {
        this.scene.remove(...this.objects);
        this.objects = [...newEntities];
        this._resetObjects = [...newEntities];
        this.scene.add(...this.objects);
        this.refreshScene(true, true);
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

    private swap(arr:Entity[], i:number, j:number) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    private getDifference = () => {
        let reducer = 0;
        reducer += Math.pow(this.center.position.x - this.centerMass.position.x, 2);
        reducer += Math.pow(this.center.position.y - this.centerMass.position.y, 2);
        reducer += Math.pow(this.center.position.z - this.centerMass.position.z, 2);
        return Math.sqrt(reducer);
    }

    public moveCenterMass() {
        this.centerMass.position.x = this.getCenterMass()[0];
        this.centerMass.position.y = this.getCenterMass()[1];
        this.centerMass.position.z = this.getCenterMass()[2];
    }

    get objects():Entity[] {
        return this._objects;
    }
    set objects(value:Entity[]) {
        this._objects = value;
    }
}