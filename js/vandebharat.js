const w = 9372;
const h = 9959;

window.addEventListener("load", () => {
  const mapContainer = document.getElementById('map');

  function resizeMapContainer() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (viewportWidth <= 768) {
      // Mobile: limit height so it fits screen
      const height = Math.min(viewportWidth * h / w, viewportHeight * 0.9); 
      mapContainer.style.height = `${height}px`;
    } else {
      // Desktop: maintain aspect ratio based on width
      mapContainer.style.height = `${mapContainer.clientWidth * h / w}px`;
    }
  }

  resizeMapContainer();

  const map = L.map('map', {
    crs: L.CRS.Simple,
    attributionControl: false,
    minZoom: -5,
    wheelPxPerZoomLevel: 40,
    zoomControl: false
  });

  const bounds = [[0, 0], [h, w]];
  L.imageOverlay('images/indian_railways/vandebharat300dpi.png', bounds).addTo(map);

  map.fitBounds(bounds);
  const fitZoom = map.getBoundsZoom(bounds, true);
  map.setMinZoom(fitZoom);
  map.setMaxZoom(fitZoom + 4);
  map.setMaxBounds(bounds);
  map.options.maxBoundsViscosity = 1.0;
  L.control.zoom({ position: 'topright' }).addTo(map);

  // Recalculate container height and map zoom on resize/orientation
  window.addEventListener("resize", () => {
    resizeMapContainer();
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(bounds);
    }, 100); // small delay to let CSS apply
  });
});


