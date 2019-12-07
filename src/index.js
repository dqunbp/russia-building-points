import "./styles.scss";
import {
  h,
  PALETES,
  pointSqrtCount,
  circlesLayout,
  circleOpacity,
  circleRadius,
  getHeatColors,
  heatmapIntensity,
  heatmapRadius,
  heatmapOpacity,
  Tokens
} from "./constants";
import { throttle } from "./utils";
import { setWindowHeight } from "./resize-observer";
import { setupModal } from "./modal";

setWindowHeight();
setupModal();

const isDevelopment = process.env.NODE_ENV === "development";

const sidebar = document.querySelector(".col.sidebar");
document.getElementById("burger").addEventListener("click", function() {
  if (sidebar.classList.contains("collapsed"))
    sidebar.classList.remove("collapsed");
  else sidebar.classList.add("collapsed");
});

mapboxgl.accessToken = isDevelopment ? Tokens.development : Tokens.production;
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  zoom: 2.33,
  center: [102, 60],
  minZoom: 2,
  hash: true
});

let layerList = document.getElementById("layers-menu");
let links = layerList.getElementsByTagName("a");

function getLabelsLayer() {
  let layers = map.getStyle().layers;
  let firstSymbolId = null;
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }
  return firstSymbolId;
}

const createLayersKeeper = (map, keepLayers = []) => {
  let layerIds = [],
    sourceIds = [],
    before = {};
  for (let l of keepLayers) {
    layerIds.push(l.id);
    sourceIds.push(l.source || l.id);
    if (l.before) before[l.id] = l.before;
  }
  const filterLayers = ({ id }) => layerIds.some(l => id.startsWith(l));
  const filterSources = id => sourceIds.some(s => id.startsWith(s));
  // const filterLayers = l => layerIds.indexOf(l.id) !== -1;
  // const filterSources = id => sourceIds.indexOf(id) !== -1;
  return (nextStyle, onStyleChanged) => {
    const currentStyle = map.getStyle();
    const dataLayers = currentStyle.layers.filter(filterLayers);
    const dataSources = Object.keys(currentStyle.sources)
      .filter(filterSources)
      .reduce(
        (acc, s) => ({
          ...acc,
          [s]: currentStyle.sources[s]
        }),
        {}
      );
    map.setStyle(nextStyle);

    map.once("styledata", () => {
      const style = map.getStyle();
      onStyleChanged(style);
      const layers = style.layers;
      const nextLayerIds = layers.map(({ id }) => id);
      Object.keys(dataSources).forEach(s => map.addSource(s, dataSources[s]));
      dataLayers.forEach(l => {
        const boforeIndex = nextLayerIds.indexOf(before[l.id]);
        map.addLayer(l, boforeIndex !== -1 ? before[l.id] : undefined);
        layers.splice(boforeIndex, 0);
      });
    });
  };
};

function loadSources() {
  map.addSource("gt-points", {
    type: "vector",
    url:
      "https://demo.geoalert.io/data/GT_cluster_densest_as_needed_max25K_features_max100Kbytes.json"
  });
  map.addSource("osm-points", {
    type: "vector",
    url:
      "https://demo.geoalert.io/data/OSM_cluster_densest_as_needed_max25K_features_max100Kbytes.json"
  });
}

const removeDelay = 150;
function loadHeat(
  before,
  id = "gt-heat",
  source = "gt-points",
  palette = PALETES.red1
) {
  map.addLayer(
    {
      id: id,
      type: "heatmap",
      source: source,
      "source-layer": "points",
      maxzoom: h,
      paint: {
        // Increase the heatmap weight based on frequency and property magnitude
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          pointSqrtCount,
          0,
          0,
          500,
          1
        ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        "heatmap-intensity": heatmapIntensity,
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        "heatmap-color": getHeatColors(palette),
        // Adjust the heatmap radius by zoom level
        "heatmap-radius": heatmapRadius,
        // Transition from heatmap to circle layer by zoom level
        "heatmap-opacity": 0
      }
    },
    before
  );
  map.setPaintProperty(id, "heatmap-opacity", heatmapOpacity);
  return () => {
    map.setPaintProperty(id, "heatmap-opacity", 0);
    setTimeout(() => map.removeLayer(id), removeDelay);
  };
}

function loadCircles(
  before,
  id = "gt-points",
  source = "gt-points",
  palette = PALETES.red1
) {
  map.addLayer(
    {
      id: id,
      type: "circle",
      source: source,
      "source-layer": "points",
      minzoom: 8,
      layout: circlesLayout,
      paint: {
        "circle-radius": circleRadius,
        "circle-color": "yellow", //palette[0],
        "circle-stroke-width": 1,
        "circle-stroke-color": palette[0],
        "circle-opacity": 0,
        "circle-stroke-opacity": 0
      }
    },
    before
  );
  map.setPaintProperty(id, "circle-stroke-opacity", circleOpacity);
  map.setPaintProperty(id, "circle-opacity", circleOpacity);
  return () => {
    map.setPaintProperty(id, "circle-opacity", 0);
    setTimeout(() => map.removeLayer(id), removeDelay);
  };
}

const mapPaletes = {
  gt: PALETES.l13,
  osm: PALETES.l13
};

map.on("load", function() {
  map.addControl(
    new mapboxgl.NavigationControl({ showCompass: false }),
    "bottom-right"
  );
  loadSources();

  // Find the index of the first symbol layer in the map style
  let firstSymbolId = getLabelsLayer();

  const setStyle = createLayersKeeper(map, [
    { id: "gt-", before: firstSymbolId },
    { id: "osm-", before: firstSymbolId }
  ]);
  function switchLayer(layer) {
    let layerId = layer.target.id;
    for (let l = 0; l < links.length; l++)
      links[l].classList.remove("is-active");
    layer.target.classList.add("is-active");
    setStyle("mapbox://styles/mapbox/" + layerId, () => {
      firstSymbolId = getLabelsLayer();
    });
  }

  for (let i = 0; i < links.length; i++) links[i].onclick = switchLayer;

  const toUnload = [];

  function eventFire(el, etype) {
    if (el.fireEvent) {
      el.fireEvent("on" + etype);
    } else {
      let evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  const unloadCurrent = () => {
    for (let i = 0; i <= toUnload.length; i++)
      if (toUnload.length > 0) setTimeout(toUnload.pop(), removeDelay);
  };

  const countButtons = document.querySelectorAll("nav");

  setTimeout(() => {
    // countButtons[0].click();
    eventFire(countButtons[0], "click");
  }, 100);

  function switchPointsLayer(e) {
    if (e.classList.contains("active")) return;
    let id = e.id;
    for (let l = 0; l < countButtons.length; l++)
      countButtons[l].classList.remove("active");
    unloadCurrent();
    const palette = mapPaletes[id];
    const unloadCircles = loadCircles(
      firstSymbolId,
      `${id}-points`,
      `${id}-points`,
      palette
    );
    const unloadHeat = loadHeat(
      firstSymbolId,
      `${id}-heat`,
      `${id}-points`,
      palette
    );
    toUnload.push(unloadCircles);
    toUnload.push(unloadHeat);
    e.classList.add("active");
  }

  const throttleSwitch = throttle(switchPointsLayer, 1000);

  for (let l = 0; l < countButtons.length; l++)
    countButtons[l].onclick = function() {
      throttleSwitch(countButtons[l]);
    };
});
