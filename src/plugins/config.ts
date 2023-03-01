const params = new URL(document.URL).searchParams;

export const pluginConfig = {
  isAddCounterBoard: params.get('counter-board') != null,
  is2d: params.get('2d') != null,
  forPL: params.get('pl') != null,
} as const;
