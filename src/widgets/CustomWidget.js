import { Widget } from './Widget';
import layerDomElementInnerHTML from './templates/layerDomElementInnerHTML.html';


export class CustomWidget extends Widget {
    #view;
    #layers = [];

    constructor(view, options = {}) {
        super(view, options);
        this.#view = view;
    }

    addLayer(layer) {
        this.#layers.push(layer);

        if (layer.isColorLayer) {
            this.domElement.insertAdjacentHTML(
                'beforeend',
                layerDomElementInnerHTML,
            );

            document.getElementById('visibility').onclick = (event) => {
                layer.visible = event.target.checked;
                this.#view.notifyChange(layer);
            }

            document.getElementById('opacity').oninput = (event) => {
                layer.opacity = event.target.value;
                this.#view.notifyChange(layer);
            }
        } else if (layer.isElevationLayer) {
            // do
        } else if (layer.isC3DTilesLayre) {
            // do
        }
    }
}

