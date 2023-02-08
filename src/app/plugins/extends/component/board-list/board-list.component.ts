import { Component } from "@angular/core";
import { FileArchiver } from "@udonarium/core/file-storage/file-archiver";

interface Window {
  showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>
}
declare var window: Window
type FileData = { name:string, handle: FileSystemFileHandle }
type Scene = string;
type Sound = FileData;

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

  trackByFile(index: number, file: FileData) {
    return file.name;
  }
  async addSound(fileData: FileData) {
    const file = await fileData.handle.getFile();
    FileArchiver.instance.load([file]);
  }
}

const getFileNameListRecursice = async(prefix: string, dirHandle: FileSystemDirectoryHandle): Promise<FileData[]> => {
  let scenes:FileData[] = [];
  for await (let [name, handle] of dirHandle) {
    if (handle.kind === 'file') { // ファイルのとき
      scenes.push({name: `${prefix}/${name}`, handle});
    } else { // ディレクトリのとき
      const childDir = await dirHandle.getDirectoryHandle(name);
      const childNames = await getFileNameListRecursice(name, childDir);
      scenes = [...scenes, ...childNames]
    }
  }
  return scenes;
}
