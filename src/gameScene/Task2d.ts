import Entity from "../entities/Entity";
import GameScene from "./GameScene";
import MathUtils from "../utils/MathUtils";
import LineFactory from "../factories/LineFactory";
import Line from "../entities/Line";
import {EventEmitter} from "../utils/EventEmitter";
import {Events} from "../constants/Events";
import Sphere from "../entities/Sphere";
import SquareFactory from "../factories/SquareFactory";
import Constants from "../constants/Constants";

type Coordinates =  "x"|"y"|"z";

export default class Task2d {
    private dimensions: number;
    private scene: GameScene;
    private _objects: Entity[] = [];
    private _resetObjects: Entity[] = [];
    public center: Entity = Line.build(0xFF0000, 5, 0, true);
    public centerMass: Entity = Line.build(0xFF0000, 5, 0, true);
    private _resolver: (value:unknown) => void = () => {};
    public isSequential: boolean = false;

    constructor(dimensions:number, scene:GameScene, objectNumber?:number) {
        this.dimensions = dimensions;
        this.scene = scene;

        this.addTaskObjectsToScene(objectNumber);
        this.addHandlers();
        // EventEmitter.emit(Events.CHANGE_TO_2D);
    }

    private addHandlers() {
        EventEmitter.addListener(Events.CHANGE_TO_2D, this.onChangeTo2D.bind(this));
    }

    private onChangeTo2D() {
        this.dimensions = 2;
        this.scene.remove(...this.objects, this.center, this.centerMass);

        this.addSquares();
        this.center = Sphere.build(25, 50, 50, 0xFF0000, 0, 0, -50);
        this.centerMass = Sphere.build(25, 50, 50, 0x008000, 10, 0, -30);
        this.scene.add(this.center, this.centerMass, ...this.objects);
    }

    private addSquares() {
        const points = [];
        let xCurr = Constants.LEFT;
        while (xCurr > Constants.RIGHT) {
            points.push({x: xCurr, y: Constants.TOP});
            xCurr -= 100;
        }
        let yCurr = Constants.TOP - 100;
        const pointsNumber = points.length;
        const startPoint = points[0];
        while (yCurr > Constants.BOTTOM) {
            for (let i = 0; i < pointsNumber; i++) {
                points.push({x: points[i].x, y: yCurr});
            }
            yCurr -= 100;
        }
        for (let i = 0; i < points.length; i++) {
            const square = SquareFactory.build(points[i].x, points[i].y);
            this.objects.push(square);
        }
    }

    private addTaskObjectsToScene(objectNumber?:number) {
        objectNumber = objectNumber || MathUtils.getRandomNumber(1, 6);

        for (let i = 0; i < objectNumber; i++) {
            const line = LineFactory.build();
            this._objects.push(line);
        }

        this._resetObjects = [...this._objects];
        this.doGreedy();
        this.doImproveGreedy();
        this.pyramidAlgorithm();
        this.centerMass = this.createCenterMass();
        this.scene.add(...this._objects, this.center, this.centerMass);

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

    private createCenterMass():Line {
        const centerMass = this.getCenterMass();

        return Line.build(0xFFFF00, 5, centerMass[0], true);
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
            acc += curr.getWidth();
            return acc;
        }, 0)
        const start = this.center.position.x - lineWidth / 2;
        this._objects.reduce((acc,curr) => {
            curr.position.x = acc + curr.getWidth() / 2;
            acc += curr.getWidth();
            return acc;
        }, start);
    }

    public async doImproveGreedy() {
        let difference = this.getDifference();
        let bestStructure:Entity[] = [];
        const resetObjects = [...this._objects];
        for (let i = 0; i < this._objects.length; i++) {
            for (let j = 0; j < this._objects.length; j++) {
                this.swap(this._objects, i, j);
                await this.refreshScene();
                if (difference > this.getDifference()) {
                    bestStructure = [...this._objects];
                    difference = this.getDifference();
                } else {
                    this._objects = [...resetObjects];
                }
            }
        }
        this._objects = [...bestStructure];
        await this.refreshScene();
        this.reset();
        console.log(difference, 'BruteForce');
    }

    public async doGreedy() {
        let difference = this.getDifference();
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
        this.refreshScene(true);
        this.reset();
    }

    public async pyramidAlgorithm() {
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
        let difference = this.getDifference();
        await this.refreshScene();
        const resetObjects = [...this._objects];
        let bestStructure:Entity[] = [];
        for (let i = 0; i < this._objects.length; i++) {
            this.swap(this._objects, i, this._objects.length - 1 - i);
            await this.refreshScene();
            if (difference > this.getDifference()) {
                bestStructure = [...this.objects];
                difference = this.getDifference();
            }
            this._objects = [...resetObjects];
        }
        this._objects = [...bestStructure];
        await this.refreshScene();
        this.reset();
        console.log(this.getDifference(), 'Pyramid');
    }

    public async refreshScene(isSkipAwait?:boolean, isSkipLine?: boolean) {
        if (!isSkipLine) {
            this.centerMass.visible = true;
            this.center.visible = true;
            if (this.dimensions === 1) {
                this.formLine();
            }
        }
        this.moveCenterMass();
        this.scene.render();
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

    private swapPositions(arr:Entity[], i:number, j:number) {
        const temp = {...arr[i].position};
        arr[i].position.set(arr[j].position.x, arr[j].position.y, arr[j].position.z);
        arr[j].position.set(temp.x, temp.y, temp.z);
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