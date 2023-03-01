import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataElement } from '@udonarium/data-element';
import { PanelService } from 'service/panel.service';
import { createDefaultCubeTerrain, createDiaclockTerrain } from 'src/plugins/default-terrain-cube/extend/service/tabletop-action.service';
import { CounterBoard } from '../../class/counter-board';
import { CounterBoardService } from '../../service/counter-board.service'


@Component({
  selector: 'counter-board-window',
  templateUrl: './counter-board-window.component.html',
  styleUrls: ['./counter-board-window.component.css'],
})
export class CounterBoardWindowComponent implements OnInit, OnDestroy {
  private _currentBoardIdentifier = '';
  get currentBoard() : CounterBoard | null {
    const currentBoard = this.counterBoardService.counterBoards.find(item=>this._currentBoardIdentifier === item.identifier);
    if(currentBoard) return currentBoard;
    const [current] = this.counterBoardService.counterBoards
    return current;
  };
  get counterBoards() : CounterBoard[] {
    return  this.counterBoardService.counterBoards;
  };
  constructor(
    private panelService: PanelService,
    private counterBoardService: CounterBoardService,
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.panelService.title = 'カウンターボード');
    if (!this._currentBoardIdentifier) {
      const board = CounterBoard.create();
      board.name = 'ダイアクロック';
      board.maxCount = 12;
      board.direction = 'diaclock';
      board.startPositionX = 800;
      board.startPositionY = 300;
      createDiaclockTerrain({ x: 650, y: 150, z: 0 });
      const cubeProp = { name: '青キューブ', url: './assets/images/extend/color_cube/blue.png' };
      const cube = createDefaultCubeTerrain({ x: 0, y: 0, z: 0 }, cubeProp.name, cubeProp.url);
      cube.location.x = 785;
      cube.location.y = 195;
      cube.isLocked = true;
      const counterNameElement = DataElement.create(board.name, '', {}, `${board.name}${cube.identifier}`);
      cube.detailDataElement.appendChild(counterNameElement);
      counterNameElement.appendChild(DataElement.create('カウント', '0', {}, `${'カウント'}${cube.identifier}`));
      counterNameElement.appendChild(DataElement.create('0:in/1:out', 1, { 'type': 'numberResource', 'currentValue': '1' }, `${'0:in/1:out'}${cube.identifier}`));
      const redCubeProp = { name: '赤キューブ', url: './assets/images/extend/color_cube/red.png' };
      const redCube = createDefaultCubeTerrain({ x: 0, y: 0, z: 0 }, redCubeProp.name, redCubeProp.url);
      redCube.location.x = 785;
      redCube.location.y = 340;
      redCube.isLocked = true;
      const redCounterNameElement = DataElement.create(board.name, '', {}, `${board.name}${redCube.identifier}`);
      redCube.detailDataElement.appendChild(redCounterNameElement);
      redCounterNameElement.appendChild(DataElement.create('カウント', '6', {}, `${'カウント'}${redCube.identifier}`));
      redCounterNameElement.appendChild(DataElement.create('0:in/1:out', 1, { 'type': 'numberResource', 'currentValue': '0' }, `${'0:in/1:out'}${cube.identifier}`));

      this._currentBoardIdentifier = board.identifier;
    }
  }


  ngOnDestroy() { }

  addCounterBoard() {
    const board = CounterBoard.create();
    this._currentBoardIdentifier = board.identifier;
  }
  trackByBoard() {
    return this._currentBoardIdentifier;
  }
}
