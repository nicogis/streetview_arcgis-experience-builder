import { css } from 'jimu-core'

export const getStyle = () => {
  return css`
    .widget-street-view {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 100%;
      box-sizing: border-box;
    }

    /* Pannello assoluto: riempie tutto il widget */
    .widget-street-view__panel {
      position: absolute;
      inset: 0;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-sizing: border-box;
      overflow: hidden;
    }

    /* Header: non cresce */
    .widget-street-view__header {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-height: 0;
    }

    .widget-street-view__title {
      font-weight: 600;
    }

    .widget-street-view__hint {
      color: #666;
    }

    .widget-street-view__toolbar {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    /* Preview area: cresce per riempire tutto lo spazio sotto l'header */
    .widget-street-view__preview-area {
      flex: 1 1 0;
      height: 0;
      min-width: 0;
      position: relative;
    }

    /* Preview box: assoluto, riempie l'area */
    .widget-street-view__preview {
      position: absolute;
      inset: 0;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      background: #fff;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 12px 16px;
      gap: 8px;
      box-sizing: border-box;
      min-width: 0;
    }

    .widget-street-view__preview-coords {
      flex: 0 0 auto;
      font-size: 12px;
      word-break: break-word;
    }

    /* Wrapper iframe: cresce per riempire tutto lo spazio rimanente nel preview */
    .widget-street-view__iframe-wrapper {
      position: relative;
      flex: 1 1 0;
      height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .widget-street-view__iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 4px;
      display: block;
    }

    .widget-street-view__actions {
      flex: 0 0 auto;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .widget-street-view__note {
      font-size: 12px;
      color: #666;
      flex: 0 0 auto;
    }

    .widget-street-view__map-connection {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
      pointer-events: none;
    }
  `
}