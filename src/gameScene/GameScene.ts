import * as THREE from "three";
import Task from "./Task";
import {Events} from "../constants/Events";
import {EventEmitter} from "../utils/EventEmitter";
import {container, singleton} from "tsyringe";
import {Settings} from "../main/Settings";


@singleton()
export default class GameScene extends THREE.Scene {
    private _task:Task;
    private _settings:Settings;

    constructor() {
        super();
        this.fog = new THREE.Fog(0x23272a, 0.5, 1700);
        this._settings = container.resolve(Settings);
        this.addHandlers();
    }

    private addHandlers() {
        EventEmitter.addListener(Events.CHANGE_TO_2D, this.onChangeTo2D.bind(this));
        EventEmitter.addListener(Events.CHANGE_TO_1D, this.onChangeTo1D.bind(this));
    }

    private onChangeTo2D(squareNumber:number) {
        this.remove(...this.children);
        // this._task = new Task2d(2, this, squareNumber);
    }

    private onChangeTo1D() {
        this._task = container.resolve(Task);
        this._task.removeObjectsFromScene();
        this._task.addObjectsToScene();
    }
}
