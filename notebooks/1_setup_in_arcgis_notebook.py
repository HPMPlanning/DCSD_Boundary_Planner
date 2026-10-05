# Boundary Planner setup. Paste into a new ArcGIS Online Notebook (Standard) and run.
# It checks your zones layer, creates the add-only submissions table and a
# staff-only view, and prints the config.js text for the planner page.
# Running it twice creates a second table, so run it once.

from arcgis.gis import GIS
from arcgis.features import FeatureLayer, FeatureLayerCollection

gis = GIS("home")

# ---- 1. Edit these ----
# The elementary zones layer (must be shared publicly so the planner can read it)
ZONES_LAYER_URL = "https://services3.arcgis.com/3TzhpgpIaE4cOUGc/arcgis/rest/services/DEKALBAPPNOTREALDATA/FeatureServer/0"
SERVICE_NAME = "boundary_plan_submissions"
STAFF_GROUP_ID = ""                          # optional: share the staff view with this group

FIELDS = {  # same names as config.js; "" means the layer doesn't have it
    "zoneName": "Campus", "zoneId": "",
    "msCurrent": "SUM_MS_STUD", "hsCurrent": "SUM_HS_STUD",
    "msProjected": "", "hsProjected": "",
    "currentMs": "", "currentHs": "",
}
REQUIRED = ["zoneName", "msCurrent", "hsCurrent"]


def share_public(item):
    try:
        item.sharing.sharing_level = "EVERYONE"
    except AttributeError:
        item.share(everyone=True)


# ---- 2. Check the zones layer ----
zones_layer = FeatureLayer(ZONES_LAYER_URL, gis=gis)
layer_fields = {f["name"].upper(): f["name"] for f in zones_layer.properties.fields}

missing = [FIELDS[k] or k for k in FIELDS if (k in REQUIRED or FIELDS[k]) and FIELDS[k].upper() not in layer_fields]
if missing:
    raise SystemExit("Missing fields in the zones layer: " + ", ".join(missing) +
                     ". Rename them in the data, or change FIELDS above to match.")
# Use the layer's exact spelling of each field name
FIELDS = {k: layer_fields.get(v.upper(), v) for k, v in FIELDS.items()}

df = zones_layer.query(where="1=1", out_fields="*", return_geometry=False, as_df=True)
print(f"{len(df)} elementary zones")
problems = []
for key in [k for k in ["msCurrent", "msProjected", "hsCurrent", "hsProjected", "currentMs", "currentHs"] if FIELDS[k]]:
    n = df[FIELDS[key]].isna().sum()
    if n:
        problems.append(f"{n} zones have no {FIELDS[key]}")
for level, now, proj in [("MS", "msCurrent", "msProjected"), ("HS", "hsCurrent", "hsProjected")]:
    line = f"{level} students in all zones: {int(df[FIELDS[now]].sum()):,} now"
    if FIELDS[proj]:
        line += f", {int(df[FIELDS[proj]].sum()):,} projected"
    print(line)
for level, cur in [("MS", "currentMs"), ("HS", "currentHs")]:
    if FIELDS[cur]:
        print(f"\n{level} schools named in the layer (each needs a capacity in config.js):")
        for name in sorted(df[FIELDS[cur]].dropna().astype(str).str.strip().unique()):
            print("  " + name)
print("\nData problems:\n  " + "\n  ".join(problems) if problems else "\nNo data problems found.")


# ---- 3. Create the submissions table ----
def text(name, alias, length):
    return {"name": name, "type": "esriFieldTypeString", "alias": alias, "length": length,
            "nullable": True, "editable": True}


table_def = {
    "name": "Plan_Submissions", "type": "Table", "displayField": "plan_id",
    "objectIdField": "OBJECTID", "hasAttachments": False, "maxRecordCount": 2000,
    "fields": [
        {"name": "OBJECTID", "type": "esriFieldTypeOID", "alias": "OBJECTID", "nullable": False, "editable": False},
        text("plan_id", "Plan ID", 40),
        {"name": "submitted_at", "type": "esriFieldTypeDate", "alias": "Submitted", "nullable": True, "editable": True},
        text("submitter_name", "Name", 100),
        text("submitter_email", "Email", 150),
        text("comments", "Comments", 2000),
        text("ms_plan", "Middle school assignments", 10000),
        text("hs_plan", "High school assignments", 10000),
        text("ms_totals", "Middle school totals", 2000),
        text("hs_totals", "High school totals", 2000),
        text("ms_totals_projected", "Middle school totals (projected)", 2000),
        text("hs_totals_projected", "High school totals (projected)", 2000),
        {"name": "over_capacity", "type": "esriFieldTypeInteger", "alias": "Schools over capacity", "nullable": True, "editable": True},
    ],
    "templates": [{"name": "Plan", "description": "", "drawingTool": "esriFeatureEditToolNone",
                   "prototype": {"attributes": {}}}],
}

sub_item = gis.content.create_service(name=SERVICE_NAME, service_type="featureService",
                                      capabilities="Create,Query,Editing")
sub_item.update(item_properties={"title": "Boundary Plan Submissions",
                                 "snippet": "Public add-only table for boundary planner submissions.",
                                 "tags": "boundary planner"})
sub_flc = FeatureLayerCollection.fromitem(sub_item)
sub_flc.manager.add_to_definition({"tables": [table_def]})

# ---- 4. Staff-only view (read access), created before locking the public service ----
view_item = sub_flc.manager.create_view(name=SERVICE_NAME + "_staff")
view_item.update(item_properties={"title": "Boundary Plan Submissions (staff view)"})
FeatureLayerCollection.fromitem(view_item).manager.update_definition(
    {"capabilities": "Query", "syncEnabled": False})
if STAFF_GROUP_ID:
    try:
        view_item.sharing.groups.add(gis.groups.get(STAFF_GROUP_ID))
    except AttributeError:
        view_item.share(groups=[STAFF_GROUP_ID])

# ---- 5. Lock the public service to add-only and share it ----
sub_item = gis.content.get(sub_item.id)
sub_flc = FeatureLayerCollection.fromitem(sub_item)
sub_flc.manager.update_definition({"capabilities": "Create,Editing", "syncEnabled": False})
share_public(sub_item)

zones_url = zones_layer.url
sub_url = sub_item.tables[0].url if sub_item.tables else sub_flc.url + "/0"

print("\nCreated:")
print("  Public add-only table:", sub_item.homepage)
print("  Staff view (not public):", view_item.homepage)
print("\nPaste these two lines into config.js:\n")
print(f'  zonesLayerUrl: "{zones_url}",')
print(f'  submissionsTableUrl: "{sub_url}",')
