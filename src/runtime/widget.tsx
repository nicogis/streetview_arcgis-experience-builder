/** @jsx jsx */
import { React, jsx, type AllWidgetProps, WidgetState } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { Button } from 'jimu-ui'
import Graphic from 'esri/Graphic'
import * as webMercatorUtils from 'esri/geometry/support/webMercatorUtils'
import type { IMConfig } from '../config'
import defaultMessages from './translations/default'
import { getStyle } from './style'

interface State {
  lat?: number
  lon?: number
  streetViewUrl?: string
  customPopupOpen: boolean
  captureEnabled: boolean
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, State> {
  state: State = {
    customPopupOpen: false,
    captureEnabled: true
  }

  private jimuMapView: JimuMapView | null = null
  private clickHandle: { remove: () => void } | null = null
  private markerGraphic: Graphic | null = null

  nls = (id: keyof typeof defaultMessages): string => {
      return this.props.intl.formatMessage({
          id,
          defaultMessage: defaultMessages[id]
      })
  }

  componentWillUnmount (): void {
    this.removeClickHandler()
    this.clearMarker()
    this.jimuMapView = null
  }

  private readonly removeClickHandler = (): void => {
    if (this.clickHandle) {
      this.clickHandle.remove()
      this.clickHandle = null
    }
  }

  private readonly onActiveViewChange = (jimuMapView: JimuMapView): void => {
    if (!jimuMapView?.view) return

    if (this.jimuMapView?.view === jimuMapView.view) {
      this.addClickHandler()
      return
    }

    this.removeClickHandler()
    this.clearCurrentPoint()

    this.jimuMapView = jimuMapView
    this.addClickHandler()
  }

  private readonly onMapClick = (event: __esri.ViewClickEvent): void => {
    const view = this.jimuMapView?.view
    if (!view || !event.mapPoint || !this.state.captureEnabled || !this.isWidgetOpened()) return

    const clickedPoint = event.mapPoint.clone()
    const wgs84Point = this.toWgs84(clickedPoint)
    if (!wgs84Point) return

    this.setMarker(clickedPoint)

    if (this.props.config.centerMapOnClick ?? true) {
      view.goTo(
        { center: clickedPoint },
        { animate: false }
      ).catch(() => undefined)
    }

    const lat = Number(wgs84Point.latitude.toFixed(6))
    const lon = Number(wgs84Point.longitude.toFixed(6))
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(`${lat},${lon}`)}`
    const openMode = this.props.config.openMode || 'custom-popup'
    const hasEmbed = Boolean(this.props.config.googleEmbedApiKey?.trim())

    this.setState({
      lat,
      lon,
      streetViewUrl,
      customPopupOpen: openMode === 'custom-popup'
    })

    if (openMode === 'new-tab' || !hasEmbed) {
      window.open(streetViewUrl, '_blank', 'noopener,noreferrer')
    }
  }

  private toWgs84 (point: __esri.Point): __esri.Point | null {
    if (!point?.spatialReference) return null

    if (point.spatialReference.isWGS84) {
      return point
    }

    if (point.spatialReference.isWebMercator) {
      return webMercatorUtils.webMercatorToGeographic(point) as __esri.Point
    }

    return null
  }

  private readonly setMarker = (point: __esri.Point): void => {
    const view = this.jimuMapView?.view
    if (!view) return

    // Rimuove sempre il vecchio graphic e ne crea uno nuovo:
    // mutare .geometry direttamente non garantisce il redraw in EXB.
    if (this.markerGraphic) {
      view.graphics.remove(this.markerGraphic)
      this.markerGraphic = null
    }

    this.markerGraphic = new Graphic({
      geometry: point.clone(),
      symbol: {
        type: 'simple-marker',
        style: 'circle',
        color: [220, 53, 69, 0.95],
        size: 12,
        outline: {
          color: [255, 255, 255, 1],
          width: 2
        }
      } as any
    })

    view.graphics.add(this.markerGraphic)

    // Micro-goTo al centro corrente: forza il renderer a ridisegnare
    // senza spostare la mappa visivamente.
      if (!(this.props.config.centerMapOnClick ?? true)) {
      const center = view.center?.clone()
      if (center) {
          view.goTo({ center }, { animate: false }).catch(() => undefined)
      }
    }
  }


  private readonly clearMarker = (): void => {
    const view = this.jimuMapView?.view

    if (view && this.markerGraphic) {
      view.graphics.remove(this.markerGraphic)
    }

    this.markerGraphic = null
  }

  private readonly refreshViewAfterClear = (): void => {
    const view = this.jimuMapView?.view
    if (!view) return

    const center = view.center?.clone()
    if (!center) return

    const dx = view.resolution ? view.resolution * 0.25 : 0.01

    view.goTo(
      {
        center: {
          x: center.x + dx,
          y: center.y,
          spatialReference: center.spatialReference
        }
      },
      { animate: false }
    ).then(() => {
      view.goTo({ center }, { animate: false }).catch(() => undefined)
    }).catch(() => undefined)
  }

  private readonly clearCurrentPoint = (): void => {
    this.clearMarker()

    this.setState({
      lat: undefined,
      lon: undefined,
      streetViewUrl: undefined,
      customPopupOpen: false
    }, () => {
      this.refreshViewAfterClear()
    })
  }

  private readonly toggleCapture = (): void => {
    this.setState((prevState) => ({
      captureEnabled: !prevState.captureEnabled
    }))
  }

  private renderCustomPopup () {
    if (!this.state.customPopupOpen || this.state.lat == null || this.state.lon == null || !this.state.streetViewUrl) {
      return null
    }

    const apiKey = this.props.config.googleEmbedApiKey?.trim()

    if (!apiKey) {
      return (
        <div className="widget-street-view__preview-area widget-street-view__preview-area--compact">
          <div className="widget-street-view__preview widget-street-view__preview--compact">
            <div className="widget-street-view__preview-body">
              <div className="widget-street-view__preview-coords">
                <strong>{this.nls('coords')}:</strong> {this.state.lat}, {this.state.lon}
              </div>
              <div className="widget-street-view__actions">
                <a href={this.state.streetViewUrl} target="_blank" rel="noopener noreferrer">
                  {this.nls('openStreetView')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const embedUrl = `https://www.google.com/maps/embed/v1/streetview?key=${encodeURIComponent(apiKey)}&location=${this.state.lat},${this.state.lon}`

    return (
      <div className="widget-street-view__preview-area widget-street-view__preview-area--embedded">
        <div className="widget-street-view__preview widget-street-view__preview--embedded">
          <div className="widget-street-view__preview-body">
            <div className="widget-street-view__preview-coords">
              <strong>{this.nls('coords')}:</strong> {this.state.lat}, {this.state.lon}
            </div>
            <div className="widget-street-view__iframe-wrapper">
              <iframe
                className="widget-street-view__iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={embedUrl}
              />
            </div>
            <div className="widget-street-view__actions">
              <a href={this.state.streetViewUrl} target="_blank" rel="noopener noreferrer">
                {this.nls('openGoogleMaps')}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private readonly getWidgetTitle = (): string => {
    const configuredTitle = this.props.config.widgetTitle?.trim()
    return configuredTitle || this.nls('title')
  }

  private readonly isWidgetOpened = (): boolean => {
    return this.props.state == null || this.props.state === WidgetState.Opened
  }

  private readonly addClickHandler = (): void => {
    const view = this.jimuMapView?.view

    if (!view || this.clickHandle || !this.isWidgetOpened()) return

    this.clickHandle = view.on('click', this.onMapClick)
  }

  componentDidUpdate (prevProps: AllWidgetProps<IMConfig>): void {
    if (prevProps.state !== this.props.state) {
      if (this.isWidgetOpened()) {
        this.addClickHandler()
      } else {
        this.removeClickHandler()
      }
    }
  }

  render () {
    const hasMap = this.props.useMapWidgetIds?.length > 0
    const hint = !hasMap
      ? this.nls('selectMap')
      : this.state.captureEnabled
        ? this.nls('clickMap')
        : this.nls('clickDisabled')

    const apiKey = this.props.config.googleEmbedApiKey?.trim()
    const { customPopupOpen, lat, lon, streetViewUrl } = this.state
    const showPreview = customPopupOpen && lat != null && lon != null && streetViewUrl != null

    const embedUrl = apiKey && showPreview
      ? `https://www.google.com/maps/embed/v1/streetview?key=${encodeURIComponent(apiKey)}&location=${lat},${lon}`
      : null

    return (
      <div className="widget-street-view jimu-widget" css={getStyle()}>

        {/* Pannello principale: occupa tutto il widget con position absolute */}
        <div className="widget-street-view__panel">

          {/* Header: titolo, hint, toolbar — flex: 0 0 auto */}
          <div className="widget-street-view__header">
            <div className="widget-street-view__title">{this.getWidgetTitle()}</div>
            <div className="widget-street-view__hint">{hint}</div>
            <div className="widget-street-view__toolbar">
              <Button
                size="sm"
                type={this.state.captureEnabled ? 'primary' : 'default'}
                onClick={this.toggleCapture}
              >
                {this.state.captureEnabled ? this.nls('deactivateClick') : this.nls('activateClick')}
              </Button>
              <Button
                size="sm"
                onClick={this.clearCurrentPoint}
                disabled={lat == null}
              >
                {this.nls('clearPoint')}
              </Button>
            </div>
          </div>

          {/* Area preview: cresce per riempire il resto */}
          {showPreview && (
            <div className="widget-street-view__preview-area">
              <div className="widget-street-view__preview">

                {embedUrl
                  ? (
                  <>
                    <div className="widget-street-view__preview-coords">
                      <strong>{this.nls('coords')}:</strong> {lat}, {lon}
                    </div>
                    <div className="widget-street-view__iframe-wrapper">
                      <iframe
                        className="widget-street-view__iframe"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={embedUrl}
                      />
                    </div>
                    <div className="widget-street-view__actions">
                      <a href={streetViewUrl} target="_blank" rel="noopener noreferrer">
                        {this.nls('openGoogleMaps')}
                      </a>
                    </div>
                  </>
                    )
                  : (
                  <>
                    <div className="widget-street-view__preview-coords">
                      <strong>{this.nls('coords')}:</strong> {lat}, {lon}
                    </div>
                    <div className="widget-street-view__actions">
                      <a href={streetViewUrl} target="_blank" rel="noopener noreferrer">
                        {this.nls('openStreetView')}
                      </a>
                    </div>
                  </>
                    )}

              </div>
            </div>
          )}

        </div>

        {hasMap && (
          <div className="widget-street-view__map-connection">
            <JimuMapViewComponent
              useMapWidgetId={this.props.useMapWidgetIds[0]}
              onActiveViewChange={this.onActiveViewChange}
            />
          </div>
        )}
      </div>
    )
  }
}
