# Export every submitted plan to CSV (one row per plan per zone).
# Paste into an ArcGIS Online Notebook. The CSV is saved to your notebook
# files and added to your content, where staff can download it.

from datetime import datetime, timezone
import pandas as pd
from arcgis.gis import GIS
from arcgis.features import FeatureLayer

gis = GIS("home")

STAFF_VIEW_ITEM_ID = "PASTE_STAFF_VIEW_ITEM_ID_HERE"
# One zones layer per boundary option, same as the options in config.js. Plans
# submitted before options existed have no option and are read as Option A.
ZONES_LAYER_URLS = {
    "A": "https://services3.arcgis.com/3TzhpgpIaE4cOUGc/arcgis/rest/services/DEKALBAPPNOTREALDATA/FeatureServer/0",
    # "B": "PASTE_OPTION_B_ZONES_LAYER_URL",
    # "C": "PASTE_OPTION_C_ZONES_LAYER_URL",
    # "D": "PASTE_OPTION_D_ZONES_LAYER_URL",
}
ZONE_ID_FIELD = "OBJECTID"     # same as config.js fields.zoneId (OBJECTID when that is "")
ZONE_NAME_FIELD = "Campus"

subs = gis.content.get(STAFF_VIEW_ITEM_ID).tables[0].query(where="1=1", out_fields="*", as_df=True)
if "option" not in subs.columns:
    subs["option"] = "A"
subs["option"] = subs["option"].fillna("").astype(str).str.strip().str.upper().replace("", "A")

zone_names = {}
for opt, url in ZONES_LAYER_URLS.items():
    zones = FeatureLayer(url, gis=gis).query(where="1=1", out_fields="*", return_geometry=False, as_df=True)
    id_col = ZONE_ID_FIELD if ZONE_ID_FIELD in zones.columns else "OBJECTID"
    zone_names[opt] = dict(zip(zones[id_col].astype(str), zones[ZONE_NAME_FIELD]))


def decode(text):
    out = {}
    for pair in str(text or "").split("|"):
        if "=" in pair:
            k, v = pair.split("=", 1)
            out[k] = v
    return out


rows = []
for _, s in subs.iterrows():
    ms, hs = decode(s["ms_plan"]), decode(s["hs_plan"])
    for zid in sorted(set(ms) | set(hs)):
        rows.append({
            "plan_id": s["plan_id"], "option": s["option"], "submitted_at": s["submitted_at"],
            "submitter_name": s["submitter_name"], "submitter_email": s["submitter_email"],
            "zone_id": zid, "zone_name": zone_names.get(s["option"], {}).get(zid, ""),
            "middle_school": ms.get(zid, ""), "high_school": hs.get(zid, ""),
        })

out = pd.DataFrame(rows)


def safe_text(df):
    # Public text can start with = + - @, which Excel would run as a formula
    for col in df.select_dtypes(include="object").columns:
        df[col] = df[col].map(lambda v: "'" + v if isinstance(v, str) and v[:1] in "=+-@" else v)
    return df


out = safe_text(out)
subs = safe_text(subs)
stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")
path = f"/arcgis/home/boundary_plans_{stamp}.csv"
out.to_csv(path, index=False)
summary_path = f"/arcgis/home/boundary_plan_summaries_{stamp}.csv"
subs.drop(columns=["ms_plan", "hs_plan"], errors="ignore").to_csv(summary_path, index=False)

for p, title in [(path, "Boundary plans by zone"), (summary_path, "Boundary plan summaries")]:
    item = gis.content.add({"title": f"{title} {stamp}", "type": "CSV", "tags": "boundary planner"}, data=p)
    print(title, "->", item.homepage)
print(f"{len(subs)} plans, {len(out)} zone rows")
