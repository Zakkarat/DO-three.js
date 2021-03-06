import MathUtils from "../utils/MathUtils";
import Sphere from "../entities/Sphere";
import SquareFactory from "../factories/SquareFactory";
import {InnerChart} from "../utils/InnerChart";
import {singleton} from "tsyringe";
import {Task} from "./Task";

@singleton()
export default class SquaresSolution extends Task {

    constructor() {
        super();
        this.addObjectsToScene(this._settings.initialRowData.length);
    }

    protected addHandlers() {
        // EventEmitter.addListener(Events.ITERATE_STATS, this.iterate.bind(this))
    }

    protected createObjects(objectNumber:number = 2) {
        super.createObjects(objectNumber);

        const actualNumber = this.getSquareActualNumber(objectNumber);
        const isFromRowData = this._settings.initialRowData.length;
        for (let i = 0; i < actualNumber; i++) {
            const elementData = this._settings.initialRowData[i];
            const weight = isFromRowData ? elementData?.weight || -1 : 0;
            const square = SquareFactory.build(weight);
            this._objects.push(square);
        }
        this.formFigure();
    }

    private getSquareActualNumber(objectNumber: number) {
        let preSquaredObject = objectNumber;
        if (this._settings.initialRowData.length) {
            preSquaredObject = Number(Math.log2(objectNumber * 2 - 1).toFixed(0));
        }
        return Math.pow(preSquaredObject, 2);
    }

    public async addObjectsToScene(objectNumber:number = 5) {
        objectNumber = objectNumber || MathUtils.getRandomNumber(2, 6);

        this.center = Sphere.build(25, 50, 50, 0xFF0000, 0, 0, -50);
        this.centerMass = Sphere.build(25, 50, 50, 0x008000, 10, 0, -30);
        this.createObjects(objectNumber);

        this._resetObjects = [...this._objects];
        await this.doGreedy();
        await this.doImproveGreedy();
        await this.pyramidAlgorithm();
        this.scene.add(this.center, this.centerMass, ...this._objects);
        super.addObjectsToScene();
    }

    protected async iterateQuantity(iterations:number, maxWeight:number) {
        console.log(iterations);
        const results:AlgosResults = {
            greedy: [],
            bruteForce: [],
            pyramid: []
        };
        for(let i = 1; i < iterations; i++) {
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
        new InnerChart(results);
    }

    protected formFigure() {
        const objectNumber = Number(Math.log2(this.objects.length).toFixed(0));
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
}