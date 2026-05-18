# Street View Widget for ArcGIS Experience Builder

A custom ArcGIS Experience Builder widget that opens Google Street View from a map click.

## Features

- Click on the map to capture a point
- Convert clicked coordinates to **WGS84**
- Open Google Street View using the clicked location
- Show a marker on the clicked point
- Support two opening modes:
  - **Show inside the widget**
  - **New tab**
- Optional embedded Street View preview with **Google Maps Embed API key**
- Configurable widget title
- Optional setting to center the map on the clicked point
- Localized UI:
  - English
  - Italian
  - Chinese
  - French
  - German
  - Spanish

## How It Works

When the widget is connected to a map:

1. The user clicks a point on the map
2. The widget reads the clicked geometry
3. The point is converted to WGS84 if needed
4. A Google Street View URL is generated
5. The widget either:
   - shows Street View directly inside the widget, or
   - opens Street View in a new browser tab

## Requirements

- ArcGIS Experience Builder Developer Edition
- A map widget in the experience
- Optional: a valid **Google Maps Embed API key** for embedded Street View inside the widget

## Configuration

The widget supports the following configuration values in `config.json`:

- `widgetTitle`: custom title displayed in the widget
- `googleEmbedApiKey`: optional Google API key for embedded Street View
- `openMode`: display mode
- `centerMapOnClick`: whether to center the map on the clicked point

Example:

~~~json
{
  "widgetTitle": "Street View",
  "googleEmbedApiKey": "",
  "openMode": "custom-popup",
  "centerMapOnClick": true
}
~~~

## Open Modes

### `custom-popup`

Shows Street View directly inside the widget.

- With Google API key: embedded Street View iframe
- Without Google API key: compact panel with coordinates and external link only

### `new-tab`

Opens Google Street View in a new browser tab.

## Installation

Place the widget folder under:

~~~text
client/your-extensions/widgets/streetView
~~~

Then start or restart the Experience Builder client:

~~~bash
npm start
~~~

## Builder Setup

1. Add the widget to the page
2. Open widget settings
3. Select the target map widget
4. Optionally set:
   - widget title
   - Google Maps Embed API key
   - open mode
   - center map on clicked point

## Project Structure

~~~text
streetView/
├─ manifest.json
├─ config.json
├─ icon.svg
└─ src/
   ├─ config.ts
   ├─ runtime/
   │  ├─ widget.tsx
   │  ├─ style.ts
   │  └─ translations/
   │     ├─ default.ts
   │     ├─ it.js
   │     ├─ zh-cn.js
   │     ├─ fr.js
   │     ├─ de.js
   │     └─ es.js
   └─ setting/
      ├─ setting.tsx
      └─ translations/
         ├─ default.ts
         ├─ it.js
         ├─ zh-cn.js
         ├─ fr.js
         ├─ de.js
         └─ es.js
~~~

## Notes

- Embedded Street View requires a valid Google Maps Embed API key
- Without the API key, the widget still works using an external Google Maps / Street View link
- The marker is temporary and can be cleared using the widget button

## License

This widget follows the licensing terms already used in the project files.


