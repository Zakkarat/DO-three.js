import * as THREE from "three";
import {BoxGeometry, MeshLambertMaterial} from "three";
import {Text} from 'troika-three-text';

import Entity from "./Entity";
import EntityNR from "./EntityNR";

export default class Line extends Entity {
    static build(color:number, width:number, x:number, isVertical?:boolean, weight?:number):Line {
        let height = 10;
        if (isVertical) {
            height = 100
        }
        const geometry = new THREE.BoxGeometry(width, height, 1);
        let meshLambertMaterial = new MeshLambertMaterial({color});
        let result = new Line(geometry, meshLambertMaterial);
        result.receiveShadow = true;
        result.position.set(x, -50, -50);
        if(weight) {
            result._weight = weight;
        }
        if (!isVertical) {
            result.addWeightLabel();
        }
        return result;
    }
    // static build(color:number, width:number, x:number, isVertical?:boolean, weight?:number):Line {
    //     let result = new Line();
    //     result.position.set(x, -50, -50);
    //     if(weight) {
    //         result._weight = weight;
    //     }
    //     result.width = width;
    //     if (!isVertical) {
    //         result.addWeightLabel();
    //     }
    //     return result;
    // }

    protected addWeightLabel() {
        const weightLabel = new Text();
        weightLabel.text = this._weight + 'kg';
        weightLabel.fontSize = 30.2
        weightLabel.position.x -= 30;
        weightLabel.position.y += 50;
        weightLabel.color = 0xFFFFFF
        this.add(weightLabel)
    }

    protected onDrag() {
        this.position.y = -50;
        this.position.z = -50;
    }

    public getWidth() {
        return (this.geometry as BoxGeometry).parameters.width;
    }

    get width():number {
        return this._width;
    }

    set width(value:number) {
        this._width = value;
    }

    public getBoundaries() {
        return [this.position.x - this.getWidth() / 2, this.position.x + this.getWidth() / 2]
    }
}
