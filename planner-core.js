// Map-free planner logic: totals, capacity status, plan encoding and CSV.
(function (root) {
  function schoolsFor(schools, level) {
    return schools.filter(function (s) { return s.level === level; });
  }

  // A school is over capacity only above 100%
  function statusFor(pct) {
    return pct > 100 ? "over" : "ok";
  }

  // zones: [{id, name, msC, msP, hsC, hsP}], assign: {zoneId: schoolId}
  // basis: "C" (current enrollment, default) or "P" (projected)
  function computeTotals(zones, assign, schools, level, basis) {
    var key = (level === "MS" ? "ms" : "hs") + (basis === "P" ? "P" : "C");
    var rows = schoolsFor(schools, level).map(function (s) {
      return { school: s, students: 0, zones: 0 };
    });
    var byId = {};
    rows.forEach(function (r) { byId[r.school.id] = r; });
    var unassigned = { zones: 0, students: 0 };
    zones.forEach(function (z) {
      var r = byId[assign[z.id]];
      var n = Number(z[key]) || 0;
      if (r) { r.students += n; r.zones += 1; }
      else { unassigned.zones += 1; unassigned.students += n; }
    });
    rows.forEach(function (r) {
      r.capacity = r.school.capacity;
      r.pct = r.capacity > 0 ? Math.round((r.students / r.capacity) * 100) : 0;
      r.status = statusFor(r.pct);
    });
    return { rows: rows, unassigned: unassigned };
  }

  function encodePlan(zones, assign) {
    return zones.map(function (z) { return z.id + "=" + (assign[z.id] || ""); }).join("|");
  }

  function decodePlan(text) {
    var out = {};
    String(text || "").split("|").forEach(function (pair) {
      var i = pair.indexOf("=");
      if (i > 0) out[pair.slice(0, i)] = pair.slice(i + 1);
    });
    return out;
  }

  function totalsText(totals) {
    // "Name: students/capacity (pct%)" per school
    return totals.rows.map(function (r) {
      return r.school.name + ": " + r.students + "/" + r.capacity + " (" + r.pct + "%)";
    }).join("; ");
  }

  function csvCell(v) {
    var s = v == null ? "" : String(v);
    // Neutralize spreadsheet formulas
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function buildCsv(zones, msAssign, hsAssign, schools, planId) {
    var names = {};
    schools.forEach(function (s) { names[s.id] = s.name; });
    var lines = [["plan_id", "zone_id", "zone_name", "ms_current", "ms_projected",
      "hs_current", "hs_projected", "middle_school", "high_school"].join(",")];
    zones.forEach(function (z) {
      var ms = msAssign[z.id] || "", hs = hsAssign[z.id] || "";
      lines.push([planId, z.id, z.name, z.msC, z.msP, z.hsC, z.hsP, names[ms] || ms, names[hs] || hs]
        .map(csvCell).join(","));
    });
    return lines.join("\r\n") + "\r\n";
  }

  function makePlanId(now) {
    var d = now || new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return "P" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + rand;
  }

  // Status uses red and amber, so school colors avoid them
  var PALETTE = ["#1f77b4", "#2ca02c", "#9467bd", "#17becf", "#e377c2", "#8c564b",
    "#393b79", "#bcbd22", "#7f7f7f", "#637939", "#5254a3", "#6b6ecf"];

  // Builds the school list from the schools named in the zones layer plus the
  // capacities listed in config.js. Every school must have a capacity.
  // zones: [{curMs, curHs}], configSchools: [{name, level, capacity, color?}].
  // Returns {schools, errors}; the page refuses to run while errors is non-empty.
  function deriveSchools(zones, configSchools) {
    var found = {}, errors = [];
    function key(level, name) { return level + "|" + String(name).trim().toLowerCase(); }
    (configSchools || []).forEach(function (x) {
      var name = x && x.name != null ? String(x.name).trim() : "";
      var level = x && x.level === "HS" ? "HS" : x && x.level === "MS" ? "MS" : "";
      var cap = Number(x && x.capacity);
      if (!name || !level) { errors.push("A school in config.js is missing its name or level (MS or HS)."); return; }
      if (!(cap > 0)) { errors.push(name + " needs a capacity greater than 0 in config.js."); return; }
      if (found[key(level, name)]) { errors.push(name + " is listed twice in config.js."); return; }
      found[key(level, name)] = { id: name, name: name, level: level, capacity: cap, color: x.color, planned: !!x.planned };
    });
    var missing = {};
    zones.forEach(function (z) {
      [["MS", z.curMs], ["HS", z.curHs]].forEach(function (p) {
        var name = p[1] == null ? "" : String(p[1]).trim();
        if (name && !found[key(p[0], name)]) missing[p[0] + " " + name] = true;
      });
    });
    Object.keys(missing).forEach(function (m) {
      errors.push(m.slice(3) + " (" + m.slice(0, 2) + ") is assigned in the zones layer but has no capacity in config.js.");
    });
    var list = Object.keys(found).map(function (k) { return found[k]; });
    list.sort(function (a, b) {
      return a.level === b.level ? a.name.localeCompare(b.name) : (a.level === "MS" ? -1 : 1);
    });
    // Colors restart for each level, since middle and high are shown separately
    var n = { MS: 0, HS: 0 };
    list.forEach(function (s) { var i = n[s.level]++; if (!s.color) s.color = PALETTE[i % PALETTE.length]; });
    return { schools: list, errors: errors };
  }

  // Matches a layer value to a school id, ignoring case and extra spaces.
  function matchSchool(schools, level, value) {
    var v = value == null ? "" : String(value).trim().toLowerCase();
    for (var i = 0; i < schools.length; i++) {
      if (schools[i].level === level && schools[i].id.toLowerCase() === v) return schools[i].id;
    }
    return "";
  }

  // Feeder pattern: for each middle school, the share of its students (from the
  // zones assigned to it) that each high school receives. Zones with no high school
  // count as "unassigned". Weighted by middle school students, or by zone count when
  // a school's zones have no students.
  function computeFeeders(zones, msAssign, hsAssign, schools) {
    var out = [];
    schoolsFor(schools, "MS").forEach(function (ms) {
      var mine = zones.filter(function (z) { return msAssign[z.id] === ms.id; });
      if (!mine.length) return;
      var byStudents = mine.some(function (z) { return Number(z.msC) > 0; });
      var w = function (z) { return byStudents ? Number(z.msC) || 0 : 1; };
      var total = 0, parts = {}, unassigned = 0;
      mine.forEach(function (z) {
        var n = w(z), hs = hsAssign[z.id];
        total += n;
        if (hs) parts[hs] = (parts[hs] || 0) + n; else unassigned += n;
      });
      var list = schoolsFor(schools, "HS").filter(function (h) { return parts[h.id]; }).map(function (h) {
        return { school: h, students: parts[h.id], pct: total ? Math.round(parts[h.id] / total * 100) : 0 };
      }).sort(function (a, b) { return b.students - a.students; });
      out.push({ school: ms, zones: mine.length, total: total, byStudents: byStudents, parts: list,
        unassigned: unassigned, unassignedPct: total ? Math.round(unassigned / total * 100) : 0 });
    });
    return out;
  }

  var api = {
    computeFeeders: computeFeeders,
    deriveSchools: deriveSchools, matchSchool: matchSchool, schoolsFor: schoolsFor, statusFor: statusFor, computeTotals: computeTotals,
    encodePlan: encodePlan, decodePlan: decodePlan, totalsText: totalsText,
    buildCsv: buildCsv, csvCell: csvCell, makePlanId: makePlanId
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PlannerCore = api;
})(this);
