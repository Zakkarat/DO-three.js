import Entity from "../entities/Entity";
import GameScene from "./GameScene";
import MathUtils from "../utils/MathUtils";
import LineFactory from "../factories/LineFactory";
import Line from "../entities/Line";


export default class Task {
    private dimensions: number;
    private scene: GameScene;
    private _objects: Entity[] = [];
    private _resetObjects: Entity[] = [];
    private centerLine: Line = Line.build(0xFF0000, 5, 0, true);
    private centerMassLine: Line = Line.build(0xFF0000, 5, 0, true);
    private _resolver: (value:unknown) => void = () => {};
    public isSequential: boolean = false;

    constructor(dimensions:number, scene:GameScene, objectNumber?:number) {
        this.dimensions = dimensions;
        this.scene = scene;

        this.addTaskObjectsToScene(objectNumber);
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
        this.centerMassLine = this.createCenterMassLine();
        this.scene.add(...this._objects, this.centerLine, this.centerMassLine);
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

    // private findMinMaxBounds():number[] {
    //     const bounds:number[] = [];
    //     this.objects.forEach(elem => elem.getBoundaries().forEach(bound => bounds.push(bound)));
    //     return [Math.min(...bounds), Math.max(...bounds)];
    // }

    private createCenterMassLine():Line {
        const centerMass = this.getCenterMass();

        return Line.build(0xFFFF00, 5, centerMass, true);
    }

    private getCenterMass() {
        const overallWeight = this._objects.reduce((acc, curr) => {
            acc += curr.weight;
            return acc;
        }, 0);
        return this._objects.reduce((acc, curr) => {
            acc += curr.position.x * curr.weight;
            return acc;
        }, 0) / overallWeight;
    }

    private formLine() {
        const lineWidth = this._objects.reduce((acc, curr) => {
            acc += curr.getWidth();
            return acc;
        }, 0)
        const start = this.centerLine.position.x - lineWidth / 2;
        this._objects.reduce((acc,curr) => {
            curr.position.x = acc + curr.getWidth() / 2;
            acc += curr.getWidth();
            return acc;
        }, start);
    }

    public async doImproveGreedy() {
        this._objects = this._objects.sort((a, b) => a.weight - b.weight);
        await this.refreshScene();
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
        console.log(difference, 'ImproveGreedy');
    }

    public async doGreedy() {
        this._objects = this._objects.sort((a, b) => a.weight - b.weight);
        console.log(this.isSequential);
        await this.refreshScene();
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
        await this.refreshScene();
        for (let i = 0; i < this._objects.length; i++) {
            this.swap(this._objects, i, this._objects.length - 1 - i);
            await this.refreshScene();
        }
        this.reset();
        console.log(this.getDifference(), 'Pyramid');
    }

    public async refreshScene(isSkip?:boolean) {
        this.formLine();
        this.moveCenterMassLine();
        this.scene.render();
        if (this.isSequential && !isSkip) {
            await this.createAwaiter();
        }
    }

    public reformScene(newEntities: Entity[]) {
        this.scene.remove(...this.objects);
        this.objects = [...newEntities];
        this._resetObjects = [...newEntities];
        this.scene.add(...this.objects);
        this.refreshScene(true);
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
        return Math.abs(this.centerLine.position.x - this.centerMassLine.position.x);
    }

    public moveCenterMassLine() {
        this.centerMassLine.position.x = this.getCenterMass();
    }

    get objects():Entity[] {
        return this._objects;
    }
    set objects(value:Entity[]) {
        this._objects = value;
    }
}