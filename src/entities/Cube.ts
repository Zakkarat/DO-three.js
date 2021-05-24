// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import {Text} from "troika-three-text";
import EntityNR from "./EntityNR";
// @ts-ignore
import Entity from "./Entity";
// @ts-ignore
import {MeshLambertMaterial} from "three";

export default class Cube extends EntityNR {
    // static build(color:number, x:number, y:number, weight?:number):Cube {
    //     const geometry = new THREE.BoxGeometry( 100, 100, 10 );
    //     let meshLambertMaterial = new MeshLambertMaterial({color});
    //     let result = new Cube(geometry, meshLambertMaterial);
    //     if (weight) {
    //         result._weight = weight;
    //     }
    //     result.addWeightLabel();
    //     result.receiveShadow = true;
    //     result.position.set(x, y, -50);
    //     return result;
    // }
    // @ts-ignore
    static build(color:number, x:number, y:number, weight?:number):Cube {
        let result = new Cube();
        result.addWeightLabel();
        result.position.set(x, y, -50);
        return result;
    }

    protected addWeightLabel():void {
        // const weightLabel = new Text();
        // weightLabel.text = this._weight + 'kg';
        // weightLabel.fontSize = 30.2
        // weightLabel.position.x = -33;
        // weightLabel.position.y = +15;
        // weightLabel.position.z = 25;
        // weightLabel.color = 0xFFFFFF
        // this.add(weightLabel)
    }

    getBoundaries():number[] {
        return [];
    }

    getWidth():number {
        return 0;
    }

    protected onDrag():void {
    }
}
