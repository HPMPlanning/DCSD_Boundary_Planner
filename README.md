# Boundary Planner

This is a public web page where people assign each elementary zone to a middle school and a high school. The map recolors as they work, and each school's enrollment and capacity percentage updates live. People can then submit their plan and download it as a CSV.

It is built only on Esri's ArcGIS Maps SDK for JavaScript (loaded from js.arcgis.com) and your own ArcGIS Online layers. No other services are involved.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The planner page |
| `planner-core.js` | Totals, capacity, and CSV logic used by the page |
| `config.js` | Settings: the two layer URLs and field names |
| `notebooks/1_setup_in_arcgis_notebook.py` | Run once in an ArcGIS Online Notebook: checks your data, creates the submissions table, and prints the config lines |
| `notebooks/2_export_submissions_csv.py` | Run whenever staff want every submitted plan as CSV |
| `sample-data/sample_zones.geojson` | 24 fake zones for testing the full flow before real data |

## What your zones layer needs

Every school, current assignment, and capacity is read from the zones layer. Nothing else needs to be maintained.

| Field | Meaning | Example |
| --- | --- | --- |
| `ZONE_NAME` | Elementary zone name | Maple Elementary |
| `ZONE_ID` | Optional unique ID (OBJECTID is used if missing) | E01 |
| `MS_CURRENT` | Grade 6-8 students living in the zone today | 142 |
| `MS_PROJECTED` | Grade 6-8 students projected | 150 |
| `HS_CURRENT` | Grade 9-12 students living in the zone today | 188 |
| `HS_PROJECTED` | Grade 9-12 students projected | 201 |
| `CURRENT_MS` | Name of today's middle school | Tucker MS |
| `CURRENT_HS` | Name of today's high school | Tucker HS |

If your fields use different names, the setup notebook reports which ones are missing, and you can change the names in `config.js`. School names must not contain `|` or `=`.

**Capacities are required and live in `config.js`** under `schools`, one line per middle and high school (`{ name: "Lincoln MS", level: "MS", capacity: 900 }`). The setup notebook prints this list with every school it finds in the layer, so you only fill in the numbers. If any school is missing a capacity, the page shows which one and does not start. A school that serves no zones today (for example a new building) can be added to the same list.

## Setup

1. **Upload the zones.** In ArcGIS Online, go to Content, then New item, and add your zipped shapefile, file geodatabase, or GeoJSON as a hosted feature layer. To try the whole flow first, upload `sample-data/sample_zones.geojson`.
2. **Run the setup notebook.** In ArcGIS Online, open Notebook and create a new Standard notebook. Paste in `notebooks/1_setup_in_arcgis_notebook.py`, set `ZONES_ITEM_ID` to the layer's item ID (from its URL), and run it. It does four things:
    - checks the fields, lists any problems, and prints the schools list for `config.js` with a blank capacity for each school
    - shares the zones layer publicly
    - creates a public table that only accepts new rows, plus a staff view that only your organization can read
    - prints two lines for `config.js`
3. **Edit `config.js`.** Paste in the two printed lines (`zonesLayerUrl`, `submissionsTableUrl`) and change the title or intro text if you like.
4. **Host the page.** Put `index.html`, `config.js`, and `planner-core.js` together in one folder on the district website. Any static host (Netlify, Cloudflare Pages, GitHub Pages) also works. Open `index.html` from there.
5. **Optional: put it inside Experience Builder.** Add an Embed widget, choose "By URL", and paste the page's https link. Test Download CSV inside the embed, because some browsers block downloads from embedded frames. The page also works on its own.
6. **Get the results.** Run `notebooks/2_export_submissions_csv.py` in a Notebook with the staff view's item ID. It saves two CSVs to your content: one row per plan per zone, and one row per plan with its totals. You can also open the staff view in Map Viewer or Excel at any time.

If `zonesLayerUrl` is empty, the page runs with built-in demo zones, so you can preview it before any data is uploaded.

## Hosting on Google Sites

`boundary-planner-single-file.html` is the same page with `config.js` and `planner-core.js` built in. Edit the `PLANNER_CONFIG` block near the top of that file (the two URLs), then in Google Sites choose Insert, then Embed, then Embed code, paste the whole file, and drag the block to full width and tall. Google runs embedded code in a sandboxed frame, so check two things during QA: that the map loads, and whether Download CSV works there (submissions to ArcGIS Online are unaffected either way).

## QA checklist

- [ ] The page loads signed out, in a private window, on desktop and on a phone
- [ ] Every zone appears and is colored by its current school; the totals match a hand count for two schools
- [ ] Clicking a zone with a school selected recolors it, and the totals change by that zone's student count
- [ ] Undo and Start over behave as expected, and switching between the middle and high tabs keeps each set of choices
- [ ] A school above 100% of capacity, now or projected, is marked "over" in red
- [ ] Submitting with an unassigned zone is refused with a message
- [ ] Submitting a complete plan shows a plan ID and downloads a CSV
- [ ] The new row appears in the staff view and not in the public table (signed out, the public table's data page shows no records)
- [ ] The export notebook produces both CSVs, and the zone rows match the downloaded CSV
- [ ] Re-run the setup notebook's data check whenever the zones layer is replaced

## Notes

- Plans are stored as text (`E01=Lincoln MS|E02=...`) in the `ms_plan` and `hs_plan` fields. The export notebook turns them into rows.
- Anonymous forms cannot prevent repeat or spam submissions. Plan IDs and timestamps make duplicates easy to screen.
- The page loads up to the layer's maximum record count (2,000 by default), which is far more than any district's elementary zones.
