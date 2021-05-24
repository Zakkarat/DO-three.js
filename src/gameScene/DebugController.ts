import * as dat from 'dat.gui';
import {GUI} from "dat.gui";
import Task from "./Task";
import MathUtils from "../utils/MathUtils";
import Line from "../entities/Line";
import {Events} from "../constants/Events";
import {EventEmitter} from "../utils/EventEmitter";
import Task2d from "./Task2d";
import Task2dNoRender from "./Task2dNoRender";

type Tasks = Task|Task2dNoRender|Task2d;

export default class DebugController {
    private gui: GUI;
    private task: Tasks;
    private iterations:number = 10;
    private entities:number = 10;
    private weight:number = 100;

    constructor(task:Task|Task2d) {
        this.gui = new dat.GUI();
        this.task = task;
        this.gui.addFolder('Camera');
        const lines = this.gui.addFolder('Lines');
        const squares = this.gui.addFolder('Squares');
        const iterations = this.gui.addFolder('Iterations');
        this.createLinesFolder(lines);
        this.createSquaresFolder(squares);
        this.createIterationFolder(iterations);
    }

    private createLinesFolder(lines:GUI) {
        const isSequentialChanger = lines.add({isSequential: this.task.isSequential}, "isSequential");
        lines.add({createLine: this.createDebugLines.bind(this)}, "createLine");
        lines.add({doGreedy: this.task.doGreedy.bind(this.task)}, "doGreedy");
        lines.add({doImproveGreedy: this.task.doImproveGreedy.bind(this.task)}, "doImproveGreedy");
        lines.add({pyramidAlgorithm: this.task.pyramidAlgorithm.bind(this.task)}, "pyramidAlgorithm");
        lines.add({refresh: this.task.refreshScene.bind(this.task)}, "refresh");
        lines.add({reset: this.task.reset.bind(this.task)}, "reset");
        lines.add({next: this.task.next.bind(this.task)}, "next");

        isSequentialChanger.onChange((value => this.task.isSequential = value));
    }

    private createSquaresFolder(squares:GUI) {
        const isSequentialChanger = squares.add({isSequential: this.task.isSequential}, "isSequential");
        squares.add({createLine: this.createDebugLines.bind(this)}, "createLine");
        squares.add({doGreedy: this.task.doGreedy.bind(this.task)}, "doGreedy");
        squares.add({doImproveGreedy: this.task.doImproveGreedy.bind(this.task)}, "doImproveGreedy");
        squares.add({pyramidAlgorithm: this.task.pyramidAlgorithm.bind(this.task)}, "pyramidAlgorithm");
        squares.add({refresh: this.task.refreshScene.bind(this.task)}, "refresh");
        squares.add({reset: this.task.reset.bind(this.task)}, "reset");
        squares.add({next: this.task.next.bind(this.task)}, "next");

        isSequentialChanger.onChange((value => this.task.isSequential = value));
    }

    private createIterationFolder(squares:GUI) {
        squares.add({iterations: this.iterations}, "iterations").onChange((value => this.iterations = value));
        squares.add({entities: this.entities}, "entities").onChange((value => this.entities = value));
        squares.add({weight: this.weight}, "weight").onChange((value => this.weight = value));
        squares.add({iterate: this.callIteration.bind(this)}, "iterate");

    }

    private createDebugLines() {
        const lines = []
        lines.push(Line.build(MathUtils.getRandomColor(), 300, 0, false, 15));
        lines.push(Line.build(MathUtils.getRandomColor(), 120, 0, false, 16));
        lines.push(Line.build(MathUtils.getRandomColor(), 170, 0, false, 43));
        lines.push(Line.build(MathUtils.getRandomColor(), 250, 0, false, 20));
        lines.push(Line.build(MathUtils.getRandomColor(), 300, 0, false, 50));
        const lineWidth = lines.reduce((acc, curr) => {
            acc += curr.getWidth();
            return acc;
        }, 0)
        const start = this.task.center.position.x - lineWidth / 2;
        lines.reduce((acc,curr) => {
            curr.position.x = acc + curr.getWidth() / 2;
            acc += curr.getWidth() + 20;
            return acc;
        }, start);
        // @ts-ignore
        this.task.reformScene(lines);
        this.task.centerMass.visible = false;
        this.task.center.visible = false;
        // this.task.objects.push(Line.build(color, 200, 0));
    }

    private callIteration() {
        EventEmitter.emit(Events.ITERATE_STATS, this.iterations, this.entities, this.weight);
    }

}