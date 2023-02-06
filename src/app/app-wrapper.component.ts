
import { Component } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  template: ` <div style="display: flex;position: relative;;">
                <div style="width:20vh;height: 100vh;"></div>
                <div style="width: 100%;height:80vh;border: 2px solid #222;overflow: hidden; position: relative;">
                   <app-root></app-root>
                 </div>
              </div>`,
})

export class AppWrapperComponent {

  constructor() {
  }

}
