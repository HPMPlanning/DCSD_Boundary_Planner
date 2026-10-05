# Export every submitted plan to CSV (one row per plan per zone).
# Paste into an ArcGIS Online Notebook. The CSV is saved to your notebook
# files and added to your content, where staff can download it.

from datetime import datetime, timezone
import pandas as pd
from arcgis.gis import GIS
from arcgis.features import FeatureLayer

gis = GIS("home")

STAFF_VIEW_ITEM_ID = "PASTE_STAFF_VIEW_ITEM_ID_HERE"
ZONES_LAYER_URL = "https://services3.arcgis.com/3TzhpgpIaE4cOUGc/arcgis/rest/services/DEKALBAPPNOTREALDATA/FeatureServer/0"
ZONE_ID_FIELD = "OBJECTID"     # same as config.js fields.zoneId (OBJECTID when that is "")
ZONE_NAME_FIELD = "Campus"

subs = gis.content.get(STAFF_VIEW_ITEM_ID).tables[0].query(where="1=1", out_fields="*", as_df=True)
zones = FeatureLayer(ZONES_LAYER_URL, gis=gis).query(where="1=1", out_fields="*",
                                                         return_geometry=False, as_df=True)
id_col = ZONE_ID_FIELD if ZONE_ID_FIELD in zones.columns else "OBJECTID"
zone_names = dict(zip(zones[id_col].astype(str), zones[ZONE_NAME_FIELD]))


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
            "plan_id": s["plan_id"], "submitted_at": s["submitted_at"],
            "submitter_name": s["submitter_name"], "submitter_email": s["submitter_email"],
            "zone_id": zid, "zone_name": zone_names.get(zid, ""),
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
