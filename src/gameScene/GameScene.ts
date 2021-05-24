import * as THREE from "three";
// import Sphere from "../entities/Sphere";
// import SpotLight from "../lights/SpotLight";
import Constants from "../constants/Constants";
import {HemiLight} from "../lights/HemiLight";
import DebugController from "./DebugController";
import Task from "./Task";
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {Object3D} from "three";
import {Events} from "../constants/Events";
import {EventEmitter} from "../utils/EventEmitter";
import Task2d from "./Task2d";
import Task2dNoRender from "./Task2dNoRender";
import TaskNoRender from "./TaskNoRender";
// import {DragControls} from "three/examples/jsm/controls/DragControls";

type Tasks = Task|Task2dNoRender|Task2d;
export default class GameScene extends THREE.Scene {
    private _camera:THREE.Camera;
    private readonly _container:HTMLElement;
    private _renderer:THREE.WebGLRenderer;
    private _task:Tasks;

    constructor() {
        super();
        this._container = document.createElement("div");
        document.body.appendChild(this._container);
        this._renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
        const zoomFactor = 0;
        this._camera = new THREE.OrthographicCamera(Constants.WIDTH / -2 - zoomFactor, Constants.WIDTH / 2 + zoomFactor, Constants.HEIGHT / 2 + zoomFactor, Constants.HEIGHT / -2 - zoomFactor, 1, 1000);
        this.fog = new THREE.Fog(0x23272a, 0.5, 1700);

        this._task = new Task2dNoRender(2, this);

        new DebugController(this._task);
        this.setCameraProperties();
        this.setRendererProperties();
        this.addLights();
        this.addDragControls(this._task.objects);
        this.addHandlers();

        // this.animate();
    }

    private addHandlers() {
        EventEmitter.addListener(Events.CHANGE_TO_2D, this.onChangeTo2D);
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
        // new SpotLight(this, this._camera, 2.5, 300);
        // new SpotLight(this, this._camera, 2.3, -300);
        new HemiLight(this);
    }

    private setCameraProperties() {
        // this._camera = new THREE.PerspectiveCamera(Constants.FOV, Constants.WIDTH / Constants.HEIGHT, Constants.NEAR, Constants.FAR);
        // this._camera.position.x = 300;
        // this._camera.position.y = 400;
        // this._camera.position.z = 700;
        console.log(this.position);
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

    private onChangeTo2D() {
        this.remove(...this.children);

    }

    public render() {
        this._renderer.render(this, this._camera);
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this, this._task));
        this.render();

        this._task.moveCenterMass();
    }
}

