// English / Spanish text for the planner.
//
// T("English text {n}", { n: 3 }) returns the text in the chosen language with
// {placeholders} filled in. Text with no Spanish entry below shows in English,
// so a new config.js line still works before it is translated.
//
// Elements with data-i18n="key" in index.html get their contents from
// PLANNER_I18N.html[key] in Spanish, and from the page's own English otherwise.
// data-i18n-aria="English label" translates an aria-label the same way.
(function () {
  var ES = {
    // ---- config.js text (title, intro, notes, programs, next steps) ----
    "Community Boundary Builder (Engagement Session 3 Option A Only)": "Creador de Límites Comunitarios (solo Opción A de la Sesión de Participación 3)",
    "Community Boundary Builder": "Creador de Límites Comunitarios",
    "Pick a school, then click elementary zones on the map to assign them. Double-click a zone to unassign it.":
      "Elija una escuela y luego haga clic en las zonas de primaria del mapa para asignarlas. Haga doble clic en una zona para quitar la asignación.",
    "Excludes High Achievers students": "No incluye a los estudiantes de High Achievers",
    "Assumption of non-resident attendees": "Cantidad estimada de estudiantes no residentes",
    "High Achievers Program": "Programa High Achievers",
    "Your plan goes directly to the district's boundary planning team.": "Su plan va directamente al equipo de planificación de límites del distrito.",
    "The team reviews every submitted plan, along with your comments, as part of the community feedback that shapes boundary options.":
      "El equipo revisa cada plan enviado, junto con sus comentarios, como parte de la opinión de la comunidad que da forma a las opciones de límites.",

    // ---- side panel ----
    "Unassigned zone": "Zona sin asignar",
    "Unassigned": "Sin asignar",
    "{n} zone still needs a middle school": "A {n} zona todavía le falta escuela intermedia",
    "{n} zones still need a middle school": "A {n} zonas todavía les falta escuela intermedia",
    "{n} zone still needs a high school": "A {n} zona todavía le falta escuela secundaria",
    "{n} zones still need a high school": "A {n} zonas todavía les falta escuela secundaria",
    "Every zone has a middle school": "Todas las zonas tienen escuela intermedia",
    "Every zone has a high school": "Todas las zonas tienen escuela secundaria",
    "{n} students are not yet assigned.": "{n} estudiantes todavía no están asignados.",
    "{n} students ({p} projected) are not yet assigned.": "{n} estudiantes ({p} proyectados) todavía no están asignados.",
    "Fill it with the nearest middle school": "Asignarla a la escuela intermedia más cercana",
    "Fill them with the nearest middle school": "Asignarlas a la escuela intermedia más cercana",
    "Fill it with the nearest high school": "Asignarla a la escuela secundaria más cercana",
    "Fill them with the nearest high school": "Asignarlas a la escuela secundaria más cercana",
    "Assigning to ": "Asignando a ",
    "Unassigning zones": "Quitando asignaciones",
    "Hosts {list}": "Sede de {list}",
    "School hosting {name}": "Escuela sede de {name}",
    "Non-resident students, fixed in every plan": "Estudiantes no residentes, fijos en todos los planes",
    "High Achievers Program students (★ marks the host school)": "Estudiantes del Programa High Achievers (★ indica la escuela sede)",
    "{n} zones assigned to their nearest school.": "{n} zonas asignadas a su escuela más cercana.",
    "{zone} assigned to {school}.": "{zone} asignada a {school}.",
    "{zone} unassigned.": "Se quitó la asignación de {zone}.",
    "Undid filling with the nearest schools.": "Se deshizo la asignación a las escuelas más cercanas.",
    "Undid the last change.": "Se deshizo el último cambio.",
    "Showing a plan opened from a link.": "Se muestra un plan abierto desde un enlace.",
    "That plan link didn't match these zones, so the map starts fresh.": "Ese enlace no coincide con estas zonas, así que el mapa empieza de nuevo.",
    "Start over? This clears your changes.": "¿Empezar de nuevo? Esto borra sus cambios.",
    "Start over": "Empezar de nuevo",
    "Cancel": "Cancelar",
    "OK": "Aceptar",
    " over": " excedido",
    "Projected": "Proyectado",

    // ---- map ----
    "Middle Students": "estudiantes de intermedia",
    "High Students": "estudiantes de secundaria",
    "This planner isn't open to the public yet. Sign in with an ArcGIS account that has access to see it.":
      "Este planificador todavía no está abierto al público. Inicie sesión con una cuenta de ArcGIS que tenga acceso para verlo.",
    "The zones layer could not be loaded. ": "No se pudo cargar la capa de zonas. ",
    "The background map could not be loaded, so a plain basemap is shown. Check that webMapId is right and the map is shared publicly.":
      "No se pudo cargar el mapa de fondo, así que se muestra un mapa base simple.",

    // ---- feeder patterns ----
    "Feeder patterns": "Patrones de transición",
    "Back to map": "Volver al mapa",
    "Percentages show how a split school's students divide.": "Los porcentajes muestran cómo se dividen los estudiantes de una escuela dividida.",
    " {left} of {total} elementary zones are not assigned yet and are left out.": " {left} de {total} zonas de primaria todavía no están asignadas y no se incluyen.",
    "Assign elementary zones to schools to see feeder patterns.": "Asigne zonas de primaria a escuelas para ver los patrones de transición.",
    "Assign zones to middle and high schools to see feeder patterns.": "Asigne zonas a escuelas intermedias y secundarias para ver los patrones de transición.",
    "No split": "Sin división",
    "{k}-way split": "Dividida en {k}",
    "No middle school": "Sin escuela intermedia",
    "No high school": "Sin escuela secundaria",

    // ---- submitting ----
    "Assign every zone before submitting ({list} school zones still open).": "Asigne todas las zonas antes de enviar (faltan zonas de {list}).",
    "{n} middle": "{n} de escuela intermedia",
    "{n} high": "{n} de escuela secundaria",
    " and ": " y ",
    "Online submission is not set up yet.": "El envío en línea todavía no está disponible.",
    "Submitting…": "Enviando…",
    "Submission failed: {err} Please try again.": "No se pudo enviar: {err} Inténtelo de nuevo.",
    "Almost done: send the email": "Casi listo: envíe el correo",
    "Copied": "Copiado",

    // ---- language switch ----
    "Español": "Español",
    "English": "English",
    "Map of elementary zones": "Mapa de las zonas de primaria",
    "Feeder pattern tree": "Diagrama de patrones de transición",
    "Your plan as text": "Su plan como texto"
  };

  // Longer blocks of page text, by data-i18n key (Spanish only; English stays in index.html)
  var HTML = {
    menu: '<span aria-hidden="true">&#9776;</span> Menú',
    about: "Instrucciones",
    feed: "Patrones de transición",
    legend: "Leyenda del mapa",
    feedTitle: "Patrones de transición",
    feedKey: '<span class="pmark">★</span> Sede del programa High Achievers',
    tabMS: "Escuela intermedia",
    tabHS: "Escuela secundaria",
    choose: "Elija una escuela",
    undo: "Deshacer",
    reset: "Empezar de nuevo",
    submit: "Enviar plan",
    reviewTitle: "Envíe su plan",
    nameLbl: "Nombre (opcional)",
    emailLbl: "Correo electrónico (opcional)",
    commentLbl: "Comentarios para el equipo de planificación (opcional)",
    back: "Volver al mapa",
    thanksTitle: "Gracias, su plan fue enviado",
    planIdIs: "El número de su plan es",
    mailOpen: "Su aplicación de correo debería abrirse con su plan, dirigido a",
    mailOpen2: ". Presione Enviar en su correo para enviarlo.",
    mailCut: "Si no se abrió, o el plan aparece cortado, su plan también se copió: péguelo en un correo para",
    copyPlan: "Copiar plan",
    mailAgain: "Abrir el correo otra vez",
    picsNote: "El correo tiene un enlace que abre su plan en el mapa.",
    another: "Hacer otro plan",
    welcomeTitle: "Le damos la bienvenida al Creador de Límites Comunitarios",
    welcomeBody:
      '<p>Este planificador usa los <b>límites de escuelas primarias de la Opción A</b> de la Sesión de Participación 3. Cada área sombreada del mapa es una zona de primaria de la Opción A. Los límites de primaria se quedan como están. Usted decide a qué escuela intermedia y a qué escuela secundaria asiste cada zona.</p>' +
      '<h3>Cómo hacer un plan</h3>' +
      '<ol>' +
      '<li>Elija la pestaña <b>Escuela intermedia</b> o <b>Escuela secundaria</b>.</li>' +
      '<li>Elija una escuela en el panel lateral y luego haga clic en las zonas del mapa para asignárselas. Haga doble clic en una zona para quitar la asignación.</li>' +
      '<li>Fíjese en la barra de cada escuela. Una barra llena significa que la escuela está a su capacidad máxima; la barra y el porcentaje se ponen rojos cuando la excede.</li>' +
      '<li>Use el menú del <b>Programa High Achievers</b> para elegir la escuela sede. Sus estudiantes cuentan para esa escuela.</li>' +
      '<li>Cuando todas las zonas tengan escuela intermedia y secundaria, seleccione <b>Enviar plan</b>.</li>' +
      '</ol>' +
      '<h3>Sobre la "escuela más cercana"</h3>' +
      '<p>El botón que asigna zonas a la escuela más cercana mide una línea recta desde el punto central de cada zona de primaria hasta cada escuela. No usa la distancia en carro ni dónde viven los estudiantes dentro de la zona, así que tómelo como un punto de partida y ajústelo.</p>' +
      '<h3>Sobre los números</h3>' +
      '<p>En el mapa, cada zona muestra sus <b>estudiantes de intermedia</b> (grados 6 a 8) en la pestaña Escuela intermedia y sus <b>estudiantes de secundaria</b> (grados 9 a 12) en la pestaña Escuela secundaria: los estudiantes que viven en esa zona de primaria. El total de cada escuela también incluye una cantidad fija de <b>estudiantes no residentes</b> que vienen de fuera de estas zonas. Siempre se quedan en su escuela en todos los planes, por eso las escuelas ya muestran algunos estudiantes antes de que usted asigne zonas. Aparecen como la parte gris de la barra de cada escuela. En Sequoyah HS, la cantidad de estudiantes no residentes es una estimación. Los estudiantes no residentes de Chamblee no incluyen a los estudiantes del programa magnet High Achievers, que cuentan para la escuela que usted elija en el menú del <b>Programa High Achievers</b>.</p>',
    getStarted: "Comenzar",
    cancel: "Cancelar",
    ucTitle: "Creador de Límites Comunitarios",
    ucTag: "En construcción",
    ucText: "Este planificador todavía no está abierto. Vuelva pronto."
  };

  function getLang() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    if (q === "es" || q === "en") return q;
    try { var s = localStorage.getItem("plannerLang"); if (s === "es" || s === "en") return s; } catch (e) {}
    return "en";
  }

  var I = window.PLANNER_I18N = { lang: getLang(), es: ES, html: HTML };

  window.T = function (text, vars) {
    var s = I.lang === "es" && ES[text] != null ? ES[text] : text;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  };

  // Swap the page's fixed text to the chosen language
  I.apply = function (root) {
    document.documentElement.lang = I.lang;
    (root || document).querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.dataset.en == null) el.dataset.en = el.innerHTML;
      var es = HTML[el.getAttribute("data-i18n")];
      el.innerHTML = I.lang === "es" && es != null ? es : el.dataset.en;
    });
    (root || document).querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", window.T(el.getAttribute("data-i18n-aria")));
    });
  };

  I.set = function (lang) {
    I.lang = lang === "es" ? "es" : "en";
    try { localStorage.setItem("plannerLang", I.lang); } catch (e) {}
    I.apply();
  };
})();
