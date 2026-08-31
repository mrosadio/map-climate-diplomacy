# Africa's Green Transition: Climate Finance Diplomacy Map

An interactive data visualization mapping bilateral climate finance relationships between African countries and three major foreign actors: **China**, the **European Union**, and the **Gulf Cooperation Council**. Built with D3.js and Bootstrap 5.

**[View live demo →](https://mrosadio.github.io/map-climate-diplomacy/)**

---

## Overview

The visualization lets users explore how each of the three foreign partners engages with African countries on green transition financing: trade flows, foreign direct investment, flagship project counts, and directional investment trends (increasing / decreasing / stable), alongside a connectivity-level choropleth showing the depth of each bilateral relationship.

This project is part of a broader portfolio of interactive data visualizations exploring Africa's international green transition partnerships.

## Features

- **Interactive choropleth map**: country shading reflects level of bilateral connectivity (low / moderate / high)
- **Partner switching**: toggle between China, the EU, and Gulf Countries to redraw the map and update all summary statistics
- **Country-level detail panel**: click any African country to view its specific bilateral relationship data, and cooperation areas
- **Investment trend indicators**: at-a-glance icons showing whether a relationship is intensifying, cooling, or holding steady
- **Responsive layout**: built with a Bootstrap-first approach, adapted for desktop and tablet viewports
- **Sourced throughout**: every partner-level relationship links back to its original data source

## Data sources

Data is compiled and cross-checked from primary and secondary sources, including:

- International Monetary Fund (IMF)
- The World Bank
- Organisation for Economic Co-operation and Development (OECD)
- Global Gateway (European Union)
- China Global Investment Tracker
- Gulf Renewable Projects Tracker

## Tech stack

- [D3.js](https://d3js.org/) (v6) - geographic projection, data-driven map rendering, transitions
- Vanilla JavaScript (ES Modules) - no framework
- [Bootstrap 5.3](https://getbootstrap.com/) - layout grid and responsive utilities
- GeoJSON - country boundary geometry
- CSV - underlying relationship, trade, and investment data

## Project structure

```
├── index.html
├── assets/
│   ├── css/          # main.css, vis-layout.css, printContainer.css
│   ├── js/
│   │   ├── index.js          # entry point
│   │   └── modules/
│   │       ├── dataManager.js     # orchestrates data loading + preparation
│   │       ├── dataLoader.js      # CSV / GeoJSON fetch layer
│   │       ├── dataTransform.js   # merges, filters, reshapes datasets
│   │       ├── drawMap.js         # D3 map rendering (overview + bilateral)
│   │       ├── cards.js           # right-panel info cards
│   │       ├── navigation.js      # overview map orchestration
│   │       ├── layout.js          # sidebar state + partner selection
│   │       └── setUpControls.js   # zoom / label toggle controls
│   ├── img/icons/     # partner icons, trend icons
│   └── db/            # source CSV datasets
```

## Running locally

Because the app uses native ES modules, it needs to be served over HTTP rather than opened directly as a local file:

```bash
git clone https://github.com/mrosadio/map-climate-diplomacy.git
cd map-climate-diplomacy
python3 -m http.server 8000
# then open http://localhost:8000
```

Any local static server works equally well (e.g. `npx serve`, VS Code's Live Server extension).

## Known limitations

- Mobile phone layout is not yet implemented (tablet and desktop are fully supported)
- On very tall/narrow viewports, the map's aspect ratio doesn't yet dynamically adapt to available vertical space

## Author

Micaela Rosadio — [GitHub](https://github.com/mrosadio)