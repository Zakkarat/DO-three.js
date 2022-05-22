import * as THREE from "three";
import {HemiLight} from "../lights/HemiLight";
import {Events} from "../constants/Events";
import {EventEmitter} from "../utils/EventEmitter";
import {container} from "tsyringe";
import DebugController from "../gameScene/DebugController";
import Camera from "./Camera";
import GameScene from "../gameScene/GameScene";
import Renderer from "./Renderer";
import {Settings} from "./Settings";
import LinesSolution from "../gameScene/LinesSolution";
import {Task} from "../gameScene/Task";

export default class Main {
    private _camera:THREE.Camera;
    private _renderer:THREE.WebGLRenderer;
    private _task:Task;
    private _gameScene: GameScene;
    private _debugController: DebugController;
    private _settings: Settings;

    constructor() {
        this._renderer = container.resolve(Renderer);
        this._camera = container.resolve(Camera);
        this._gameScene = container.resolve(GameScene);
        this._task = container.resolve(LinesSolution)
        this._settings = container.resolve(Settings);
        this._debugController = container.resolve(DebugController);
        container.resolve(HemiLight);

        this.animate();
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

