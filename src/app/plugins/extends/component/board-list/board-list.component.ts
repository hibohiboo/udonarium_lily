import { Component } from "@angular/core";
 import { FileArchiver } from "@udonarium/core/file-storage/file-archiver";
import { demoPlaySound, playSound, setBackGround, setTable } from "../../domain/scene/gemeTableController";
import { getBackGrounds, getScenes, getSounds, setBackGrounds, setScenes, setSounds } from "../../domain/scene/files";
import { BGImage, FileData, Scene, Sound } from "../../domain/scene/types";
import { AudioPlayer } from "@udonarium/core/file-storage/audio-player";

interface Window {
  showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>
}
declare var window: Window

@Component({
  selector: 'board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class ExtendBoardListComponent  {

  get scenes(): Scene[] { return getScenes(); }
  set scenes(_) { setScenes(_); }
  get sounds(): Sound[] { return getSounds(); }
  set sounds(_) { setSounds(_); }
  get backGrounds(): BGImage[] { return getBackGrounds(); };
  set backGrounds(_) { setBackGrounds(_); }
  playSounds: Sound[] = [];

  async openDataDirectory() {
    const dirHandle = await window.showDirectoryPicker();
    const soundsHandle = await dirHandle.getDirectoryHandle('sounds');
    const soundFIles = await getFileNameListRecursice('', soundsHandle);
    this.sounds = soundFIles.filter(data=>{ const ext = data.name.slice(-3).toLowerCase(); return ['mp3', 'wav', 'mid', 'wma'].includes(ext); })

    const backGroundsHandle = await dirHandle.getDirectoryHandle('images');
    const backGroundsFIles = await getFileNameListRecursice('', backGroundsHandle);
    this.backGrounds = backGroundsFIles.filter(data=>{ const ext = data.name.slice(-3).toLowerCase(); return ['jpg', 'png', 'gif', 'epg'].includes(ext); })
  }
  async openSoundDirectory() {
    const dirHandle = await window.showDirectoryPicker();
    const soundFIles = await getFileNameListRecursice('', dirHandle);
    this.playSounds = soundFIles.filter(data=>{ const ext = data.name.slice(-3); return ['mp3', 'wav', 'mid', 'wma'].includes(ext); })
  }

  trackByFile(index: number, file: FileData) {
    return file.name;
  }
  async playSound(fileData: FileData) {
    const file = await fileData.handle.getFile();
    await playSound(file)
  }
  async addSound(fileData: FileData) {
    const file = await fileData.handle.getFile();
    await FileArchiver.instance.load([file]);
    await demoPlaySound(file);
  }
  async setTable(fileData: FileData) {
    const file = await fileData.handle.getFile();
    await setTable(file)
  }
  async setBackGround(fileData: FileData) {
    const file = await fileData.handle.getFile();
    await setBackGround(file)
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
