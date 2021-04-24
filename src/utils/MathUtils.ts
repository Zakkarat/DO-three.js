import Constants from "../constants/Constants";
import * as THREE from "three";
import {Vector3} from "three";
import Sphere from "../entities/Sphere";

export default class MathUtils {
    static moveTowardDirection(direction:number, distance:number, expressionX:number):number {
        return direction * distance * this.sinExpression(expressionX) * Constants.ROLLBACK_MULTIPLIER;
    }

    static moveSphereTowardDirection(sphere: Sphere , direction:Vector3, distance:number, expressionX:number) {
        sphere.position.x -= MathUtils.moveTowardDirection(direction.x, distance, expressionX);
        sphere.position.y -= MathUtils.moveTowardDirection(direction.y, distance, expressionX);
        sphere.position.z -= MathUtils.moveTowardDirection(direction.z, distance, expressionX);
    }

    static calculateVectorDirection(source:Vector3, target:Vector3, distance:number):Vector3 {
        return new Vector3(
            MathUtils.calculateDirection(source.x, target.x, distance),
            MathUtils.calculateDirection(source.y, target.y, distance),
            MathUtils.calculateDirection(source.z, target.z, distance)
        );
    }

    static calculateDirection(target:number, source:number, distance:number):number {
        return (target - source) / distance;
    }

    static sinExpression(x:number):number {
        return (Math.sin(x * Math.PI - Math.PI / 2) + 1) / 2;
    }

    static rotate(difference:number):number {
        return Constants.ROTATION_INCREMENT + difference * Constants.ROTATION_MULTIPLIER;
    }


    static calculateDistance(target:THREE.Vector3, source:THREE.Vector3) {
        return Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2) + Math.pow(target.z - source.z, 2));
    }

    static normalizePivot(expected:number, current:number):number {
        return (expected - current) / Constants.PIVOT_INHIBITOR;
    }
}
