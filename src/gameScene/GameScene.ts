import * as THREE from "three";
import DebugController from "./DebugController";
import Task from "./Task";
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {Object3D} from "three";
import {Events} from "../constants/Events";
import {EventEmitter} from "../utils/EventEmitter";
import Task2d from "./Task2d";
import Task2dNoRender from "./Task2dNoRender";
import {singleton} from "tsyringe";

type Tasks = Task|Task2dNoRender|Task2d;

@singleton()
export default class GameScene extends THREE.Scene {
    private _camera:THREE.Camera;
    private _renderer:THREE.WebGLRenderer;
    private _task:Tasks;
    private debugController: DebugController;

    constructor() {
        super();
        this.fog = new THREE.Fog(0x23272a, 0.5, 1700);

        this.addHandlers();
    }

    private addHandlers() {
        EventEmitter.addListener(Events.CHANGE_TO_2D, this.onChangeTo2D.bind(this));
        EventEmitter.addListener(Events.CHANGE_TO_1D, this.onChangeTo1D.bind(this));
    }

    private addDragControls(objects:Object3D[]) {
        let controls = new DragControls(objects, this._camera, this._renderer.domElement);
        controls.addEventListener("dragstart", (event) => {
            event.object.onDragStart();
        });
        controls.addEventListener ( 'drag', (event) => {
            event.object.onDrag();
        })
        controls.addEventListener("dragend", (event) => {
            event.object.onDragEnd();
        });
    }

    private onChangeTo2D(squareNumber:number) {
        this.remove(...this.children);
        this._task = new Task2d(2, this, squareNumber);
        this.debugController = new DebugController(this._task);
        this.addDragControls(this._task.objects);
    }

    private onChangeTo1D() {
        this.remove(...this.children);
        this._task = new Task(1);
        this.debugController = new DebugController(this._task);
        this.addDragControls(this._task.objects);
    }
}

