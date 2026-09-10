# Street View Widget for ArcGIS Experience Builder

A custom ArcGIS Experience Builder widget that opens Google Street View from a map click.

## 📦 Download

For ArcGIS Enterprise, download the ready-to-use package that matches your Enterprise version. Do not use **Code → Download ZIP**, because that archive contains the source code and is intended for developers who want to modify or rebuild the widget.

| ArcGIS Enterprise | Experience Builder Developer Edition used for the build | Package |
|---|---:|---|
| 11.5 | 1.17 | [streetView11_5.zip](https://github.com/nicogis/streetview_arcgis-experience-builder/releases/download/v1.0.1/streetView11_5.zip) |
| 12.0 | 1.18 | [streetView12_0.zip](https://github.com/nicogis/streetview_arcgis-experience-builder/releases/download/v1.0.1/streetView12_0.zip) |
| 12.1 | 1.20 | [streetView12_1.zip](https://github.com/nicogis/streetview_arcgis-experience-builder/releases/download/v1.0.1/streetView12_1.zip) |

See the [latest release](https://github.com/nicogis/streetview_arcgis-experience-builder/releases/latest) and Esri's [Experience Builder release-version matrix](https://developers.arcgis.com/experience-builder/guide/release-versions/) for compatibility details.

> **Important:** Use the package built for your ArcGIS Enterprise version. An incompatible Experience Builder build can cause runtime errors.

## Features

- Click on the map to capture a point
- Convert clicked coordinates to **WGS84**
- Open Google Street View using the clicked location
- Show a marker on the clicked point
- Support two opening modes:
  - **Show inside the widget**
  - **New tab**
- Optional embedded Street View preview with a **Google Maps Embed API key**
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

The **embedded Street View mode** uses a Google Maps iframe on the same page as an ArcGIS map. This may conflict with the [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms), including restrictions concerning applications that compete with Google Maps or Google Earth.

**Recommendations:**

- Prefer the **New tab** mode if you need to keep Google Maps content separate from the ArcGIS map.
- Review the applicable terms with your legal team before using embedded mode in production.
- This widget is provided as-is. The authors take no responsibility for Terms of Service violations arising from its use.

## How It Works

When the widget is connected to a map:

1. The user clicks a point on the map.
2. The widget reads the clicked geometry.
3. The point is converted to WGS84 if needed.
4. A Google Street View URL is generated.
5. The widget either:
   - shows Street View inside the widget, or
   - opens Street View in a new browser tab.

## Requirements

### Using a precompiled ArcGIS Enterprise package

- A supported ArcGIS Enterprise version: **11.5, 12.0, or 12.1**
- An Experience Builder app containing a map widget
- An HTTPS web server from which to host the compiled widget
- Portal administrator privileges to register the widget
- Optional: a valid **Google Maps Embed API key** for embedded mode

Experience Builder Developer Edition is **not required** to deploy one of the precompiled release packages.

### Developing or rebuilding the widget

- The Experience Builder Developer Edition matching the target Enterprise version
- The corresponding supported Node.js environment
- A map widget in the experience
- Optional: a valid **Google Maps Embed API key** for embedded mode

## Installation

### ArcGIS Enterprise — precompiled release package

1. Download the ZIP package matching your ArcGIS Enterprise version from the compatibility table above.
2. Extract the archive. It contains a compiled folder named `streetView`.
3. Publish the complete `streetView` folder on an HTTPS web server.
4. Ensure that:
   - anonymous access is enabled;
   - CORS allows requests from your Portal domain;
   - `.json` files are served with the `application/json` MIME type.
5. Verify that the widget manifest is publicly reachable at a URL similar to:

~~~text
https://your-server.example.com/widgets/streetView/manifest.json
~~~

6. Sign in to Portal as an administrator.
7. Go to **Content**, choose **New item**, and register an **Experience Builder widget** using the manifest URL.
8. Share the registered widget with the organization or the appropriate groups.

For the complete procedure, see Esri's [Add custom widgets documentation](https://doc.arcgis.com/en/experience-builder/12.1/configure-widgets/add-custom-widgets.htm).

### Experience Builder Developer Edition — source development

1. Download or clone this repository.
2. Copy the widget source folder to:

~~~text
client/your-extensions/widgets/streetView
~~~

3. Start or restart the Experience Builder client:

~~~bash
npm start
~~~

4. To create a deployable package, follow the build procedure documented for the selected Developer Edition version.

> Developer Edition 1.17 and earlier use a different production-build command and output folder than later versions. Refer to the Esri documentation supplied with your Developer Edition.

## Configuration

The widget supports the following values in `config.json`:

- `widgetTitle`: custom title displayed in the widget
- `googleEmbedApiKey`: optional Google Maps Embed API key
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

Shows Street View inside the widget.

- With a Google Maps Embed API key: displays an embedded Street View iframe. See the Terms of Service warning above.
- Without an API key: displays a compact panel with coordinates and an external link.

### `new-tab`

Opens Google Street View in a separate browser tab. This mode keeps the Google Maps content separate from the ArcGIS map and is the recommended option when embedded use is unsuitable.

## Builder Setup

1. Add the widget to the page.
2. Open the widget settings.
3. Select the target map widget.
4. Optionally configure:
   - widget title;
   - Google Maps Embed API key;
   - open mode;
   - map centering on click.

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

The precompiled release packages contain the generated `dist` files instead of the TypeScript source tree shown above.

## Notes

- Embedded Street View requires a valid Google Maps Embed API key.
- Without an API key, the widget can still provide an external Google Maps/Street View link.
- The marker is temporary and can be cleared using the widget button.
- Prefer **New tab** mode when Google Maps content must remain separate from the ArcGIS map.

## License

Licensed under the [Apache License 2.0](LICENSE.txt).
