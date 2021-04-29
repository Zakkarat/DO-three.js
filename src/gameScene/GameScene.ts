import * as THREE from "three";
// import Sphere from "../entities/Sphere";
import SpotLight from "../lights/SpotLight";
import Constants from "../constants/Constants";
import {HemiLight} from "../lights/HemiLight";
import DebugController from "./DebugController";
import Task from "./Task";
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {Object3D} from "three";
// import {DragControls} from "three/examples/jsm/controls/DragControls";


export default class GameScene extends THREE.Scene {
    private readonly _camera:THREE.Camera;
    private readonly _container:HTMLElement;
    private _renderer:THREE.WebGLRenderer;
    private recheckIntersection = true;

    constructor() {
        super();
        this._container = document.createElement("div");
        document.body.appendChild(this._container);
        new DebugController();
        this._renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
        this._camera = new THREE.OrthographicCamera(Constants.WIDTH / -2, Constants.WIDTH / 2, Constants.HEIGHT / 2, Constants.HEIGHT / -2, 1, 1000);
        this.fog = new THREE.Fog(0x23272a, 0.5, 1700);

        const task = new Task(1, this);

        this.setCameraProperties();
        this.setRendererProperties();
        this.addLights();
        this.addDragControls(task.objects);


        this.animate(task);
    }

    private addDragControls(objects:Object3D[]) {
        let controls = new DragControls(objects, this._camera, this._renderer.domElement);
        controls.addEventListener("dragstart", (event) => {
            event.object.onDragStart();
        });
        controls.addEventListener ( 'drag', (event) => {
            event.object.onDrag(); // This will prevent moving z axis, but will be on 0 line. change this to your object position of z axis.
        })
        controls.addEventListener("dragend", (event) => {
            this.recheckIntersection = true;
            event.object.onDragEnd();
        });
    }

    private addLights() {
        new SpotLight(this, this._camera, 2.5, 300);
        new SpotLight(this, this._camera, 2.3, -300);
        new HemiLight(this);
    }

    private setCameraProperties() {
        // this._camera = new THREE.PerspectiveCamera(Constants.FOV, Constants.WIDTH / Constants.HEIGHT, Constants.NEAR, Constants.FAR);
        // this._camera.position.x = 300;
        // this._camera.position.y = 400;
        // this._camera.position.z = 700;
        this._camera.lookAt(this.position);
    }

    private setRendererProperties() {
        this._renderer.setPixelRatio(Constants.PIXEL_RATIO);
        this._renderer.setSize(Constants.WIDTH, Constants.HEIGHT);
        this._renderer.setClearColor(Constants.BACKGROUND_COLOR);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._container.appendChild(this._renderer.domElement);
    }

    public render() {
        this._renderer.render(this, this._camera);
    }

    private animate(task:Task) {
        requestAnimationFrame(this.animate.bind(this, task));
        this._renderer.render(this, this._camera);
        if (this.recheckIntersection) {
            this.recheckIntersection = task.clearIntersection();
        }
        task.moveCenterMassLine();
    }
}

