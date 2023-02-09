
import { BGImage, Scene, Sound } from "./types";

let scenes: Scene[] = [{ title: 'シーン1', soundName: 'すずめの戸締まり/01 - 二人の出逢い.mp3', tableImageName: '和風/Ecc-PhgU4AIBZu4.jpg', backGroundImageName: '和風/Ecc9ZtIU0AAD_FJ.jpg'}]
let sounds: Sound[] = []
let backGrounds: BGImage[] = [];

export const getScenes = () => scenes;
export const setScenes = (_) => { scenes = _ };

export const getSounds = () => sounds;
export const setSounds = (_) => { sounds = _ };
export const getBackGrounds = () => backGrounds;
export const setBackGrounds = (_) => { backGrounds = _ };
