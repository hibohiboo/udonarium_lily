import { CounterBoardWindowComponent } from "src/plugins/add-counter-board/extend/component/counter-board-window/counter-board-window.component"
import { CounterBoardComponent } from "src/plugins/add-counter-board/extend/component/counter-board/counter-board.component"
import { CounterBoardService } from "src/plugins/add-counter-board/extend/service/counter-board.service"
import { ExtendBoardListComponent } from "./component/board-list/board-list.component"
import { MasterScreenComponent } from "./component/master-screen/master-screen.component"
import { ExtendSceneListComponent } from "./component/scene-list/scene-list.component"

const components = [
  MasterScreenComponent
  , ExtendBoardListComponent
  , ExtendSceneListComponent
  , CounterBoardComponent
  , CounterBoardWindowComponent
]
const imports = []
const services = [CounterBoardService]
const bootstarp = []

export default { components, services }
