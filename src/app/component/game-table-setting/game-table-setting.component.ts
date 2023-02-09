import { AfterViewInit, Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import GameSystemClass from 'bcdice/lib/game_system';

import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ObjectSerializer } from '@udonarium/core/synchronize-object/object-serializer';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem, Network } from '@udonarium/core/system';
import { FilterType, GameTable, GridType } from '@udonarium/game-table';
import { TableSelecter } from '@udonarium/table-selecter';

import { FileSelecterComponent } from 'component/file-selecter/file-selecter.component';
import { ImageService } from 'service/image.service';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { SaveDataService } from 'service/save-data.service';
import { BatchService } from 'service/batch.service';

import { DiceBot } from '@udonarium/dice-bot';
import { Config } from '@udonarium/config';
import { setSelectedTable } from 'src/app/plugins/extends/domain/scene/gemeTableController';

@Component({
  selector: 'game-table-setting',
  templateUrl: './game-table-setting.component.html',
  styleUrls: ['./game-table-setting.component.css']
})
export class GameTableSettingComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input('gameType') _gameType: string = '';
  @Output() gameTypeChange = new EventEmitter<string>();
  get gameType(): string { return this.config.defaultDiceBot };
  set gameType(gameType: string) { this.config.defaultDiceBot = gameType; }
  loadDiceBot(gameType: string) {
    console.log('changeDiceBot ready');
    DiceBot.getHelpMessage(gameType).then(help => {
     console.log('onChangeGameType done\n' + help);
    });
  }

  get roomGridDispAlways(): boolean {
    let conf = ObjectStore.instance.get<Config>('Config');
    return conf? conf.roomGridDispAlways : false ;
  }

  set roomGridDispAlways(disp: boolean){
    let conf = ObjectStore.instance.get<Config>('Config');
    this.tableGridDummy = !this.tableGridDummy;
    if(conf) conf.roomGridDispAlways = disp;
  }

  get config(): Config { return ObjectStore.instance.get<Config>('Config')};

  minSize: number = 1;
  maxSize: number = 100;

  get diceBotInfos() { return DiceBot.diceBotInfos }

  get tableBackgroundImage(): ImageFile {
    return this.imageService.getEmptyOr(this.selectedTable ? this.selectedTable.imageIdentifier : null);
  }

  get tableDistanceviewImage(): ImageFile {
    return this.imageService.getEmptyOr(this.selectedTable ? this.selectedTable.backgroundImageIdentifier : null);
  }

  // 全体強制ONしたときのグリッド表示信号発行のためのダミー
  get tableGridDummy(): boolean { return this.tableSelecter.tableGridDummy; }
  set tableGridDummy(dummy: boolean) { this.tableSelecter.tableGridDummy = dummy; }

  get tableName(): string { return this.selectedTable.name; }
  set tableName(tableName: string) { if (this.isEditable) this.selectedTable.name = tableName; }

  get tableWidth(): number { return this.selectedTable.width; }
  set tableWidth(tableWidth: number) { if (this.isEditable) this.selectedTable.width = tableWidth; }

  get tableHeight(): number { return this.selectedTable.height; }
  set tableHeight(tableHeight: number) { if (this.isEditable) this.selectedTable.height = tableHeight; }

  get tableGridColor(): string { return this.selectedTable.gridColor.substring(0, 7); }
  set tableGridColor(tableGridColor: string) { if (this.isEditable) this.selectedTable.gridColor = tableGridColor + "e6"; }

  get tableGridShow(): boolean { return this.tableSelecter.gridShow; }
  set tableGridShow(tableGridShow: boolean) {
    this.tableSelecter.gridShow = tableGridShow;
    EventSystem.trigger('UPDATE_GAME_OBJECT', this.tableSelecter.toContext()); // 自分にだけイベントを発行してグリッド更新を誘発
  }

  get tableGridSnap(): boolean { return this.tableSelecter.gridSnap; }
  set tableGridSnap(tableGridSnap: boolean) {
    this.tableSelecter.gridSnap = tableGridSnap;
  }

  get tableGridType(): GridType { return this.selectedTable.gridType; }
  set tableGridType(gridType: GridType) { if (this.isEditable) this.selectedTable.gridType = Number(gridType); }

  get tableDistanceviewFilter(): FilterType { return this.selectedTable.backgroundFilterType; }
  set tableDistanceviewFilter(filterType: FilterType) { if (this.isEditable) this.selectedTable.backgroundFilterType = filterType; }

  get tableSelecter(): TableSelecter { return TableSelecter.instance; }

  selectedTable: GameTable = null;
  selectedTableXml: string = '';

  get isEmpty(): boolean { return this.tableSelecter ? (this.tableSelecter.viewTable ? false : true) : true; }
  get isDeleted(): boolean {
    if (!this.selectedTable) return true;
    return ObjectStore.instance.get<GameTable>(this.selectedTable.identifier) == null;
  }
  get isEditable(): boolean {
    return !this.isEmpty && !this.isDeleted;
  }

  isSaveing: boolean = false;
  progresPercent: number = 0;

  constructor(
    private modalService: ModalService,
    private saveDataService: SaveDataService,
    private imageService: ImageService,
    private panelService: PanelService
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.modalService.title = this.panelService.title = 'テーブル設定');
    this.selectedTable = this.tableSelecter.viewTable;
    EventSystem.register(this)
      .on('DELETE_GAME_OBJECT', 2000, event => {
        if (!this.selectedTable || event.data.identifier !== this.selectedTable.identifier) return;
        let object = ObjectStore.instance.get(event.data.identifier);
        if (object !== null) {
          this.selectedTableXml = object.toXml();
        }
      });
    setSelectedTable(this.selectedTable);
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  selectGameTable(identifier: string) {
    EventSystem.call('SELECT_GAME_TABLE', { identifier: identifier }, Network.peerId);
    this.selectedTable = ObjectStore.instance.get<GameTable>(identifier);
    this.selectedTableXml = '';
    setSelectedTable(this.selectedTable);
  }

  getGameTables(): GameTable[] {
    return ObjectStore.instance.getObjects(GameTable);
  }

  createGameTable() {
    let gameTable = new GameTable();
    gameTable.name = '白紙のテーブル';
    gameTable.imageIdentifier = 'testTableBackgroundImage_image';
    gameTable.initialize();
    this.selectGameTable(gameTable.identifier);
  }

  async save() {
    if (!this.selectedTable || this.isSaveing) return;
    this.isSaveing = true;
    this.progresPercent = 0;

    this.selectedTable.selected = true;
    await this.saveDataService.saveGameObjectAsync(this.selectedTable, 'map_' + this.selectedTable.name, percent => {
      this.progresPercent = percent;
    });

    setTimeout(() => {
      this.isSaveing = false;
      this.progresPercent = 0;
    }, 500);
  }

  delete() {
    if (!this.isEmpty && this.selectedTable) {
      this.selectedTableXml = this.selectedTable.toXml();
      this.selectedTable.destroy();
    }
  }

  restore() {
    if (this.selectedTable && this.selectedTableXml) {
      let restoreTable = ObjectSerializer.instance.parseXml(this.selectedTableXml);
      this.selectGameTable(restoreTable.identifier);
      this.selectedTableXml = '';
    }
  }

  openBgImageModal() {
    if (this.isDeleted) return;
    this.modalService.open<string>(FileSelecterComponent).then(value => {
      if (!this.selectedTable || !value) return;
      this.selectedTable.imageIdentifier = value;
    });
  }

  openDistanceViewImageModal() {
    if (this.isDeleted) return;
    this.modalService.open<string>(FileSelecterComponent, { isAllowedEmpty: true }).then(value => {
      if (!this.selectedTable || !value) return;
      this.selectedTable.backgroundImageIdentifier = value;
    });
  }
}
