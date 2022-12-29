const params = new URL(document.URL).searchParams;
export const pluginConfig = {
  is2d: params.get('2d') != null,
} as const;
