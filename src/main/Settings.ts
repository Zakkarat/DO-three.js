import {singleton} from "tsyringe";
import Task2d from "../gameScene/Task2d";
import Task from "../gameScene/Task";

@singleton()
export class Settings {
    public currentTask: Task|Task2d;
}