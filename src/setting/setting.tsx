/** @jsx jsx */
import { React, jsx, type IntlShape } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow, MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import type { IMConfig, OpenMode } from '../config'
import defaultMessages from './translations/default'

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>> {
  nls = (id: keyof typeof defaultMessages): string => {
    const intl = this.props.intl as IntlShape | undefined
    return intl ? intl.formatMessage({ id, defaultMessage: defaultMessages[id] }) : defaultMessages[id]
  }

  private renderSectionTitle = (text: string) => (
    <div style={{ fontWeight: 600, margin: '12px 0 8px 0' }}>{text}</div>
  )

  private renderFieldLabel = (text: string) => (
    <div style={{ fontWeight: 500, marginBottom: 6 }}>{text}</div>
  )

  private fieldContainerStyle: React.CSSProperties = {
    width: 'calc(100% - 16px)',
    maxWidth: '260px'
  }

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds
    })
  }

  onApiKeyChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('googleEmbedApiKey', evt.currentTarget.value)
    })
  }

  onModeChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('openMode', evt.currentTarget.value as OpenMode)
    })
  }

  onTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('widgetTitle', evt.currentTarget.value)
    })
  }

  onCenterMapOnClickChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('centerMapOnClick', evt.currentTarget.checked)
    })
  }

  render () {
    return (
      <div className="widget-setting-street-view p-2" style={{ width: '100%' }}>
        {this.renderSectionTitle(this.nls('mapSection'))}
        <SettingSection>
          <SettingRow>
            <div style={this.fieldContainerStyle}>
              {this.renderFieldLabel(this.nls('selectMap'))}
              <MapWidgetSelector
                useMapWidgetIds={this.props.useMapWidgetIds}
                onSelect={this.onMapWidgetSelected}
              />
            </div>
          </SettingRow>
        </SettingSection>

        {this.renderSectionTitle(this.nls('displaySection'))}
        <SettingSection>
          <SettingRow>
            <div style={this.fieldContainerStyle}>
              {this.renderFieldLabel(this.nls('titleLabel'))}
              <input
                style={{ width: '100%' }}
                value={this.props.config.widgetTitle || ''}
                onChange={this.onTitleChange}
              />
            </div>
          </SettingRow>

          <SettingRow>
            <div style={this.fieldContainerStyle}>
              {this.renderFieldLabel(this.nls('openMode'))}
              <select
                style={{ width: '100%' }}
                value={this.props.config.openMode || 'custom-popup'}
                onChange={this.onModeChange}
              >
                <option value="custom-popup">{this.nls('modeCustomPopup')}</option>
                <option value="new-tab">{this.nls('modeNewTab')}</option>
              </select>
            </div>
          </SettingRow>

          <SettingRow>
            <div style={this.fieldContainerStyle}>
              {this.renderFieldLabel(this.nls('centerMapOnClick'))}
              <input
                type="checkbox"
                checked={this.props.config.centerMapOnClick !== false}
                onChange={this.onCenterMapOnClickChange}
              />
            </div>
          </SettingRow>
        </SettingSection>

        {this.renderSectionTitle(this.nls('googleSection'))}
        <SettingSection>
          <SettingRow>
            <div style={this.fieldContainerStyle}>
              {this.renderFieldLabel(this.nls('apiKey'))}
              <input
                style={{ width: '100%' }}
                value={this.props.config.googleEmbedApiKey || ''}
                onChange={this.onApiKeyChange}
              />
            </div>
          </SettingRow>
        </SettingSection>
      </div>
    )
  }
}
