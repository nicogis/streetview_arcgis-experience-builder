# Street View Widget for ArcGIS Experience Builder

A custom ArcGIS Experience Builder widget that opens Google Street View from a map click.


## 📦 Download

If you are using this widget with ArcGIS Enterprise / Experience Builder, please download the ready-to-use package from the Releases section rather than downloading the repository source code.

👉 [Download the latest release](https://github.com/nicogis/streetview_arcgis-experience-builder/releases/)

The release includes the packaged widget ready for deployment and the appropriate build for supported ArcGIS Enterprise versions.

> **Note:** The **Code → Download ZIP** option on GitHub downloads the source code and is intended for developers who want to modify or build the widget themselves.

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

## ⚠️ Important — Google Maps Platform Terms of Service

The **embedded Street View mode** (using a Google Maps Embed API key) displays a Google Maps iframe inside the same page as an ArcGIS map.

This **may violate** the [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms), specifically **§3.2.3 (e) — Restrictions Against Misusing the Services**, which prohibits using Google Maps content on the same screen as a competing mapping platform.

> "Customer will not use the Google Maps Core Services in a Customer Application that is a navigation, mapping, or geospatial application that competes with Google Maps or Google Earth."

**Recommendations:**

- If you need to comply with Google's ToS, use the **"New tab"** open mode instead — Street View opens in a separate browser tab, fully separate from the ArcGIS map.
- Review the terms with your legal team before using the embedded mode in a production environment.
- This widget is provided as-is. The authors take no responsibility for any ToS violations arising from its use.

---

## How It Works

When the widget is connected to a map:

1. The user clicks a point on the map
2. The widget reads the clicked geometry
3. The point is converted to WGS84 if needed
4. A Google Street View URL is generated
5. The widget either:
   - shows Street View directly inside the widget (embedded iframe), or
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

- With Google API key: embedded Street View iframe — **see ToS warning above**
- Without Google API key: compact panel with coordinates and external link only

### `new-tab`

Opens Google Street View in a new browser tab. **This mode is ToS-compliant.**

## Installation

Place the widget folder under:

~~~text
client/your-extensions/widgets/streetView
~~~

Then start or restart the Experience Builder client:

~~~bash
npm start
~~~

### ArcGIS Enterprise Portal

Custom widgets can be uploaded directly to Experience Builder on ArcGIS Enterprise without a developer environment.

> For detailed steps see the official documentation:
> [Add custom widgets — ArcGIS Experience Builder](https://doc.arcgis.com/en/experience-builder/12.0/configure-widgets/add-custom-widgets.htm)


## Builder Setup

1. Add the widget to the page
2. Open widget settings
3. Select the target map widget
4. Optionally set:
   - widget title
   - Google Maps Embed API key *(see ToS warning above)*
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
- Without the API key, the widget works using an external Google Maps / Street View link opened in a new tab
- The marker is temporary and can be cleared using the widget button
- For ToS-compliant usage, prefer the **"New tab"** open mode

## License

This widget follows the licensing terms already used in the project files.


