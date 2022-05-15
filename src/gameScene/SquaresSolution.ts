import MathUtils from "../utils/MathUtils";
import Sphere from "../entities/Sphere";
import SquareFactory from "../factories/SquareFactory";
import {InnerChart} from "../utils/InnerChart";
import {container, singleton} from "tsyringe";
import {Task} from "./Task";
import {Settings} from "../main/Settings";

@singleton()
export default class SquaresSolution extends Task {
    private _settings: Settings;

    constructor() {
        super();
        this._settings = container.resolve(Settings);
        this.addObjectsToScene();
    }

    protected addHandlers() {
        // EventEmitter.addListener(Events.ITERATE_STATS, this.iterate.bind(this))
    }

    protected createObjects(objectNumber:number) {
        super.createObjects(objectNumber);
        const actualNumber = Math.pow(objectNumber, 2);
        for (let i = 0; i < actualNumber; i++) {
            const square = SquareFactory.build();
            this.objects.push(square);
        }
        this.formFigure(objectNumber);
    }

    public async addObjectsToScene(objectNumber?:number) {
        objectNumber = objectNumber || MathUtils.getRandomNumber(2, 6);

        this.center = Sphere.build(25, 50, 50, 0xFF0000, 0, 0, -50);
        this.centerMass = Sphere.build(25, 50, 50, 0x008000, 10, 0, -30);
        this.createObjects(objectNumber);

        this._resetObjects = [...this._objects];
        await this.doGreedy();
        await this.doImproveGreedy();
        await this.pyramidAlgorithm();
        this.scene.add(this.center, this.centerMass, ...this.objects);
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

    protected formFigure(objectNumber:number) {
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