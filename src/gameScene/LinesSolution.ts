import MathUtils from "../utils/MathUtils";
import LineFactory from "../factories/LineFactory";
import {InnerChart} from "../utils/InnerChart";
import {singleton} from "tsyringe";
import {Events} from "../constants/Events";
import {EventEmitter} from "../utils/EventEmitter";
import {Task} from "./Task";

@singleton()
export default class LinesSolution extends Task {

    constructor() {
        super();
        this.addObjectsToScene();
    }

    protected addHandlers() {
        EventEmitter.addListener(Events.RENDER_REFRESH, this.moveCenterMass.bind(this))
        // EventEmitter.addListener(Events.ITERATE_STATS, this.iterateQuantity.bind(this))
    }

    public async addObjectsToScene(objectNumber?:number) {
        objectNumber = objectNumber || MathUtils.getRandomNumber(1, 6);
        this.createObjects(objectNumber);

        this._resetObjects = [...this._objects];
        await this.doGreedy();
        await this.doImproveGreedy();
        await this.pyramidAlgorithm();
        this.scene.add(...this._objects);
        this._dragController.addDragControls(this.objects);
    }

    public removeObjectsFromScene() {
        this.scene.remove(...this.objects);
        this._dragController.removeDragControls();
    }

    protected createObjects(objectNumber:number) {
        super.createObjects(objectNumber);
        for (let i = 0; i < objectNumber; i++) {
            const line = LineFactory.build();
            this._objects.push(line);
        }
        this.formFigure();
    }

    protected async iterateQuantity(iterations:number, maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        for(let i = 1; i < 10; i++) {
            this.createObjects(i + 1);
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
        this.createObjects(25);
        this.randomizeWeights(maxWeight);
        this._resetObjects = [...this._objects];
        const greedy = await this.doGreedy();
        const bruteForce = await this.doImproveGreedy();
        const pyramid = await this.pyramidAlgorithm();
        results.greedy.push(greedy);
        results.bruteForce.push(bruteForce);
        results.pyramid.push(pyramid);
        for(let i = 50; i <= iterations; i = i + 25) {
            this.createObjects(i);
            console.log(i, "ITERAZIONEN")
            this.randomizeWeights(maxWeight);
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

    protected formFigure() {
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

}