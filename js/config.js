export const APP_PATHS = {
  home: 'index.html',
  explore: 'pages/explore.html',
  skyViewer: 'pages/sky-viewer.html',
  science: 'pages/science-of-starlight.html',
  lifeCycles: 'pages/star-life-cycles.html',
  about: 'pages/about.html'
};

export const SKY_VIEWER_CONFIG = {
  scriptUrl: 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js',
  stylesheetUrl: 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.min.css',
  fallbackMessage: 'The live sky map could not be loaded. You can still browse object coordinates, read the science summary, and open a deep link again later.',
  options: {
    survey: 'P/DSS2/color',
    fov: 25,
    showReticle: true,
    showFullscreenControl: false,
    showLayersControl: false,
    showGotoControl: false,
    showShareControl: false,
    cooFrame: 'equatorial'
  },
  overlays: [
    { id: 'constellations', label: 'Constellation lines', key: 'showCooGrid' },
    { id: 'grid', label: 'Coordinate grid', key: 'showCooGrid' }
  ]
};

export const INTEGRATION_CONFIG = {
  wikipediaSummary: {
    enabled: true,
    endpoint: 'https://en.wikipedia.org/api/rest_v1/page/summary/'
  },
  futureApis: {
    simbad: {
      enabled: false,
      label: 'SIMBAD object metadata',
      endpoint: 'https://simbad.cds.unistra.fr/simbad/'
    },
    mast: {
      enabled: false,
      label: 'MAST archive imagery',
      endpoint: 'https://mast.stsci.edu/'
    },
    ads: {
      enabled: false,
      label: 'ADS literature references',
      endpoint: 'https://ui.adsabs.harvard.edu/'
    },
    ned: {
      enabled: false,
      label: 'NED extragalactic context',
      endpoint: 'https://ned.ipac.caltech.edu/'
    }
  }
};
