import Entity from "../entities/Entity";
import GameScene from "./GameScene";
import MathUtils from "../utils/MathUtils";
import LineFactory from "../factories/LineFactory";
import Line from "../entities/Line";


export default class Task {
    private dimensions: number;
    private scene: GameScene;
    private _objects: Entity[] = [];
    private centerLine: Line = Line.build(0xFF0000, 5, 0, true);
    private centerMassLine: Line = Line.build(0xFF0000, 5, 0, true);
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
        this.doGreedy();
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

    private doGreedy() {
        this._objects = this._objects.sort((a, b) => a.weight - b.weight);
        this.refreshScene();
        let difference = this.getDifference();
        // let bestStructure:Entity[] = [];
        // console.log(difference);
        // const resetObjects = [...this._objects];
        // for (let i = 0; i < this._objects.length; i++) {
        //     for (let j = 0; j < this._objects.length; j++) {
        //         this.swap(this._objects, i, j);
        //         console.log(this.objects);
        //         this.refreshScene();
        //         console.log(this.getDifference());
        //         if (difference > this.getDifference()) {
        //             bestStructure = [...this._objects];
        //             difference = this.getDifference();
        //         } else {
        //             this._objects = [...resetObjects];
        //         }
        //     }
        // }
        // this._objects = [...bestStructure];
        // this.refreshScene();
        // console.log(difference);
        const newObjects = [...this._objects];
        const arr1 = newObjects.slice(0, newObjects.length / 2);
        const arr2 = newObjects.slice(newObjects.length / 2, newObjects.length);
        arr2.sort((a, b) => {
            return b.weight - a.weight;
        });
        this._objects = arr1.concat(arr2);
        for (let i = 0; i < this._objects.length; i++) {
            this.swap(this._objects, i, this._objects.length - 1  - i);
            this.refreshScene();
            this.formLine();
        }
        this.formLine();
    }

    private refreshScene() {
        this.formLine();
        this.moveCenterMassLine();
        this.scene.render();
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
}