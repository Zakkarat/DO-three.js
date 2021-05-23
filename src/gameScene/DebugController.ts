import * as dat from 'dat.gui';
import {GUI} from "dat.gui";
import Task from "./Task";
import MathUtils from "../utils/MathUtils";
import Line from "../entities/Line";
import {Events} from "../constants/Events";
import {EventEmitter} from "../utils/EventEmitter";


export default class DebugController {
    private gui: GUI;
    private task: Task;

    constructor(task:Task) {
        this.gui = new dat.GUI();
        this.task = task;
        this.gui.addFolder('Camera');
        const lines = this.gui.addFolder('Lines');
        const squares = this.gui.addFolder('Squares');
        this.createLinesFolder(lines);
        this.createSquaresFolder(squares);
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
        squares.add({changeTo2D: this.changeTo2D.bind(this)}, "changeTo2D");
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
        this.task.reformScene(lines);
        this.task.centerMass.visible = false;
        this.task.center.visible = false;
        // this.task.objects.push(Line.build(color, 200, 0));
    }

    private changeTo2D() {
        EventEmitter.emit(Events.CHANGE_TO_2D);
    }

}