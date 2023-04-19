import * as itowns from 'itowns';
import * as widgets from 'itowns/widgets';

import { CustomWidget } from './widgets/CustomWidget';



// ---------- CREATE A GlobeView FOR SUPPORTING DATA VISUALIZATION : ----------

// Define camera initial position
const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 0.71667, 45.183331, 0),
    range: 4000,
    tilt: 30,
}

// `viewerDiv` will contain iTowns' rendering area (`<canvas>`)
const viewerDiv = document.getElementById('viewerDiv');

// Create a GlobeView
const view = new itowns.GlobeView(viewerDiv, placement);

const debugMenu = new GuiTools('menuDiv', view);


const foo = new CustomWidget(view);
foo.domElement.id = 'custom-widget';

// ---------- DISPLAY CONTEXTUAL DATA - ORTHO IMAGES AND DEM : ----------

itowns.Fetcher.json('./resources/layers/Ortho.json')
    .then((config) => {
        config.source = new itowns.WMTSSource(config.source);
        view.addLayer(
            new itowns.ColorLayer(config.id, config),
        ).then((l) => { foo.addLayer(l) });
        // ).then(debugMenu.addLayerGUI.bind(debugMenu));
    });

itowns.Fetcher.json('./resources/layers/IGN_MNT_HIGHRES.json')
    .then((config) => {
        config.source = new itowns.WMTSSource(config.source);
        view.addLayer(
            new itowns.ElevationLayer(config.id, config),
        ).then(debugMenu.addLayerGUI.bind(debugMenu));
    });



// ---------- DISPLAY 3D TILES DATA : ----------

let index = 0;

function add3dTilesLayer(url) {
    itowns.View.prototype.addLayer.call(
        view,
        new itowns.C3DTilesLayer(`Tile-${index}`, {
            name: 'Tile',
            source: new itowns.C3DTilesSource({ url }),
        }, view),
    );
    index++;
}

add3dTilesLayer('resources/dataset1/tileset.json');
// add3dTilesLayer('resources/dataset2/Tile_p020_p027/Tile_p020_p027.json');
// add3dTilesLayer('resources/dataset2/Tile_p020_p027/Tile_p020_p027_L19_00001.json');
// add3dTilesLayer('resources/dataset3/Production_PCRSonly.json');



// ---------- ADD SOME WIDGETS : ----------

const navigation = new widgets.Navigation(view, {
    position: 'bottom-right',
});




