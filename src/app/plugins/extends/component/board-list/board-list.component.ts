import { Component } from "@angular/core";
import { AudioStorage } from "@udonarium/core/file-storage/audio-storage";
import { FileArchiver } from "@udonarium/core/file-storage/file-archiver";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { Jukebox } from "@udonarium/Jukebox";
import { getSelectedTable } from "../../domain/scene/backGroundController";

interface Window {
  showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>
}
declare var window: Window
type FileData = { name:string, handle: FileSystemFileHandle }
type Scene = string;
type Sound = FileData;
type BGImage = FileData;

const MEGA_BYTE = 1024 * 1024;
@Component({
  selector: 'board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class ExtendBoardListComponent  {
  scenes: Scene[] = []
  sounds: Sound[] = []
  backGrounds: BGImage[] = [];
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
    this.sounds = soundFIles.filter(data=>{ const ext = data.name.slice(-3); return ['mp3', 'wav', 'mid', 'wma'].includes(ext); })
  }

  trackByFile(index: number, file: FileData) {
    return file.name;
  }
  async playSound(fileData: FileData) {
    const file = await fileData.handle.getFile();
    const audio = await this.handleAudio(file);
    const jukebox = ObjectStore.instance.get<Jukebox>('Jukebox');
    if(!audio) return;
    jukebox.play(audio.identifier)
  }
  async addSound(fileData: FileData) {
    const file = await fileData.handle.getFile();
    await FileArchiver.instance.load([file]);
  }
  async setTable(fileData: FileData) {
    const file = await fileData.handle.getFile();
    const image = await this.handleImage(file);
    const table = getSelectedTable();
    table.imageIdentifier = image.identifier;
  }
  async setBackGround(fileData: FileData) {
    const file = await fileData.handle.getFile();
    const image = await this.handleImage(file);

    const table = getSelectedTable();
    table.backgroundImageIdentifier = image.identifier;
  }
  private async handleAudio(file: File) {
    if (file.type.indexOf('audio/') < 0) return;
    const maxAudioeSize = 10 * MEGA_BYTE;
    if (maxAudioeSize < file.size) {
      console.warn(`File size limit exceeded. -> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return;
    }
    console.log(file.name + ' type:' + file.type);
    return await AudioStorage.instance.addAsync(file);
  }
  private async handleImage(file: File) {
    const maxImageSize = 2 * MEGA_BYTE;
    if (file.type.indexOf('image/') < 0) return;

    if (maxImageSize < file.size) {
      console.warn(`File size limit exceeded. -> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return;
    }
    console.log(file.name + ' type:' + file.type);
    return await ImageStorage.instance.addAsync(file);
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
