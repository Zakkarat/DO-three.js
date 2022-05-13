import Entity from "../entities/Entity";
import GameScene from "./GameScene";
import MathUtils from "../utils/MathUtils";
import Line from "../entities/Line";
import {InnerChart} from "../utils/InnerChart";
import {container} from "tsyringe";
import Renderer from "../main/Renderer";
import {DragController} from "../main/DragController";
import {TimeUtils} from "../utils/TimeUtils";

type Coordinates =  "x"|"y"|"z";

export abstract class Task {
    protected dimensions: number;
    protected scene: GameScene;
    protected _objects: Entity[] = [];
    protected _resetObjects: Entity[] = [];
    protected _resolver: (value:unknown) => void = () => {};
    protected _renderer: Renderer;
    protected _dragController: DragController;
    public center: Entity = Line.build(0xFF0000, 5, 0, true);
    public centerMass: Entity = Line.build(0xFF0000, 5, 0, true);
    public isSequential: boolean = false;

    constructor() {
        this.scene = container.resolve(GameScene);
        this._renderer = container.resolve(Renderer);
        this._dragController = container.resolve(DragController);
        this.centerMass = this.createCenterMass();

        this.scene.add(this.center, this.centerMass);
        this.addHandlers();
        this.addObjectsToScene();
    }

    protected addHandlers() {}

    public async addObjectsToScene(objectNumber?:number) {}

    public removeObjectsFromScene() {}

    protected formFigure(objectNumber?:number) {}

    protected async iterateQuantity(iterations:number, maxWeight:number) {}

    protected async iterate(iterations:number, number:number, maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        for(let i = 0; i < iterations; i++) {
            this.createObjects(number);
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

    protected async iterateTime(iterations:number, maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        for(let i = 0; i < iterations; i++) {
            this.createObjects(i + 2);
            this.randomizeWeights(maxWeight);
            console.log(i);
            this._resetObjects = [...this._objects];
            const greedy = await TimeUtils.checkTime(this.doGreedy.bind(this));
            const bruteForce = await TimeUtils.checkTime(this.doImproveGreedy.bind(this));
            const pyramid = await TimeUtils.checkTime(this.pyramidAlgorithm.bind(this));
            results.greedy.push(greedy);
            results.bruteForce.push(bruteForce);
            results.pyramid.push(pyramid);
        }
        new InnerChart(results);
    }

    protected createObjects(objectNumber:number) {
        this.scene.remove(...this.objects);
        this.objects = [];
    }

    protected randomizeWeights(maxWeight:number) {
        this._objects.forEach(elem => elem.weight = MathUtils.getRandomNumber(0, maxWeight));
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

    protected createCenterMass():Line {
        const centerMass = this.getCenterMass();

        return Line.build(0xFFFF00, 5, centerMass[0], true);
    }

    protected getCenterMass() {
        const overallWeight = this._objects.reduce((acc, curr) => {
            acc += curr.weight;
            return acc;
        }, 0);
        const coordinates:Coordinates[] = ["x", "y", "z"];
        return coordinates.map(coordinate => this.getCenterMassCoordinate(overallWeight, coordinate));
    }

    protected getCenterMassCoordinate(overallWeight:number, coordinate:Coordinates) {
        return this._objects.reduce((acc, curr) => {
            acc += curr.position[coordinate] * curr.weight;
            return acc;
        }, 0) / overallWeight;
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
                    j=0;
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
        let resetObjects = [...this._objects];
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
            this.formFigure();
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
        return Math.sqrt(reducer);
    }

    public moveCenterMass() {
        this.centerMass.position.x = this.getCenterMass()[0];
        if (this.dimensions > 1) {
            this.centerMass.position.y = this.getCenterMass()[1];
        }
        if (this.dimensions > 2) {
            this.centerMass.position.z = this.getCenterMass()[2];
        }
    }

    get objects():Entity[] {
        return this._objects;
    }
    set objects(value:Entity[]) {
        this._objects = value;
    }
}