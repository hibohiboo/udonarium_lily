import { ImageFile } from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { DataElement } from "@udonarium/data-element";
import { GameTableMask } from "@udonarium/game-table-mask";
import { TableSelecter } from "@udonarium/table-selecter";
import { Terrain } from "@udonarium/terrain";
import { pluginConfig } from "src/plugins/config"

export const createDefaultCubeTerrain = (position, name = 'キューブ', imageUrl = './assets/images/extend/cube.jpg') => {
  const url: string = imageUrl;
  const image: ImageFile = ImageStorage.instance.get(url) || ImageStorage.instance.add(url);

  const viewTable = TableSelecter.instance.viewTable;
  if (!viewTable) return;

  const terrain = Terrain.create(name, 0.5, 0.5, 0.5, image.identifier, image.identifier) as any;
  terrain.location.x = position.x - 50;
  terrain.location.y = position.y - 50;
  terrain.posZ = position.z;
  terrain.isLocked = true;

  viewTable.appendChild(terrain);
  return terrain;
}
export const createDiaclockTerrain = (position, name = 'ダイアクロック', imageUrl = './assets/images/diaclock/diaclockmap.png') => {
  const url: string = imageUrl;
  const image: ImageFile = ImageStorage.instance.get(url) || ImageStorage.instance.add(url);
  const baseUrl = './assets/images/extend/color_cube/white.png';
  const baseImage: ImageFile = ImageStorage.instance.get(baseUrl) || ImageStorage.instance.add(baseUrl);

  const viewTable = TableSelecter.instance.viewTable;
  if (!viewTable) return;
  if(!pluginConfig.is2d){
    const baseMask = GameTableMask.create(name, 6, 6, 1);
    baseMask.isLock = true;
    baseMask.location.x = position.x;
    baseMask.location.y = position.y;
    baseMask.imageDataElement.getFirstElementByName('imageIdentifier').value = baseImage.identifier;
    viewTable.appendChild(baseMask);
    const mask = GameTableMask.create(name, 6, 6, 1);
    mask.isLock = true;
    mask.location.x = position.x;
    mask.location.y = position.y;
    mask.imageDataElement.getFirstElementByName('imageIdentifier').value = image.identifier;
    viewTable.appendChild(mask);
    return;
  }

  const base = Terrain.create(name, 6, 6, 6, baseImage.identifier, baseImage.identifier) as any;
  base.location.x = position.x;
  base.location.y = position.y;
  base.posZ = position.z;
  base.isLocked = true;
  viewTable.appendChild(base);

  const terrain = Terrain.create(name, 6, 6, 6, image.identifier, image.identifier) as any;
  terrain.location.x = position.x;
  terrain.location.y = position.y;
  terrain.posZ = position.z;
  terrain.isLocked = true;
  viewTable.appendChild(terrain);
  return terrain;
}
