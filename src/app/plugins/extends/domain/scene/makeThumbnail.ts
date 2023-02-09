const THUMBNAIL_WIDTH = 128;
const THUMBNAIL_HEIGHT = 96;
export const makeThumbnail = (file) => {
  // 非同期の処理になるのでPromiseを返す
  return new Promise((resolve) => {
    try {
      // 動的にcanvasを生成する
      const canvas = document.createElement('canvas')
      canvas.width = THUMBNAIL_WIDTH
      canvas.height = THUMBNAIL_HEIGHT

      const ctx = canvas.getContext('2d')
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        const img = new Image()
        img.src = reader.result as string;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)

          // canvasの描画結果をDataURL形式で取得して返却する
          resolve(canvas.toDataURL('image/png', 0.5))
        }

        // エラー処理
        img.onerror = () => {
          throw new Error('error')
        }
      }
    } catch (err) {
      // 処理に失敗したらデフォルトサムネイルを返す
      resolve(null)
    }
  })
}
