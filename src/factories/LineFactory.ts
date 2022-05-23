import Line from "../entities/Line";
import MathUtils from "../utils/MathUtils";

export default class LineFactory {
    static build(suggestedWidth?: number, weight?: number, x?:number):Line {
        const color = MathUtils.getRandomColor();
        const width = suggestedWidth || MathUtils.getRandomNumber(100, 300);
        x = x || MathUtils.getRandomNumber(-400, 400);
        return Line.build(color, width, x, false, weight);
    }
}
