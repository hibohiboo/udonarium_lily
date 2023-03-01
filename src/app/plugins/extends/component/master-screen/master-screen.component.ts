
import { Component } from '@angular/core';
import { pluginConfig } from 'src/app/plugins/config';

@Component({
  selector: 'app-wrapper',
  template: ` <div style="display: flex;position: relative;">
                <div *ngIf="!isPLMode" style="width:600px;height: 100vh;">
                  <board-list></board-list>
                </div>
                <div style="width: 100%;overflow: hidden; position: relative;">
                  <div [style.height]="isPLMode ? '100vh' : '80vh'" style="width: 100%; ;border: 2px solid #222;overflow: hidden; position: relative;">
                   <app-root></app-root>
                  </div>
                  <div *ngIf="!isPLMode">
                    <scene-list></scene-list>
                  </div>
              </div>`,
})

export class MasterScreenComponent {
  get isPLMode() { return pluginConfig.forPL; }
  constructor() {
  }

}
