// Boundary Planner settings.
// Leave zonesLayerUrl empty to run with built-in demo zones.
window.PLANNER_CONFIG = {
  title: "Community Boundary Builder (Engagement Session 3 Option A Only)",
  intro:
    "Pick a school, then click elementary zones on the map to assign them. " +
    "Double-click a zone to unassign it.",

  // Public URL of the elementary zones layer, ending in /FeatureServer/0
  zonesLayerUrl: "https://services3.arcgis.com/3TzhpgpIaE4cOUGc/arcgis/rest/services/PrivateCalcTestLayer/FeatureServer/0",

  // Optional: item ID of a publicly shared web map to use as the background, so its
  // basemap and layers (school points and labels, roads) show under the planner.
  // Leave "" for a plain gray basemap. The zones layer can be in the map or not.
  webMapId: "",
  portalUrl: "",
  // OAuth client ID for signing in to private layers (optional; ?appid= in the address also works)
  oauthAppId: "",

  // Optional: only these elementary zones are loaded; leave [] for every zone in the
  // layer. A name matches a zone whose name contains it ("ES" and "Elementary" are ignored).
  zoneNames: [],

  // While true, the page shows an Under Construction notice unless its address has
  // ?zones=<layer URL>, which is how the private layer is tested
  underConstruction: false,

  // Programs drawn on the zones layer as stand-in zones (matched by name). They stay off the
  // map, show only on their level's tab, and people pick the school that hosts them.
  programs: [
    { name: "High Achievers MS", level: "MS", label: "High Achievers Program" },
    { name: "High Achievers HS", level: "HS", label: "High Achievers Program" }
  ],

  // Optional: public layer of school locations, ending in /FeatureServer/0. Points are
  // matched to the schools below by name ("Dunwoody HS" matches "Dunwoody High School"),
  // so elementary, charter and private schools in the layer are ignored. Shows the
  // schools on the map and lets people fill unassigned zones with the nearest school.
  schoolPointsUrl: "https://services3.arcgis.com/3TzhpgpIaE4cOUGc/arcgis/rest/services/schools/FeatureServer/19",
  schoolPointsNameField: "Name",   // leave "" to find the name field automatically
  schoolPointsWhere: "AttArea = 'Y'",  // only schools with attendance zones; "1=1" for all

  // Public add-only table that receives plans, ending in /FeatureServer/0.
  // Leave empty to allow CSV download only.
  submissionsTableUrl: "https://services3.arcgis.com/3TzhpgpIaE4cOUGc/arcgis/rest/services/Submissions/FeatureServer",
  // Submitted plans open in the person's email app, addressed here (used instead of the table when set)
  submitEmail: "",

  // Field names in the zones layer. "" means the layer doesn't have it.
  fields: {
    // Each of the first three lists the test layer's field name, then the real layer's
    zoneName: ["Campus", "School_Nam"],        // elementary zone name
    zoneId: "",                  // optional unique ID; OBJECTID is used when ""
    msCurrent: ["SUM_MS_STUD", "Tot_6_8"],     // grades 6-8 students living in the zone
    hsCurrent: ["SUM_HS_STUD", "Tot_9_12"],    // grades 9-12 students living in the zone
    msProjected: "",             // optional projected grades 6-8; adds a Projected bar
    hsProjected: "",             // optional projected grades 9-12
    currentMs: "",               // optional name of today's middle school
    currentHs: ""                // optional name of today's high school
  },

  // Every middle and high school with its capacity. Required: the page will
  // not load if a school named in the zones layer is missing here.
  // Names must match the zones layer (capital letters and spaces are ignored).
  // Optional: color: "#1f77b4"
  // Each middle school shares the color of the high school it feeds today
  // (Cross Keys HS has no middle school of its own).
  // nonResident: students who attend from outside the zones; locked to the school and always counted
  schools: [
    { name: "Chamblee MS", color: "#1f77b4", level: "MS", capacity: 1080, nonResident: 32 },
    { name: "Druid Hills MS", color: "#2ca02c", level: "MS", capacity: 1170, nonResident: 88 },
    { name: "Henderson MS", color: "#9467bd", level: "MS", capacity: 1590, nonResident: 77 },
    { name: "Peachtree MS", color: "#17becf", level: "MS", capacity: 1230, nonResident: 44 },
    { name: "Sequoyah MS", color: "#e377c2", level: "MS", capacity: 1170, nonResident: 36 },
    { name: "Tucker MS", color: "#8c564b", level: "MS", capacity: 1170, nonResident: 87 },
    { name: "Chamblee HS", color: "#1f77b4", level: "HS", capacity: 1705, nonResident: 46 },
    { name: "Cross Keys HS", color: "#ff7f0e", level: "HS", capacity: 1400, nonResident: 57 },
    { name: "Druid Hills HS", color: "#2ca02c", level: "HS", capacity: 1395, nonResident: 91 },
    { name: "Dunwoody HS", color: "#17becf", level: "HS", capacity: 1550, nonResident: 76 },
    { name: "Lakeside HS", color: "#9467bd", level: "HS", capacity: 1705, nonResident: 80 },
    { name: "Sequoyah HS", color: "#e377c2", level: "HS", capacity: 1600, nonResident: 60, planned: true }, // not built; starts with no zones (planned only affects the demo map)
    { name: "Tucker HS", color: "#8c564b", level: "HS", capacity: 1736, nonResident: 169 }
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
  zoom: 10,
  alwaysShowLabels: ["Doraville United"]   // zone labels that always show, even under a school name
};
