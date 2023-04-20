import * as itowns from 'itowns';
import * as three from 'three';
import * as widgets from 'itowns/widgets';
import { C3DTilesBboxLayer } from './utils/C3DTilesBboxLayer';
import { LayerOptionsWidget } from './widgets/LayerOptions/LayerOptions.js';
import { LoadingScreen } from './widgets/LoadingScreen/LoadingScreen.js';
import { processUrl } from './utils/Source';
import foldButton from './template-fold-button.html';



// ---------- CREATE A GlobeView FOR SUPPORTING DATA VISUALIZATION : ----------

const view = new itowns.GlobeView(
    document.getElementById('viewerDiv'),
    {
        coord: new itowns.Coordinates('EPSG:4326', 0.71667, 45.183331, 0),
        range: 4000,
        tilt: 30,
    },
);
view.mainLoop.gfxEngine.renderer.outputEncoding = three.sRGBEncoding;



// ---------- ADD SOME WIDGETS : ----------

// Navigation widget
const navigation = new widgets.Navigation(view, {
    position: 'bottom-right',
});

// Loading screen widget
const loadingScreen = new LoadingScreen(view);
loadingScreen.hideOn(view, itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED);

// Layer options widget
const layerOptions = new LayerOptionsWidget(view);
layerOptions.addLayer(view.tileLayer, { wireframe: false, });

// Customize layer options widget
layerOptions.domElement.insertBefore(
    Object.assign(
        Object.assign(
            document.createElement('div'),
            { innerHTML: foldButton },
        ).querySelector('#folder'),
        { onclick: () => {
            layerOptions.domElement.classList.toggle('folded');
        } },
    ),
    layerOptions.domElement.firstChild,
);



// ---------- DISPLAY CONTEXTUAL DATA - ORTHO IMAGES AND DEM : ----------

itowns.Fetcher.json('./resources/layers/Ortho.json')
    .then((config) => {
        config.source = new itowns.WMTSSource(config.source);
        view.addLayer(
            new itowns.ColorLayer(config.id, config),
        );
    });

itowns.Fetcher.json('./resources/layers/IGN_MNT_HIGHRES.json')
    .then((config) => {
        config.source = new itowns.WMTSSource(config.source);
        view.addLayer(
            new itowns.ElevationLayer(config.id, config),
        );
    });



// ---------- DISPLAY 3D TILES DATA : ----------

let index = 0;

function add3dTilesLayer(url, options = {}) {
    index++;

    options.source = new itowns.C3DTilesSource({ url });

    itowns.View.prototype.addLayer.call(
        view,
        new itowns.C3DTilesLayer(
            options.name || `Tile-${index}`,
            options,
            view
        ),
    ).then((layer) => {
        itowns.View.prototype.addLayer.call(
            view,
            new C3DTilesBboxLayer(layer),
            layer,
        );

        layerOptions.addLayer(layer);
    });
}

const datasetUrl = new URLSearchParams(window.location.search).get('dataset');
if (datasetUrl) {
    processUrl(datasetUrl).then((datasetArray) => {
        datasetArray.forEach((dataset) => {
            add3dTilesLayer(dataset.url, dataset.options);
        });
    });
}

