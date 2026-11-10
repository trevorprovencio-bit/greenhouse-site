/* First-screen appear for the homepage (styles in css/site.css, "First-screen appear").
   The page's head adds html.gh-intro before first paint, so the first screen opens plain.
   This script waits for the fonts (at most 0.6s), splits the headline into its real lines so they can
   appear one after another, starts the appear, and when it has landed puts the headline back as plain
   text and hands every element back to its normal styles. It plays once, on load, never on scroll. */
(function () {
  "use strict";
  var root = document.documentElement;
  if (!root.classList.contains("gh-intro")) return;

  var LINE_STEP = 60;   // ms between headline lines
  var LANDED = 1600;    // ms after the start when everything has landed (last item 0.45s + 1s)

  // Split the headline into one span per line it actually wraps to, at this width and in the loaded font
  function splitLines(h) {
    var text = h.textContent.replace(/\s+/g, " ").trim();
    var original = h.innerHTML;
    var words = text.split(" ");
    h.textContent = "";
    var spans = words.map(function (w, i) {
      var s = document.createElement("span");
      s.textContent = w;
      h.appendChild(s);
      if (i < words.length - 1) h.appendChild(document.createTextNode(" "));
      return s;
    });
    var lines = [], top = null;
    spans.forEach(function (s) {
      var t = s.offsetTop;
      if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; }
      lines[lines.length - 1].push(s.textContent);
    });
    var start = parseInt(h.style.getPropertyValue("--d"), 10) || 0;
    h.textContent = "";
    lines.forEach(function (words, i) {
      var line = document.createElement("span");
      line.className = "gh-line";
      line.setAttribute("data-appear", "up");
      line.style.setProperty("--d", (start + i * LINE_STEP) + "ms");
      line.textContent = words.join(" ");
      h.appendChild(line);
    });
    h.removeAttribute("data-appear");   // the lines appear instead of the whole headline
    return function restore() { h.innerHTML = original; h.setAttribute("data-appear", "up"); };
  }

  function go() {
    if (root.classList.contains("gh-intro-go")) return;   // the head's backup already started it
    var restores = [];
    document.querySelectorAll("[data-appear-lines]").forEach(function (h) { restores.push(splitLines(h)); });
    root.classList.add("gh-intro-go");
    setTimeout(function () {
      root.classList.add("gh-intro-done");
      restores.forEach(function (r) { r(); });            // plain text again, so it re-wraps on resize
    }, LANDED);
  }

  var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise(function (r) { setTimeout(r, 600); })]).then(go, go);
})();
