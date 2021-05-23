import MathUtils from "../utils/MathUtils";
import Cube from "../entities/Cube";

export default class SquareFactory {
    static build(x:number = 0, y:number = 0):Cube {
        const color = MathUtils.getRandomColor();
        return Cube.build(color, x, y);
    }
}
