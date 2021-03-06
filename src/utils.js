import { PALETES, HEATMAP_ZERO, HEATMAP_SHADES } from "./constants";

export const zip = (...arrays) => {
  const maxLength = Math.max(...arrays.map(x => x.length));
  return Array.from({ length: maxLength }).map((_, i) => {
    return Array.from({ length: arrays.length }, (_, k) => arrays[k][i]);
  });
};

export function buildHeatmapDencity(palete = PALETES.red1, reverse = false) {
  const result = HEATMAP_ZERO.concat(
    zip(HEATMAP_SHADES, reverse ? palete.slice().reverse() : palete)
  );
  return result.flat();
}

export const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const throttle = (fn, wait) => {
  let inThrottle, lastFn, lastTime;
  return function() {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function() {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

export function removeLabels(map) {
  return map.style.stylesheet.layers.reduce(function(removed, layer) {
    if (layer.type === "symbol") map.removeLayer(layer.id);
    return [...removed, layer.id];
  }, []);
}

export function createInteractionsSwitcher(map, interactions = "all") {
  const allInteractions = [
    "scrollZoom",
    "boxZoom",
    "dragRotate",
    "dragPan",
    "keyboard",
    "doubleClickZoom",
    "touchZoomRotate"
  ];
  const handlers = interactions === "all" ? allInteractions : interactions;
  return function(enable) {
    const operation = enable ? "enable" : "disable";
    handlers.forEach(h => map[h][operation]());
  };
}
