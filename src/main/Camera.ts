import * as THREE from "three";
import Constants from "../constants/Constants";
import {container, singleton} from "tsyringe";
import GameScene from "../gameScene/GameScene";

@singleton()
export default class Camera extends THREE.OrthographicCamera {
    private gameScene: GameScene;

    constructor() {
        super(
            Constants.WIDTH / -2 - Constants.ZOOM_FACTOR,
            Constants.WIDTH / 2 + Constants.ZOOM_FACTOR,
            Constants.HEIGHT / 2 + Constants.ZOOM_FACTOR,
            Constants.HEIGHT / -2 - Constants.ZOOM_FACTOR,
            1, 1000);
        this.gameScene = container.resolve(GameScene);
        this.setParameters();
    }

    private setParameters() {
        const position = this.gameScene.position;
        this.lookAt(position);
    }
}