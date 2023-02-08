import { Component } from "@angular/core";

interface Window {
  showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>
}
declare var window: Window

type Scene = string;
type Sound = string;

@Component({
  selector: 'board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class ExtendBoardListComponent  {
  scenes: Scene[] = []
  sounds: Sound[] = []
  async openDataDirectory() {
    const dirHandle = await window.showDirectoryPicker();
    const soundsHandle = await dirHandle.getDirectoryHandle('sounds');
    this.sounds = await getFileNameListRecursice('', soundsHandle);
  }

  trackByScene(index: number, scene: Scene) {
    return scene;
  }
}

const getFileNameListRecursice = async (prefix: string, dirHandle: FileSystemDirectoryHandle): Promise<string[]> => {
  let scenes:string[] = [];
  for await (let [name, handle] of dirHandle) {
    if (handle.kind === 'file') { // ファイルのとき
      scenes.push(`${prefix}/${name}`);
    } else { // ディレクトリのとき
      const childDir = await dirHandle.getDirectoryHandle(name);
      const childNames = await getFileNameListRecursice(name, childDir);
      scenes = [...scenes, ...childNames]
    }
  }
  return scenes;
}
