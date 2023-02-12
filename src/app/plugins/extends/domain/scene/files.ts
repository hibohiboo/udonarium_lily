
import { BGImage, Scene, Sound } from "./types";

let scenes: Scene[] = []
let sounds: Sound[] = []
let backGrounds: BGImage[] = [];

export const getScenes = () => scenes;
export const setScenes = (_) => { scenes = _ };

export const getSounds = () => sounds;
export const setSounds = (_) => { sounds = _ };
export const getBackGrounds = () => backGrounds;
export const setBackGrounds = (_) => { backGrounds = _ };
