import {singleton} from "tsyringe";
import SquaresSolution from "../gameScene/Task2d";
import LinesSolution from "../gameScene/Task";

@singleton()
export class Settings {
    public currentTask: LinesSolution|SquaresSolution;
}