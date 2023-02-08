import { Component } from "@angular/core";
import { AudioStorage } from "@udonarium/core/file-storage/audio-storage";
import { FileArchiver } from "@udonarium/core/file-storage/file-archiver";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { Jukebox } from "@udonarium/Jukebox";

interface Window {
  showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>
}
declare var window: Window
type FileData = { name:string, handle: FileSystemFileHandle }
type Scene = string;
type Sound = FileData;

const MEGA_BYTE = 1024 * 1024;
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
    const soundFIles = await getFileNameListRecursice('', soundsHandle);
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
