import * as THREE from "three";
import Sphere from "../entities/Sphere";
import SpotLight from "../lights/SpotLight";
import Constants from "../constants/Constants";
import {HemiLight} from "../lights/HemiLight";
import {DragControls} from "three/examples/jsm/controls/DragControls";


export default class GameScene extends THREE.Scene {
    private readonly _camera:THREE.Camera;
    private readonly _pivotSphere:Sphere;
    private readonly _container:HTMLElement;
    private _rotateSpheres:Sphere[];
    private _renderer:THREE.WebGLRenderer;

    constructor() {
        super();
        this._container = document.createElement("div");
        document.body.appendChild(this._container);
        this._camera = new THREE.PerspectiveCamera(Constants.FOV, Constants.WIDTH / Constants.HEIGHT, Constants.NEAR, Constants.FAR);
        this._pivotSphere = Sphere.build(100, 30, 30, 0xfccdd3, 0, 1, 0, 0);
        this.add(this._pivotSphere);
        const axesHelper = new THREE.AxesHelper( 5 );
        this.add( axesHelper );
        this._rotateSpheres = new Array(10).fill(1).map((_, i:number) => {
                const angle = i * Constants.ANGLE;
                let sphere = Sphere.build(30, 20, 20, 0x6ed3cf,
                    Constants.RADIUS * Math.cos(angle), 4, Constants.RADIUS * Math.sin(angle), angle);
                this._pivotSphere.add(sphere);
                return sphere;
            }
        );
        new SpotLight(this, this._camera, 2.5, 300);
        new SpotLight(this, this._camera, 2.3, -300);
        new HemiLight(this);

        this._renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
        this._renderer.setPixelRatio(Constants.PIXEL_RATIO);
        this._renderer.setSize(Constants.WIDTH, Constants.HEIGHT);
        this._renderer.setClearColor(Constants.BACKGROUND_COLOR);

        this._container.appendChild(this._renderer.domElement);

        // this._camera.position.x = 300;
        // this._camera.position.y = 400;
        this._camera.position.z = 700;
        this._camera.lookAt(this.position);

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        let controls = new DragControls(this._rotateSpheres, this._camera, this._renderer.domElement);
        controls.addEventListener("dragstart", (event) => {
            event.object.onDragStart();
        });
        controls.addEventListener("dragend", (event) => {
            event.object.onDragEnd();
        });
        this.fog = new THREE.Fog(0x23272a, 0.5, 1700);

        this.animate();
    }


    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        this._renderer.render(this, this._camera);
    }
}

