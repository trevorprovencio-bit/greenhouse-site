/* Greenhouse booking panel.
   Any element with data-book opens it:
     data-book=""               start (hair or tattoo)
     data-book="hair"           hair questions
     data-book="tattoo"         tattoo questions
     data-book="request:chuck"  tattoo request form with that artist picked
   The element's href stays as a fallback for when this script doesn't run. */
(function(){
  "use strict";

  /* ---- Settings: edit these ---------------------------------------------------- */
  var SHOP = { phone: "(828) 606-9873", sms: "sms:+18286069873", email: "info@greenhouseavl.com" };
  /* Where tattoo requests go. Paste a form endpoint that accepts JSON
     (for example a Formspree form URL like https://formspree.io/f/abcdwxyz).
     Left empty, the request opens in the visitor's email app, addressed to SHOP.email. */
  var REQUEST_ENDPOINT = "";
  var ARTISTS = {
    dre:      {name:"Dre Donoghue", short:"Dre", role:"Founder · stylist · educator", group:"hair", via:"Vagaro", url:"https://www.vagaro.com/dreatgreenhouse/book-now", needs:["cut"], img:"images/booking/dre.jpg", pos:"50% 22%"},
    caitlin:  {name:"Caitlin Cimino", short:"Caitlin", role:"Curl specialist", group:"hair", via:"Square", url:"https://daffodilcurls.square.site", needs:["curls","cut"], img:"images/booking/caitlin.jpg", pos:"50% 30%"},
    sam:      {name:"Sam Calderon Colon", short:"Sam", role:"Stylist & colorist", group:"hair", via:"Square", url:"https://sam-at-greenhouse.square.site/", needs:["color","cut"], img:"images/booking/sam.jpg", pos:"50% 30%"},
    marykate: {name:"Mary-Kate Hawn", short:"Mary-Kate", role:"Stylist & colorist", group:"hair", via:"Square", url:"https://marykatedoeshair.square.site", needs:["color","cut"]},
    valerie:  {name:"Valerie Esperanza", short:"Valerie", role:"Stylist & colorist", group:"hair", via:"GlossGenius", url:"https://valerieesperanza.glossgenius.com", needs:["color","cut"]},
    chuck:    {name:"Chuck Donoghue", short:"Chuck", role:"Founder & tattoo artist", group:"tattoo", request:true, img:"images/booking/chuck.jpg", pos:"50% 40%"},
    sky:      {name:"Bianca Sky Kreba", short:"Sky", role:"Tattoo artist", group:"tattoo", request:true, img:"images/booking/sky.jpg", pos:"50% 50%", alt:"Tattoo by Bianca Sky Kreba"},
    lauren:   {name:"Lauren Alexandra", short:"Lauren", role:"Tattoo artist", group:"tattoo", request:true, img:"images/booking/lauren.jpg", pos:"50% 50%", alt:"Tattoo by Lauren Alexandra"},
    floyd:    {name:"Floyd", short:"Floyd", role:"Tattoo artist", group:"tattoo", request:false, ig:"https://www.instagram.com/floydgoodfolk/", img:"images/booking/floyd.jpg", pos:"50% 50%", alt:"Tattoo by Floyd", note:"Books through Instagram messages."}
  };
  /* ------------------------------------------------------------------------------ */

  var NEED_TITLES = {cut:"Cut and style", color:"Color", curls:"Curly or textured hair", unsure:"All stylists"};
  var DAYS = ["Tue","Wed","Thu","Fri","Sat","Sun"];
  var ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  var dlg, lastFocus;

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function $(id){ return document.getElementById(id); }
  function toast(msg){
    var t = $("ghb-toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function(){ t.hidden = true; }, 2600);
  }
  function row(attrs, title, desc, go){
    return '<button '+attrs+'><span class="t">'+title+'</span><span class="d">'+desc+'</span><span class="go"><span>'+go+'</span>'+ARROW+'</span></button>';
  }

  function build(){
    var tattooOpts = Object.keys(ARTISTS).filter(function(k){ return ARTISTS[k].request; })
      .map(function(k){ return '<option value="'+k+'">'+esc(ARTISTS[k].name)+'</option>'; }).join("");
    var html =
    '<dialog class="ghb" id="ghb" aria-labelledby="ghb-crumb">'+
      '<div class="ghb-top"><span class="ghb-crumb" id="ghb-crumb">Book</span>'+
        '<button class="ghb-brand" type="button" data-go="v-start" aria-label="Start over"><img src="images/greenhouse-mark-vermilion.svg" alt=""></button>'+
        '<button class="ghb-close" type="button" id="ghb-close">Close <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>'+
      '<div class="ghb-body" id="ghb-body">'+

      '<section class="view" id="v-start">'+
        '<div class="intro"><h2>Book at Greenhouse</h2><p class="lead">Two quick questions and we’ll point you to the right person. Every artist keeps their own calendar.</p></div>'+
        '<div class="split">'+
          '<button type="button" data-go="v-hair"><img src="images/booking/dre.jpg" alt="Dre Donoghue in the salon" style="object-position:50% 25%"><span class="cap"><span class="label">Hair · upstairs</span><h3>Cuts, color and curls</h3><span class="btn">Book hair</span></span></button>'+
          '<button type="button" data-go="v-tattoo"><img src="images/booking/chuck.jpg" alt="Chuck Donoghue tattooing" style="object-position:50% 40%"><span class="cap"><span class="label">Tattoo · downstairs</span><h3>Traditional and custom</h3><span class="btn">Book a tattoo</span></span></button>'+
        '</div>'+
        '<div class="ask"><p class="small">Have a question first, or not sure who fits? Text the shop.</p><a class="btn out" href="'+SHOP.sms+'">Text '+esc(SHOP.phone)+'</a></div>'+
      '</section>'+

      '<section class="view" id="v-hair" hidden>'+
        '<button class="back" type="button" data-go="v-start">← Start over</button><h2>What are you after?</h2>'+
        '<div class="menu">'+
          row('type="button" data-need="cut"','Cut and style','Shape, layers, bangs or a fresh look.','See stylists')+
          row('type="button" data-need="color"','Color','Gloss, highlights, all-over color or a big change.','See stylists')+
          row('type="button" data-need="curls"','Curly or textured hair','Cuts and care for curls, coils and waves.','See stylists')+
          row('type="button" data-need="unsure"','Not sure yet','See every stylist and how they book.','See everyone')+
        '</div></section>'+

      '<section class="view" id="v-hair-results" hidden>'+
        '<button class="back" type="button" data-go="v-hair">← Back</button>'+
        '<div class="intro"><h2 id="ghb-hair-title">Stylists for you</h2><p class="small" id="ghb-hair-note"></p></div>'+
        '<div class="cards" id="ghb-hair-list"></div></section>'+

      '<section class="view" id="v-tattoo" hidden>'+
        '<button class="back" type="button" data-go="v-start">← Start over</button><h2>Do you have an idea in mind?</h2>'+
        '<div class="menu">'+
          row('type="button" data-go="v-form" data-intent="custom"','A custom piece','Tell us the idea and an artist will reply.','Send a request')+
          row('type="button" data-go="v-walkin"','Flash or a walk-in','Something small, today or soon.','How walk-ins work')+
          row('type="button" data-go="v-form" data-intent="unsure"','Not sure yet','Send a rough idea and we’ll help you shape it.','Send a request')+
          row('type="button" data-go="v-tattoo-artists"','I know who I want','Go straight to an artist.','See the artists')+
        '</div></section>'+

      '<section class="view" id="v-walkin" hidden>'+
        '<button class="back" type="button" data-go="v-tattoo">← Back</button>'+
        '<div class="intro"><h2>Walk-ins are welcome</h2><p class="lead">Appointments are preferred, so text ahead to check who’s in and what flash is available.</p></div>'+
        '<ol class="steps"><li><span class="n" aria-hidden="true">1</span><h3>Text first</h3><p>Text '+esc(SHOP.phone)+' and we’ll tell you who can fit you in.</p></li>'+
        '<li><span class="n" aria-hidden="true">2</span><h3>Pricing</h3><p>Each artist has their own hourly rate. Price depends on size and detail.</p></li>'+
        '<li><span class="n" aria-hidden="true">3</span><h3>Booking ahead</h3><p>A $100 deposit holds your spot and comes off the price of your tattoo.</p></li></ol>'+
        '<div class="row-btns"><a class="btn" href="'+SHOP.sms+'">Text the shop</a><button class="btn out" type="button" data-go="v-form" data-intent="custom">Send a request instead</button></div></section>'+

      '<section class="view" id="v-tattoo-artists" hidden>'+
        '<button class="back" type="button" data-go="v-tattoo">← Back</button>'+
        '<div class="intro"><h2>Tattoo artists</h2><p class="small">Send any of them a request. They’ll reply with next steps and a deposit link.</p></div>'+
        '<div class="cards" id="ghb-tattoo-list"></div></section>'+

      '<section class="view" id="v-form" hidden>'+
        '<button class="back" type="button" data-go="v-tattoo">← Back</button>'+
        '<div class="intro"><h2>Tattoo request</h2><p class="lead" id="ghb-form-lead"></p></div>'+
        '<form id="ghb-form" novalidate>'+
          '<div class="field"><label for="ghb-name">Your name</label><input id="ghb-name" name="name" type="text" autocomplete="name" required></div>'+
          '<div class="field"><label for="ghb-contact">Phone or email</label><input id="ghb-contact" name="contact" type="text" autocomplete="email" required><span class="hint">Where the artist should reply.</span></div>'+
          '<div class="field full"><label for="ghb-artist">Artist</label><select id="ghb-artist" name="artist"><option value="any">No preference</option>'+tattooOpts+'</select>'+
            '<span class="hint">Floyd books through Instagram messages, so he isn’t listed here.</span></div>'+
          '<div class="field full"><label for="ghb-idea">The idea</label><textarea id="ghb-idea" name="idea" required placeholder="Subject, style and anything that matters to you about it."></textarea></div>'+
          '<div class="field"><label for="ghb-placement">Placement</label><input id="ghb-placement" name="placement" type="text" placeholder="Forearm, calf, ribs…"></div>'+
          '<div class="field"><label for="ghb-size">Rough size</label><select id="ghb-size" name="size"><option value="">Choose one</option><option>Small, under 3 in</option><option>Medium, 3 to 6 in</option><option>Large, over 6 in</option><option>Half or full sleeve, back piece</option><option>Not sure</option></select></div>'+
          '<fieldset class="full"><legend>Color</legend><div class="opts">'+
            ['Color','Black and grey','Open to either'].map(function(c,i){ return '<label class="opt"><input type="radio" name="color" value="'+c+'" id="ghb-color-'+i+'"><span>'+c+'</span></label>'; }).join("")+
          '</div></fieldset>'+
          '<div class="field full"><label for="ghb-refs">Reference links</label><input id="ghb-refs" name="references" type="text" placeholder="Instagram posts, Pinterest boards, photos shared online"></div>'+
          '<fieldset class="full"><legend>Days that usually work</legend><div class="opts">'+
            DAYS.map(function(d,i){ return '<label class="opt"><input type="checkbox" name="days" value="'+d+'" id="ghb-day-'+i+'"><span>'+d+'</span></label>'; }).join("")+
          '</div></fieldset>'+
          '<label class="check full"><input type="checkbox" id="ghb-first" name="firstTattoo"> This would be my first tattoo</label>'+
          '<label class="check full"><input type="checkbox" id="ghb-age" required> I’m 18 or older</label>'+
          '<p class="err full" id="ghb-err" role="alert" hidden></p>'+
          '<div class="full"><button class="btn" type="submit" id="ghb-submit">Send request</button></div>'+
        '</form></section>'+

      '<section class="view" id="v-done" hidden>'+
        '<div class="intro"><h2 id="ghb-done-title">Request sent</h2><p class="lead" id="ghb-done-lead"></p></div>'+
        '<dl class="summary" id="ghb-done-summary"></dl>'+
        '<ol class="steps"><li><span class="n" aria-hidden="true">1</span><h3>The artist replies</h3><p>With questions, a price range and times that work.</p></li>'+
        '<li><span class="n" aria-hidden="true">2</span><h3>$100 deposit</h3><p>Holds your spot and comes off the price of your tattoo.</p></li>'+
        '<li><span class="n" aria-hidden="true">3</span><h3>24-hour changes</h3><p>Cancel at least a day ahead to get the deposit back.</p></li></ol>'+
        '<div class="row-btns"><button class="btn" type="button" id="ghb-done-close">Done</button><button class="btn out" type="button" data-go="v-start">Start over</button></div></section>'+

      '</div></dialog><div class="ghb-toast" id="ghb-toast" role="status" hidden></div>';
    document.body.insertAdjacentHTML("beforeend", html);
    dlg = $("ghb");

    dlg.addEventListener("click", onDialogClick);
    dlg.addEventListener("close", function(){ document.documentElement.classList.remove("ghb-open"); if (lastFocus && lastFocus.focus) lastFocus.focus(); });
    dlg.addEventListener("cancel", function(){ /* Esc closes; native */ });
    $("ghb-close").addEventListener("click", close);
    $("ghb-done-close").addEventListener("click", close);
    $("ghb-form").addEventListener("submit", onSubmit);
    dlg.querySelectorAll("[data-need]").forEach(function(b){ b.addEventListener("click", function(){ showHair(b.dataset.need); }); });
  }

  function show(id){
    dlg.querySelectorAll(".view").forEach(function(v){ v.hidden = (v.id !== id); });
    $("ghb-body").scrollTop = 0;
    var h = $(id).querySelector("h2"); if (h){ h.setAttribute("tabindex","-1"); h.focus({preventScroll:true}); }
  }
  function setIntent(intent){
    $("ghb-form-lead").textContent = intent === "unsure"
      ? "A rough idea is plenty. Describe what you’re drawn to and the artist will help you shape it."
      : "Tell us what you have in mind. The artist reads every request and replies with next steps and a deposit link.";
  }
  function onDialogClick(e){
    if (e.target === dlg){ close(); return; } /* backdrop */
    var b = e.target.closest("[data-go]"); if (!b) return;
    if (b.dataset.intent) setIntent(b.dataset.intent);
    if (b.dataset.artist) $("ghb-artist").value = b.dataset.artist;
    if (b.dataset.go === "v-tattoo-artists") renderTattooArtists();
    show(b.dataset.go);
  }

  function photo(a){
    return a.img ? '<img class="ph" src="'+esc(a.img)+'" alt="'+esc(a.alt || a.name)+'" loading="lazy" style="object-position:'+esc(a.pos || "50% 30%")+'">'
                 : '<div class="ph mono" role="img" aria-label="'+esc(a.name)+'"><span aria-hidden="true">'+esc(a.name[0])+'</span></div>';
  }
  function card(a, match, action){
    return '<article class="card">'+photo(a)+'<div style="display:flex;flex-direction:column;gap:6px">'+
      (match ? '<span class="match">Best match</span>' : '')+'<h4>'+esc(a.name)+'</h4><span class="role">'+esc(a.role)+'</span>'+
      (a.via ? '<span class="note">Books on '+esc(a.via)+'</span>' : '')+(a.note ? '<span class="note">'+esc(a.note)+'</span>' : '')+
      '</div>'+action+'</article>';
  }
  function showHair(need){
    var keys = Object.keys(ARTISTS).filter(function(k){ return ARTISTS[k].group === "hair"; });
    var best = need === "unsure" ? [] : keys.filter(function(k){ return ARTISTS[k].needs[0] === need; });
    var others = keys.filter(function(k){ return best.indexOf(k) < 0; });
    others.sort(function(a,c){ return (ARTISTS[c].needs.indexOf(need) >= 0) - (ARTISTS[a].needs.indexOf(need) >= 0); });
    $("ghb-hair-title").textContent = NEED_TITLES[need];
    $("ghb-hair-note").textContent = need === "unsure"
      ? "Not sure who fits? Text the shop at " + SHOP.phone + " and we’ll point you to someone."
      : "Matched by each stylist’s specialty. Everyone books on their own calendar.";
    function act(k){ var a = ARTISTS[k]; return '<a class="btn out" href="'+esc(a.url)+'" target="_blank" rel="noopener">Book with '+esc(a.short)+'</a>'; }
    $("ghb-hair-list").innerHTML = best.map(function(k){ return card(ARTISTS[k], true, act(k)); }).join("") +
      others.map(function(k){ return card(ARTISTS[k], false, act(k)); }).join("");
    show("v-hair-results");
  }
  function renderTattooArtists(){
    $("ghb-tattoo-list").innerHTML = Object.keys(ARTISTS).filter(function(k){ return ARTISTS[k].group === "tattoo"; }).map(function(k){
      var a = ARTISTS[k];
      var act = a.request ? '<button class="btn out" type="button" data-go="v-form" data-intent="custom" data-artist="'+k+'">Request '+esc(a.short)+'</button>'
                          : '<a class="btn out" href="'+esc(a.ig)+'" target="_blank" rel="noopener">Message on Instagram</a>';
      return card(a, false, act);
    }).join("");
  }

  function val(id){ return $(id).value.trim(); }
  function onSubmit(e){
    e.preventDefault();
    var missing = [];
    if (!val("ghb-name")) missing.push("your name");
    if (!val("ghb-contact")) missing.push("a phone number or email");
    if (!val("ghb-idea")) missing.push("the idea");
    if (!$("ghb-age").checked) missing.push("confirmation that you’re 18 or older");
    var err = $("ghb-err");
    if (missing.length){ err.textContent = "Add " + missing.join(", ").replace(/, ([^,]*)$/, " and $1") + " to send the request."; err.hidden = false; return; }
    err.hidden = true;
    var color = dlg.querySelector('input[name="color"]:checked');
    var artist = $("ghb-artist").value;
    var item = {
      name: val("ghb-name"), contact: val("ghb-contact"),
      artist: artist === "any" ? "No preference" : ARTISTS[artist].name,
      idea: val("ghb-idea"), placement: val("ghb-placement"), size: $("ghb-size").value,
      color: color ? color.value : "", references: val("ghb-refs"),
      days: Array.prototype.map.call(dlg.querySelectorAll('input[name="days"]:checked'), function(i){ return i.value; }).join(", "),
      firstTattoo: $("ghb-first").checked ? "Yes" : "No",
      sentFrom: location.href
    };
    var btn = $("ghb-submit");
    if (!REQUEST_ENDPOINT){ sendByEmail(item); return; }
    btn.disabled = true; btn.textContent = "Sending…";
    fetch(REQUEST_ENDPOINT, {method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"},
      body: JSON.stringify(Object.assign({_subject:"Tattoo request: " + item.name}, item))})
      .then(function(r){ if (!r.ok) throw new Error(r.status); done(item, true); })
      .catch(function(){
        err.textContent = "The request didn’t go through. Check your connection and send it again, or text " + SHOP.phone + ".";
        err.hidden = false;
      })
      .then(function(){ btn.disabled = false; btn.textContent = "Send request"; });
  }
  function lines(item){
    return [["Artist", item.artist], ["Idea", item.idea], ["Placement", item.placement || "Not given"], ["Size", item.size || "Not given"],
      ["Color", item.color || "Not given"], ["Days", item.days || "Not given"], ["References", item.references || "None"],
      ["First tattoo", item.firstTattoo], ["Reply to", item.contact]];
  }
  function sendByEmail(item){
    var body = "Name: " + item.name + "\n" + lines(item).map(function(p){ return p[0] + ": " + p[1]; }).join("\n");
    location.href = "mailto:" + SHOP.email + "?subject=" + encodeURIComponent("Tattoo request: " + item.name) + "&body=" + encodeURIComponent(body);
    done(item, false);
  }
  function done(item, sent){
    var who = item.artist === "No preference" ? "the first artist who’s a good fit" : item.artist;
    $("ghb-done-title").textContent = sent ? "Request sent" : "Almost there";
    $("ghb-done-lead").innerHTML = sent
      ? esc("Your request is with " + who + ". They’ll reply to " + item.contact + ".")
      : "Your email app should open with the request filled in. Press send and it goes to " + esc(who) + ". If it didn’t open, email these details to <a href=\"mailto:" + SHOP.email + "\">" + SHOP.email + "</a>.";
    $("ghb-done-summary").innerHTML = lines(item).map(function(p){ return "<dt>"+esc(p[0])+"</dt><dd>"+esc(p[1])+"</dd>"; }).join("");
    if (sent) $("ghb-form").reset();
    show("v-done");
  }

  function open(target){
    if (!dlg) build();
    lastFocus = document.activeElement;
    var t = target || "", view = "v-start";
    if (t === "hair") view = "v-hair";
    else if (t === "tattoo") view = "v-tattoo";
    else if (t.indexOf("request:") === 0){ var k = t.slice(8); if (ARTISTS[k] && ARTISTS[k].request) $("ghb-artist").value = k; setIntent("custom"); view = "v-form"; }
    document.documentElement.classList.add("ghb-open");
    if (!dlg.open) dlg.showModal();
    show(view);
  }
  function close(){ if (dlg && dlg.open) dlg.close(); }

  document.addEventListener("click", function(e){
    var a = e.target.closest("[data-book]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    if (typeof HTMLDialogElement !== "function") return; /* very old browsers follow the href */
    e.preventDefault();
    var menu = a.closest("details[open]"); if (menu) menu.removeAttribute("open");
    open(a.getAttribute("data-book"));
  });
  if (location.hash === "#book") document.addEventListener("DOMContentLoaded", function(){ open(""); });
  window.GreenhouseBooking = { open: open, close: close };
})();
