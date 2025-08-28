import { toPng } from "html-to-image"

export async function downloadImage(
  element: HTMLElement,
  fileName: string,
  backgroundColor: string = '#ffffff'
) {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor,
      skipFonts: true,
      filter: (node) => {
        if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
          return false
        }
        return true
      }
    })
    
    // iOS 기기 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !((window as Window & {MSStream?: unknown}).MSStream)
    
    if (isIOS) {
      // iOS에서는 새 탭에서 이미지 열기
      const newTab = window.open('', '_blank')
      if (newTab) {
        newTab.document.write(`
          <html>
            <head>
              <title>${fileName}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  background: #f0f0f0; 
                  text-align: center; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                }
                img { 
                  max-width: 100%; 
                  height: auto; 
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                  border-radius: 8px; 
                }
                .download-hint { 
                  margin: 20px auto; 
                  padding: 15px 20px; 
                  background: #007AFF; 
                  color: white; 
                  border-radius: 12px; 
                  font-size: 16px;
                  font-weight: 600;
                  max-width: 300px;
                }
                .sub-hint {
                  margin: 10px auto;
                  color: #666;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="download-hint">이미지를 길게 눌러 저장하세요</div>
              <div class="sub-hint">또는 공유 버튼을 눌러 저장할 수 있습니다</div>
              <img src="${dataUrl}" alt="${fileName}"/>
            </body>
          </html>
        `)
        newTab.document.close()
      }
    } else {
      // 일반 브라우저에서는 다운로드
      const link = document.createElement('a')
      link.download = fileName
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    return true
  } catch (error) {
    console.error('Failed to generate image:', error)
    alert('이미지 생성에 실패했습니다. 다시 시도해 주세요.')
    return false
  }
}