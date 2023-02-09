import { Component } from "@angular/core";

import { getBackGrounds, getScenes, getSounds } from "../../domain/scene/files";
import { playSound, setBackGround, setTable } from "../../domain/scene/gemeTableController";
import { BGImage, Scene, Sound } from "../../domain/scene/types";


@Component({
  selector: 'scene-list',
  templateUrl: './scene-list.component.html',
  styleUrls: ['./scene-list.component.css']
})
export class ExtendSceneListComponent  {
  get scenes(): Scene[] { return getScenes(); }
  get sounds(): Sound[] { return getSounds(); }
  get backGrounds(): BGImage[] { return getBackGrounds(); };

  async applyScene(scene:Scene) {
    console.log(scene)
    await Promise.all([
      (async()=> {
        const sound = this.sounds.find(d=>d.name === scene.soundName);
        console.log('sound')
        if(!sound) return;
        const file = await sound.handle.getFile();
        await playSound(file)
      })(),
      (async()=> {
        const tableImage = this.backGrounds.find(d=>d.name === scene.tableImageName);
        console.log('tableImage')
        if(!tableImage) return;
        const file = await tableImage.handle.getFile();
        await setTable(file)
      })(),
      (async()=> {
        const backGroundImage = this.backGrounds.find(d=>d.name === scene.backGroundImageName);
        console.log('backGroundImage')
        if(!backGroundImage) return;
        const file = await backGroundImage.handle.getFile();
        await setBackGround(file)
      })()
    ])
  }
}
