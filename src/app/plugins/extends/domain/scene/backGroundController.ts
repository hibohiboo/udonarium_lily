import { GameTable } from "@udonarium/game-table";

let table: GameTable | null = null;
export const setSelectedTable = (_table) => {
  table = _table;
}

export const getSelectedTable = () => {
  if(!table) throw Error('table empty')
  return table;
}
