import * as THREE from "three";
import Constants from "../constants/Constants";
import {HemiLight} from "../lights/HemiLight";
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {Object3D} from "three";
import {Events} from "../constants/Events";
import {EventEmitter} from "../utils/EventEmitter";
import {container} from "tsyringe";
import Task2dNoRender from "../gameScene/Task2dNoRender";
import Task from "../gameScene/Task";
import Task2d from "../gameScene/Task2d";
import DebugController from "../gameScene/DebugController";
import Camera from "./Camera";
import GameScene from "../gameScene/GameScene";
import Renderer from "./Renderer";
import {Settings} from "./Settings";

type Tasks = Task|Task2dNoRender|Task2d;

export default class Main {
    private _camera:THREE.Camera;
    private _renderer:THREE.WebGLRenderer;
    private _task:Tasks;
    private _gameScene: GameScene;
    private _debugController: DebugController;
    private _settings: Settings;

    constructor() {
        this._renderer = container.resolve(Renderer);
        this._camera = container.resolve(Camera);
        this._gameScene = container.resolve(GameScene);
        this._task = container.resolve(Task)
        this._settings = container.resolve(Settings);
        this._debugController = container.resolve(DebugController);

        this.addLights();
        this.animate();
    }

    private addLights() {
        new HemiLight();
    }

    public render() {
        this._renderer.render(this._gameScene, this._camera);
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this, this._task));
        this.render();

        EventEmitter.emit(Events.RENDER_REFRESH);
    }
}

