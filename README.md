# Africa's Energy Transition Financing Map

> Who is financing Africa's energy transition — and how much has actually been delivered?


---

## Research Context

Africa's energy transition is at a critical crossroads, with financing as a 
central challenge. Three major actors, China, the European Union, and Gulf 
states, play leading but distinct roles. This database maps trade, investment, 
and flagship green projects between African countries and these actors, using 
primary and secondary sources including the IMF, World Bank, OECD, Global 
Gateway, China Global Investment Tracker, and Gulf Renewable Projects Tracker. 
To ensure accuracy, we cross-check datasets, distinguish pledged from disbursed 
funds, and add qualitative caveats.

---

## Design Decisions

- **Three-actor structure:** The tool allows users to filter by financing 
actor (China, EU, Gulf states). African partner countries are colored by 
connectivity level, not by actor, using a three-tier green scale 
(Low / Moderate / High), showing the density of financing 
relationships rather than actor identity.

- **Pledged vs. disbursed:** This distinction is documented in the 
methodology text as a data quality caveat but is not currently 
visualized. Implementing it as a toggle or visual encoding is a planned 
extension.

- **Map projection:** Both the overview and bilateral maps use Mercator 
(`d3.geoMercator()`), centered on Africa (`center: [20, 2]`, 
`scale: 320`). An earlier version used Natural Earth 
(`d3.geoNaturalEarth1()`) for the bilateral view, but this was removed 
when the map was scoped to Africa only.

- **Color palette:** African partner countries are encoded using three 
greens (`#c8dac0`, `#739e69`, `#3a653a`) representing Low, Moderate, 
and High investment connectivity. Grey (`#d3d3d3`) is used for countries with no 
data. The palette avoids colors associated with specific actors to keep 
the encoding neutral.

---

## Data Sources

| Source | Link | Notes |
|--------|----------|-------|
| IMF | [link](https://data.imf.org/datasets/IMF.STA:IMTS) | ... |
| World Bank | [link](https://data.worldbank.org/country/1W) | ... |

Last updated: April 2025

## Known limitations: 
- Coverage is limited to 6–7 African countries per partner, not all 54
- The pledged vs. disbursed distinction exists in the data notes but is 
  not yet visualized
- The Low/Moderate/High connectivity thresholds driving the color scale 
  are not documented in the codebase
- Selecting an African country without first selecting a partner actor 
  does not trigger a response — this can confuse users and is a known 
  UX gap
- No mobile support (explicitly out of scope for the current version)
- Trend direction indicators (`trendConfig`) are present in the data but 
  their derivation methodology is not documented

---

## Run Locally

git clone https://github.com/username/repo-name
cd repo-name
python3 -m http.server 8000

Then open http://localhost:8000

---

## Future improvements
- **Code architecture:** `globals.js` currently mixes configuration, 
runtime state, and data — these should be split into separate modules. 
The bilateral data pipeline (`reshapedBiData`, `mergedBilateralData`) 
is rebuilt on every page load, which would not scale to a larger dataset 
and should be replaced with caching or a build step.

- **Error handling:** There is no fallback when 
`partnerCountryText[partner][section][country]` is undefined — the tool 
fails silently. Adding explicit error boundaries would improve 
robustness.

- **Pledged vs. disbursed toggle:** This is the most important missing 
feature. This still needs to be implemented in the visualization.


---

## Credits

Built for the Africa Policy Research Institute (APRI).
Data collection: Marius Kretzschmar
Visualization development: Micaela Rosadio
