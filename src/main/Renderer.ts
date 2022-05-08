import * as THREE from "three";
import Constants from "../constants/Constants";
import {container, singleton} from "tsyringe";
import GameScene from "../gameScene/GameScene";
import Camera from "./Camera";
import {EventEmitter} from "../utils/EventEmitter";
import {Events} from "../constants/Events";

@singleton()
export default class Renderer extends THREE.WebGLRenderer {
    private _gameScene: GameScene;
    private _camera: Camera;
    private _container:HTMLElement;

    constructor() {
        super({antialias: true, alpha: false});
        this._gameScene = container.resolve(GameScene);
        this.appendToDOM();
        this.setParameters();
    }

    private appendToDOM() {
        this._container = document.createElement("div");
        document.body.appendChild(this._container);
    }

    private setParameters() {
        this.setPixelRatio(Constants.PIXEL_RATIO);
        this.setSize(Constants.WIDTH, Constants.HEIGHT);
        this.setClearColor(Constants.BACKGROUND_COLOR);
        this.shadowMap.enabled = true;
        this.shadowMap.type = THREE.PCFSoftShadowMap;
        this._container.appendChild(this.domElement);
    }

    public render() {
        super.render(this._gameScene, this._camera);
    }

    public animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();

        EventEmitter.emit(Events.RENDER_REFRESH);
    }
}