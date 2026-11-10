/* Split rollover photos (homepage; styles in css/site.css, "Split rollover").
   The haircut and tattoo tiles carry data-src, so phones and tablets never download them.
   On a device with a mouse or trackpad they load once the page has settled, or on the first
   point at a photo if that comes sooner. */
(function () {
  "use strict";
  var rolls = document.querySelectorAll(".gh-roll");
  if (!rolls.length || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    document.querySelectorAll(".gh-roll__grid img[data-src]").forEach(function (img) {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
  }
  rolls.forEach(function (r) { r.addEventListener("pointerenter", load, { once: true }); });
  if (document.readyState === "complete") setTimeout(load, 1500);
  else window.addEventListener("load", function () { setTimeout(load, 1500); }, { once: true });
})();
