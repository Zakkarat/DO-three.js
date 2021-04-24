import * as THREE from "three";
import {Vector3} from "three";
import MathUtils from "../utils/MathUtils";
import Constants from "../constants/Constants";

export default abstract class Entity extends THREE.Mesh {
    protected _distance:number = 0;
    protected _direction:Vector3 = new Vector3(0, 0, 0);
    protected _position:Vector3 = new Vector3(0,0,0);
    protected _initialTime:number = 0;
    protected _finalTime:number = 0;
    protected _now:number = 0;
    private _weight:number = MathUtils.getRandomNumber(1, 50);
    // private _angle:number = 0;

    public locked = false;
    public traveling = false;

    protected onDragStart() {
        this.locked = true;
    }
    protected abstract onDrag():void;

    protected onDragEnd() {
        this.locked = false;
    }

    protected rollback() {
        const position = new Vector3();
        this.getWorldPosition(position);
        this._now = Date.now();
        let timePassed = (this._now - this._initialTime) / (this._finalTime - this._initialTime);
        if(timePassed > Constants.MAX_TIME_PASSED) {
            this.traveling = false;
        }
        this._direction = MathUtils.calculateVectorDirection(position, this._position, this._distance);
        this._distance = MathUtils.calculateDistance(this._position, position)
        MathUtils.moveEntityTowardDirection(this, this._direction, this._distance, timePassed)
    }

    protected abstract getWidth():number;

    protected abstract addWeightLabel():void;

    public abstract getBoundaries():number[];

    get weight():number {
        return this._weight;
    }
}
