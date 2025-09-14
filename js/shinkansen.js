const w = 1200; // image width in pixels
const h = 1600; // image height in pixels

window.addEventListener("load", () => {
  const mapEl = document.getElementById("map");

  // Keep map container in correct aspect ratio
  function sizeMap() {
    const elWidth = mapEl.clientWidth || window.innerWidth;
    const targetHeight = Math.min(elWidth * h / w, window.innerHeight * 0.9);
    mapEl.style.height = `${targetHeight}px`;
  }

  sizeMap();

  const map = L.map("map", {
    crs: L.CRS.Simple,
    attributionControl: false,
    zoomControl: false,
    zoomSnap: 0.25, // allow fractional zoom
  });

  const bounds = [[0, 0], [h, w]];
  L.imageOverlay("images/hsr/shinkansen300dpi.png", bounds).addTo(map);

  function refit() {
    map.invalidateSize();

    // calculate scale needed to fit image
    const mapSize = map.getSize();
    const scaleX = mapSize.x / w;
    const scaleY = mapSize.y / h;

    // === Soft margin tweak ===
    const marginFactor = 0.95; // smaller = more border, larger = less
    const scale = Math.min(scaleX, scaleY) * marginFactor;

    // convert scale to Leaflet zoom (CRS.Simple = log2 scale)
    const fitZ = Math.log2(scale);

    // lock zoom so you can't zoom out smaller than fit
    map.setMinZoom(fitZ);
    map.setMaxZoom(fitZ + 4);

    map.setMaxBounds(bounds);
    map.options.maxBoundsViscosity = 1.0;

    // center image at exact fit zoom
    map.setView([h / 2, w / 2], fitZ);
  }

  refit();

  L.control.zoom({ position: "topright" }).addTo(map);

  window.addEventListener("resize", () => {
    sizeMap();
    requestAnimationFrame(refit);
  });
});
