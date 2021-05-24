import {Vector3} from "three";
import MathUtils from "../utils/MathUtils";

export default abstract class EntityNR {
    protected _distance:number = 0;
    protected _direction:Vector3 = new Vector3(0, 0, 0);
    private _position:Vector3 = new Vector3(0,0,0);
    protected _initialTime:number = 0;
    protected _finalTime:number = 0;
    protected _now:number = 0;
    protected _width:number = 100;
    protected _weight:number = MathUtils.getRandomNumber(0, 100);

    public abstract getWidth():number;

    protected abstract addWeightLabel():void;

    public abstract getBoundaries():number[];

    get weight():number {
        return this._weight;
    }

    get position():Vector3 {
        return this._position;
    }

    get width():number {
        return this._width;
    }

    set width(value:number) {
        this._width = value;
    }

    set position(value:Vector3) {
        this._position = value;
    }
    set weight(value:number) {
        this._weight = value;
    }
}
