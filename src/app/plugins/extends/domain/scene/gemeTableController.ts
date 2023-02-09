import { GameTable } from "@udonarium/game-table";
import { AudioStorage } from "@udonarium/core/file-storage/audio-storage";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { Jukebox } from "@udonarium/Jukebox";
import { AudioPlayer } from "@udonarium/core/file-storage/audio-player";

let table: GameTable | null = null;
export const setSelectedTable = (_table) => {
  table = _table;
}

export const getSelectedTable = () => {
  if(!table) throw Error('table empty')
  return table;
}

const auditionPlayer: AudioPlayer = new AudioPlayer();
export const demoPlaySound = async(file:File) => {
  const audio = await handleAudio(file);
  if(!audio) return;
  auditionPlayer.play(audio);
}

export const playSound = async(file:File) => {
  const audio = await handleAudio(file);
  const jukebox = ObjectStore.instance.get<Jukebox>('Jukebox');
  if(!audio) return;
  jukebox.play(audio.identifier)
}
export const setTable = async(file: File) => {
  const image = await handleImage(file);
  const table = getSelectedTable();
  table.imageIdentifier = image.identifier;
}

export const setBackGround = async(file: File) => {
  const image = await handleImage(file);

  const table = getSelectedTable();
  table.backgroundImageIdentifier = image.identifier;
}

const MEGA_BYTE = 1024 * 1024;
const  handleAudio = async(file: File) => {
  if (file.type.indexOf('audio/') < 0) return;
  const maxAudioeSize = 10 * MEGA_BYTE;
  if (maxAudioeSize < file.size) {
    console.warn(`File size limit exceeded. -> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    return;
  }
  return await AudioStorage.instance.addAsync(file);
}


const handleImage = async(file: File) => {
  const maxImageSize = 2 * MEGA_BYTE;
  if (file.type.indexOf('image/') < 0) return;

  if (maxImageSize < file.size) {
    console.warn(`File size limit exceeded. -> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    return;
  }
  return await ImageStorage.instance.addAsync(file);
}
