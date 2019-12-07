import { buildHeatmapDencity } from "./utils";

export const PALETES = {
  red1: ["#FFC940", "#E9A133", "#D27B27", "#B9541A", "#9E2B0E"],
  red2: ["#FFE39F", "#EEB46C", "#D78742", "#BC5B22", "#9E2B0E"],
  purple: ["#FFEEC5", "#F1AEA4", "#D37387", "#A3416E", "#5C255C"],
  blue1: ["#FFE39F", "#ABC4A2", "#6B9FA1", "#3E769E", "#1F4B99"],
  blue2: ["#CFF3D2", "#8BCDBC", "#59A3AC", "#3878A1", "#1F4B99"],
  green1: ["#FFE39F", "#B2CB9A", "#6FB084", "#3B925D", "#1D7324"],
  green2: ["#E8F8B6", "#A4D8A8", "#68B78C", "#399561", "#1D7324"],
  magenta1: ["#D1E1FF", "#B4B4F2", "#918ADF", "#6565C5", "#1F4B99"],
  magenta2: ["#D1E1FF", "#B2ADED", "#927CCF", "#764EA2", "#5C255C"],
  pink: ["#E1BAE1", "#DD86AF", "#C35989", "#98366D", "#5C255C"],
  redBlue: [
    "rgb(103,169,207)",
    "rgb(209,229,240)",
    "rgb(253,219,199)",
    "rgb(239,138,98)",
    "rgb(178,24,43)"
  ],
  custom1: ["#3A405A", "#F9DEC9", "#99B2DD", "#E9AFA3", "#685044"],
  custom2: ["#A4303F", "#C8D6AF", "#FFECCC", "#F2D0A4", "#870058"],
  custom3: ["#41D3BD", "#EBF5EE", "#F0D3F7", "#407899", "#791E94"],
  custom4: ["#031D44", "#04395E", "#70A288", "#DAB785", "#D5896F"],
  custom5: ["#5B5F97", "#B8B8D1", "#FFFFFB", "#FFC145", "#FF6B6C"],
  d1: ["#1D7324", "#96BA61", "#FFFFFF", "#6CACB9", "#1F4B99"],
  d2: ["#1D7324", "#8BAE44", "#FFE39F", "#6B9FA1", "#1F4B99"],
  d3: ["#1F4B99", "#6CACB9", "#FFFFFF", "#DF9563", "#9E2B0E"],
  d4: ["#1F4B99", "#6B9FA1", "#FFE39F", "#D78742", "#9E2B0E"],
  n1: ["#FFD402", "#FFA81E", "#FFFFFB", "#945A96", "#791E94"],
  n2: ["#FFE157", "#FFB644", "#B57EB6", "#AD65AF", "#9044A5"],
  n3: ["#FFF517", "#FFE40F", "#FFF712", "#AE6654", "#9044A5"],
  n4: ["#FFE40F", "#FFE40F", "#FFF517", "#AD65AF", "#9044A5"],
  l1: ["#FAE26B", "#DC4942", "#EA5C33", "#A82D4A", "#4E136C"],
  l13: ["#FAE26B", "#DC4942", "#EA5C33", "#A82D4A", "#4E136C"],
  l2: [
    "rgba(253, 221, 111, 1)",
    "rgba(241, 135, 49, 1)",
    "rgba(102, 55, 123, 1)",
    "rgba(167, 44, 74, 1)",
    "rgba(116, 19, 98, 1)"
  ],
  l3: [
    "rgba(244, 233, 104, 1)",
    "rgba(173, 81, 101, 1)",
    "rgba(203, 56, 61, 1)",
    "rgba(102, 55, 123, 1)",
    "rgba(64, 30, 97, 1)"
  ]
};

export const HEATMAP_ZERO = [0, "rgba(33,102,172,0)"];
export const HEATMAP_SHADES = [0.2, 0.4, 0.6, 0.8, 1];

export const pointSqrtCount = [
  "case",
  ["has", "sqrt_point_count"],
  ["get", "sqrt_point_count"],
  1
];

export const circleOpacity = [
  "interpolate",
  ["linear"],
  ["zoom"],
  6,
  0.5,
  15,
  1
];
export const circleRadius = ["interpolate", ["linear"], ["zoom"], 10, 2, 22, 4];
export const circlesLayout = { "circle-sort-key": ["get", "sqrt_point_count"] };
export const circlesBlur = ["interpolate", ["linear"], ["zoom"], 0, 1, 15, 0.5];

export const getCircleColor = colorSteps => [
  "interpolate",
  ["linear"],
  pointSqrtCount,
  ...colorSteps
];

export const getHeatColors = palette => [
  "interpolate",
  ["linear"],
  ["heatmap-density"],
  ...buildHeatmapDencity(palette, true)
];

export const h = 9; // heatmapDissapearingZoom
export const heatmapIntensity = [
  "interpolate",
  ["linear"],
  ["zoom"],
  0,
  2,
  h,
  4
];

export const heatmapRadius = ["interpolate", ["linear"], ["zoom"], 0, 2, h, 20];
export const heatmapOpacity = ["interpolate", ["linear"], ["zoom"], 7, 1, h, 0];

export const Tokens = {
  development:
    "pk.eyJ1IjoiZHF1bmJwIiwiYSI6ImNqd3VuaGZyeTAwYTEzeW1oeHo3NHh1cnMifQ.AzNgwn8crwuAXGPmasjlzA",
  production:
    "pk.eyJ1IjoiZHF1bmJwIiwiYSI6ImNrM3U5bGJhazBhZmUza29wNHljdmZ4cDMifQ.2X-FQcNV7_P4ajnk6EDrcg"
};
