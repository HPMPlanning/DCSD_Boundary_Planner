// Boundary Planner settings.
// Leave zonesLayerUrl empty to run with built-in demo zones.
window.PLANNER_CONFIG = {
  title: "Community Boundary Builder",
  intro:
    "Pick a school, then click elementary zones on the map to assign them. " +
    "Double-click a zone to unassign it.",

  // Public URL of the elementary zones layer, ending in /FeatureServer/0
  zonesLayerUrl: "https://services3.arcgis.com/3TzhpgpIaE4cOUGc/arcgis/rest/services/DEKALBAPPNOTREALDATA/FeatureServer/0",

  // Optional: item ID of a publicly shared web map to use as the background, so its
  // basemap and layers (school points and labels, roads) show under the planner.
  // Leave "" for a plain gray basemap. The zones layer can be in the map or not.
  webMapId: "",
  portalUrl: "",

  // Public add-only table that receives plans, ending in /FeatureServer/0.
  // Leave empty to allow CSV download only.
  submissionsTableUrl: "",

  // Field names in the zones layer. "" means the layer doesn't have it.
  fields: {
    zoneName: "Campus",          // elementary zone name
    zoneId: "",                  // optional unique ID; OBJECTID is used when ""
    msCurrent: "SUM_MS_STUD",    // grades 6-8 students living in the zone
    hsCurrent: "SUM_HS_STUD",    // grades 9-12 students living in the zone
    msProjected: "",             // optional projected grades 6-8; adds a Projected bar
    hsProjected: "",             // optional projected grades 9-12
    currentMs: "",               // optional name of today's middle school
    currentHs: ""                // optional name of today's high school
  },

  // Every middle and high school with its capacity. Required: the page will
  // not load if a school named in the zones layer is missing here.
  // Names must match the zones layer (capital letters and spaces are ignored).
  // Optional: color: "#1f77b4"
  schools: [
    { name: "Chamblee MS", level: "MS", capacity: 1080 },
    { name: "Druid Hills MS", level: "MS", capacity: 1170 },
    { name: "Henderson MS", level: "MS", capacity: 1590 },
    { name: "Peachtree MS", level: "MS", capacity: 1230 },
    { name: "Sequoyah MS", level: "MS", capacity: 1170 },
    { name: "Tucker MS", level: "MS", capacity: 1170 },
    { name: "Chamblee HS", level: "HS", capacity: 1705 },
    { name: "Cross Keys HS", level: "HS", capacity: 1400 },
    { name: "Druid Hills HS", level: "HS", capacity: 1395 },
    { name: "Dunwoody HS", level: "HS", capacity: 1550 },
    { name: "Lakeside HS", level: "HS", capacity: 1705 },
    { name: "Sequoyah HS", level: "HS", capacity: 1600, planned: true }, // not built; starts with no zones (planned only affects the demo map)
    { name: "Tucker HS", level: "HS", capacity: 1736 }
  ],

  // Start each plan from today's assignments (true) or blank (false)
  startFromCurrent: true,

  // Shown on the thank-you screen after someone submits
  nextSteps: [
    "Your plan goes directly to the district's boundary planning team.",
    "The team reviews every submitted plan, along with your comments, as part of the community feedback that shapes boundary options."
  ],

  // Where the map opens (DeKalb County); it then fits the zones exactly
  center: [-84.23, 33.77],
  zoom: 10
};
