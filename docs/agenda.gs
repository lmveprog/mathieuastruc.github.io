// mathieuastruc.com/admin <-> google agenda
// a coller dans un projet sur script.google.com, puis :
// deployer > nouveau deploiement > application web
//   executer en tant que : moi
//   qui a acces : tout le monde
// copier l'url qui finit par /exec dans ADMIN_GAS_URL sur vercel,
// et la cle ci-dessous dans ADMIN_GAS_SECRET.

var SECRET = "COLLE_ICI_LA_MEME_CLE_QUE_ADMIN_GAS_SECRET";
var TZ = "Europe/Paris";

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function fmtEvent(ev, calName) {
  var allDay = ev.isAllDayEvent();
  return {
    id: ev.getId(),
    title: ev.getTitle(),
    allDay: allDay,
    start: allDay ? Utilities.formatDate(ev.getAllDayStartDate(), TZ, "yyyy-MM-dd") : ev.getStartTime().toISOString(),
    end: allDay ? Utilities.formatDate(ev.getAllDayEndDate(), TZ, "yyyy-MM-dd") : ev.getEndTime().toISOString(),
    location: ev.getLocation() || "",
    calendar: calName
  };
}

// lecture : tous les agendas coches dans google agenda, entre from et to (iso)
function doGet(e) {
  var p = e.parameter || {};
  if (p.key !== SECRET) return json({ error: "nope" });
  var from = new Date(p.from);
  var to = new Date(p.to);
  var out = [];
  CalendarApp.getAllCalendars().forEach(function (cal) {
    if (!cal.isSelected()) return;
    cal.getEvents(from, to).forEach(function (ev) {
      out.push(fmtEvent(ev, cal.getName()));
    });
  });
  return json({ events: out, defaultCalendar: CalendarApp.getDefaultCalendar().getName() });
}

// ecriture : creer / supprimer dans l'agenda principal
function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) {}
  if (body.key !== SECRET) return json({ error: "nope" });
  var cal = CalendarApp.getDefaultCalendar();

  if (body.action === "create") {
    if (!body.title) return json({ error: "titre manquant" });
    var opts = { location: body.location || "", description: body.description || "" };
    var ev;
    if (body.allDay) {
      var d = String(body.date).split("-");
      ev = cal.createAllDayEvent(body.title, new Date(Number(d[0]), Number(d[1]) - 1, Number(d[2])), opts);
    } else {
      ev = cal.createEvent(body.title, new Date(body.start), new Date(body.end), opts);
    }
    return json({ ok: true, event: fmtEvent(ev, cal.getName()) });
  }

  if (body.action === "delete") {
    var target = cal.getEventById(body.id);
    if (!target) return json({ error: "introuvable" });
    target.deleteEvent();
    return json({ ok: true });
  }

  return json({ error: "action inconnue" });
}
