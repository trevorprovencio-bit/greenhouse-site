/* Contact, guest-spot and newsletter forms.
   There is no form backend yet, so each form opens the visitor's email app with the message filled in,
   addressed to the shop. Point FORM_ENDPOINT at a JSON form service (for example Formspree) to post instead. */
(function(){
  "use strict";
  var SHOP_EMAIL = "info@greenhouseavl.com";
  var FORM_ENDPOINT = "";
  var KINDS = {
    contact: { subject: function(v){ return v.Subject || ("Message from " + (v["First name"] || "the website")); }, need: ["Email", "Message"] },
    guest:   { subject: function(v){ return "Guest spot: " + ([v["First name"], v["Last name"]].filter(Boolean).join(" ") || "new artist"); }, need: ["Email", "Who you are and what you have in mind"] },
    news:    { subject: function(){ return "Add me to the Greenhouse list"; }, need: ["Email"] }
  };
  function labelFor(el){
    var l = el.id && document.querySelector('label[for="' + el.id + '"]');
    var t = l ? l.textContent : (el.getAttribute("aria-label") || el.name || "");
    t = t.trim().toLowerCase(); return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function status(form, msg, isError){
    var s = form.querySelector(".gh-form-status");
    if (!s){ s = document.createElement("p"); s.className = "gh-form-status"; s.setAttribute("role", isError ? "alert" : "status"); form.appendChild(s); }
    s.setAttribute("role", isError ? "alert" : "status");
    s.classList.toggle("is-error", !!isError); s.innerHTML = msg;
  }
  document.querySelectorAll("form[data-form]").forEach(function(form){
    var kind = KINDS[form.getAttribute("data-form")]; if (!kind) return;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var v = {}, fields = form.querySelectorAll("input, textarea, select"), firstBad = null, missing = [];
      fields.forEach(function(f){ if (f.type === "submit") return; f.removeAttribute("aria-invalid"); v[labelFor(f)] = f.value.trim(); });
      fields.forEach(function(f){
        var k = labelFor(f), bad = false;
        if (kind.need.indexOf(k) >= 0 && !f.value.trim()) bad = true;
        if (f.type === "email" && f.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim())) bad = true;
        if (bad){ f.setAttribute("aria-invalid", "true"); missing.push(k.toLowerCase()); if (!firstBad) firstBad = f; }
      });
      if (firstBad){ status(form, "Check " + missing.join(" and ") + ", then send again.", true); firstBad.focus(); return; }
      var subject = kind.subject(v);
      var body = Object.keys(v).filter(function(k){ return v[k]; }).map(function(k){ return k + ": " + v[k]; }).join("\n");
      if (FORM_ENDPOINT){
        var btn = form.querySelector('[type="submit"]'); if (btn){ btn.disabled = true; }
        fetch(FORM_ENDPOINT, {method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"}, body: JSON.stringify(Object.assign({_subject: subject}, v))})
          .then(function(r){ if (!r.ok) throw 0; form.reset(); status(form, "Thanks, it’s sent. We’ll write back soon."); })
          .catch(function(){ status(form, "That didn’t go through. Try again, or text (828) 606-9873.", true); })
          .then(function(){ if (btn) btn.disabled = false; });
        return;
      }
      location.href = "mailto:" + SHOP_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status(form, "Your email app should open with this filled in. Press send and it reaches us. If nothing opened, write to <a href=\"mailto:" + SHOP_EMAIL + "\">" + SHOP_EMAIL + "</a>.");
    });
  });
})();
