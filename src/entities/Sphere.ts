import * as THREE from "three";
import {MeshLambertMaterial, SphereBufferGeometry, Vector3} from "three";
import MathUtils from "../utils/MathUtils";
import Constants from "../constants/Constants";

export default class Sphere extends THREE.Mesh {
    private _distance:number = 0;
    private _direction:Vector3 = new Vector3(0, 0, 0);
    private _position:Vector3 = new Vector3(0,0,0);
    private _initialTime:number = 0;
    private _finalTime:number = 0;
    private _now:number = 0;
    private _angle:number = 0;

    public locked = false;
    public traveling = false;

    public static ROTATE_ITERATOR = 0.1;

    static build(radius:number, widthSegments:number, heightSegments:number,
                 color:number, x:number, y:number, z:number, angle:number):Sphere {
        let sphereBufferGeometry = new SphereBufferGeometry(radius, widthSegments, heightSegments);
        let meshLambertMaterial = new MeshLambertMaterial({color});
        let result = new Sphere(sphereBufferGeometry, meshLambertMaterial);
        result.receiveShadow = true;
        result.position.set(x, y, z);
        result._angle = angle;
        return result;
    }

    public rotateAround() {
        this._position = new Vector3(164 * Math.cos(this._angle) * (1 + 0.9 * Math.abs(Math.cos(Sphere.ROTATE_ITERATOR))), 4,
            164 * Math.sin(this._angle) * (1 + 0.9 * Math.abs(Math.cos(Sphere.ROTATE_ITERATOR))));
        this._angle += 0.01;
        Sphere.ROTATE_ITERATOR += 0.001;
        if (!this.locked && !this.traveling) {
            this.position.set(this._position.x, this._position.y, this._position.z);
        }
    }

    public onDragStart() {
        this.locked = true;
    }

    public onDragEnd() {
        this.locked = false;
        const position:Vector3 = new Vector3();
        this.getWorldPosition(position)
        if (position.y !== 5) {
            this._initialTime = Date.now();
            this._finalTime = this._initialTime + Constants.DELAY;
            this.traveling = true;
            this._direction = MathUtils.calculateVectorDirection(position, this._position, this._distance);
            this._distance = MathUtils.calculateDistance(this._position, position);
        }
    }

    public rollback() {
        const position = new Vector3();
        this.getWorldPosition(position);
        this._now = Date.now();
        let timePassed = (this._now - this._initialTime) / (this._finalTime - this._initialTime);
        if(timePassed > Constants.MAX_TIME_PASSED) {
            this.traveling = false;
        }
        this._direction = MathUtils.calculateVectorDirection(position, this._position, this._distance);
        this._distance = MathUtils.calculateDistance(this._position, position)
        MathUtils.moveSphereTowardDirection(this, this._direction, this._distance, timePassed)
    }
}
