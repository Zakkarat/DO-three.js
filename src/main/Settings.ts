import {singleton} from "tsyringe";
import {Task} from "../gameScene/Task";
import SquaresSolution from "../gameScene/SquaresSolution";
import LinesSolution from "../gameScene/LinesSolution";

@singleton()
export class Settings {
    solutionChosen: typeof LinesSolution | typeof SquaresSolution;
    initialRowData: RowData[];
}