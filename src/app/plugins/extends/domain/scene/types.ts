export type FileData = { name:string, handle: FileSystemFileHandle }
type ImageFileData = FileData & { thumbnail: string; }
export type Scene = { title: string, soundName:string, tableImageName: string, backGroundImageName: string };
export type Sound = FileData;
export type BGImage = ImageFileData;
