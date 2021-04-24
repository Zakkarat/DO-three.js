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
        const overallWeight = this.objects.reduce((acc, curr) => {
            acc += curr.weight;
            return acc;
        }, 0);
        return this.objects.reduce((acc, curr) => {
            acc += curr.position.x * curr.weight;
            return acc;
        }, 0) / overallWeight;
    }

    public moveCenterMassLine() {
        this.centerMassLine.position.x = this.getCenterMass();
    }

    get objects():Entity[] {
        return this._objects;
    }
}