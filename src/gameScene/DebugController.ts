import * as dat from 'dat.gui';
import {GUI} from "dat.gui";
import Task from "./Task";
import MathUtils from "../utils/MathUtils";
import Line from "../entities/Line";


export default class DebugController {
    private gui: GUI;
    private task: Task;

    constructor(task:Task) {
        this.gui = new dat.GUI();
        this.task = task;
        this.gui.addFolder('Camera');
        const lines = this.gui.addFolder('Lines');

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

    private createDebugLines() {
        const lines = []
        lines.push(Line.build(MathUtils.getRandomColor(), 200, 0, false, 20));
        lines.push(Line.build(MathUtils.getRandomColor(), 150, 0, false, 15));
        lines.push(Line.build(MathUtils.getRandomColor(), 300, 0, false, 12));
        lines.push(Line.build(MathUtils.getRandomColor(), 120, 0, false, 48));
        lines.push(Line.build(MathUtils.getRandomColor(), 170, 0, false, 32));
        this.task.reformScene(lines);
        // this.task.objects.push(Line.build(color, 200, 0));
    }

}