import type { ReactNode } from 'react'

interface AdsConfig {
  [slot: string]: () => ReactNode
}

const adBox = (width: number, height: number, slot: string) => (
  <div
    style={{
      width: '100%',
      maxWidth: width,
      height,
      minHeight: height,
      maxHeight: height,
      margin: '32px auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      border: '1.5px dashed #cbd5e1',
      background: '#f8fafc',
      boxSizing: 'border-box',
      overflow: 'hidden',
      padding: 0,
    }}
    className="ad-responsive"
  >
    <span style={{ lineHeight: 1, padding: 0, margin: 0, fontSize: 16, color: '#94a3b8' }}>
      Реклама: {slot}
    </span>
  </div>
)

export const adsConfig: AdsConfig = {
  'above-dropzone': () => adBox(970, 250, 'above-dropzone'),
  'footer': () => {
    if (process.env.NODE_ENV === 'development') {
      // Компактная заглушка
      return (
        <div className="bg-gray-200 text-gray-500 text-center py-2 rounded-lg border border-dashed border-gray-400 my-4 text-sm">
          [Заглушка рекламы: footer]
        </div>
      )
    }
    // Yandex.RTB R-A-15762893-1
    return (
      <>
        <div id="yandex_rtb_R-A-15762893-1"></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.yaContextCb = window.yaContextCb || [];
              window.yaContextCb.push(() => {
                Ya.Context.AdvManager.render({
                  \"blockId\": \"R-A-15762893-1\",
                  \"renderTo\": \"yandex_rtb_R-A-15762893-1\"
                })
              })
            `
          }}
        />
      </>
    )
  },
}

// В index.css добавить:
// .ad-responsive { max-width: 100vw; }
// @media (max-width: 1024px) { .ad-responsive { max-width: 100vw !important; height: 120px !important; min-height: 120px !important; } }
// @media (max-width: 600px) { .ad-responsive { max-width: 100vw !important; height: 90px !important; min-height: 90px !important; } } 