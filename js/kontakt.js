// Kontaktformular: Versand an den H2-Verwalter (Cloudflare). Klappt das nicht,
// öffnet sich das Mailprogramm mit allen Angaben – und der Text steht zusätzlich zum Kopieren da.
(function () {
  var form = document.querySelector("form[name=kontakt]");
  if (!form || !window.fetch) return; // ohne JavaScript: normaler Formularversand

  var EMPFAENGER = "kontakt@h2insektenschutz.de";
  var knopf = form.querySelector("button[type=submit]");

  function text(daten) {
    return [
      "Name: " + daten.get("vorname") + " " + daten.get("nachname"),
      "E-Mail: " + daten.get("email"),
      "Telefon: " + daten.get("telefon"),
      daten.get("plz_ort") ? "PLZ & Ort: " + daten.get("plz_ort") : null,
      daten.get("anliegen") ? "Anliegen: " + daten.get("anliegen") : null,
      "",
      "Nachricht:",
      daten.get("nachricht"),
    ].filter(function (z) { return z !== null; }).join("\n");
  }

  function fallschirm(daten) {
    var inhalt = text(daten);
    var betreff = "Anfrage über die Website – " + daten.get("vorname") + " " + daten.get("nachname");
    var link = "mailto:" + EMPFAENGER + "?subject=" + encodeURIComponent(betreff) + "&body=" + encodeURIComponent(inhalt);

    var box = form.querySelector(".kontakt-fallschirm") || document.createElement("div");
    box.className = "kontakt-fallschirm";
    box.setAttribute("role", "alert");
    box.replaceChildren();
    var titel = document.createElement("p");
    titel.innerHTML = "<strong>Die Anfrage konnte gerade nicht gesendet werden.</strong> Ihr Mailprogramm öffnet sich mit allen Angaben – bitte dort nur noch auf „Senden“ tippen. Alternativ den Text kopieren und an " + EMPFAENGER + " schicken.";
    var feld = document.createElement("textarea");
    feld.readOnly = true;
    feld.rows = 8;
    feld.value = inhalt;
    var zeile = document.createElement("div");
    zeile.className = "kontakt-fallschirm-knoepfe";
    var mail = document.createElement("a");
    mail.className = "btn btn-primary";
    mail.href = link;
    mail.textContent = "E-Mail öffnen";
    var kopieren = document.createElement("button");
    kopieren.type = "button";
    kopieren.className = "btn btn-secondary";
    kopieren.textContent = "Text kopieren";
    kopieren.addEventListener("click", function () {
      feld.select();
      (navigator.clipboard ? navigator.clipboard.writeText(inhalt) : Promise.reject())
        .catch(function () { document.execCommand("copy"); })
        .then(function () { kopieren.textContent = "Kopiert ✓"; });
    });
    zeile.append(mail, kopieren);
    box.append(titel, feld, zeile);
    knopf.parentNode.after(box);
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    window.location.href = link;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!form.reportValidity()) return;
    var daten = new FormData(form);
    var beschriftung = knopf.textContent;
    knopf.disabled = true;
    knopf.textContent = "Wird gesendet …";

    var abbruch = new AbortController();
    var uhr = setTimeout(function () { abbruch.abort(); }, 15000);
    fetch(form.action, { method: "POST", body: daten, headers: { Accept: "application/json" }, signal: abbruch.signal })
      .then(function (antwort) {
        if (!antwort.ok) throw new Error("HTTP " + antwort.status);
        window.location.href = "danke.html";
      })
      .catch(function () { fallschirm(daten); })
      .finally(function () {
        clearTimeout(uhr);
        knopf.disabled = false;
        knopf.textContent = beschriftung;
      });
  });
})();
