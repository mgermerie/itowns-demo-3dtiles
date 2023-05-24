import { Widget } from './../Widget';
import layerDomElementInnerHTML
    from './LayerOptions.html';


const eventTrigger = new Map([
    ['checkbox', 'onclick'],
    ['range', 'oninput'],
]);


const eventValue = new Map([
    ['checkbox', 'checked'],
    ['range', 'value'],
]);


export class LayerOptionsWidget extends Widget {
    #view;
    #layers = [];
    #template = document.createElement('div');

    constructor(view, options = {}) {
        super(view, options);
        this.#view = view;

        this.#template.innerHTML = layerDomElementInnerHTML;

        if (options.noStyle !== true) {
            const style = require('./LayerOptions.css');
            this.domElement.classList.add('layer-options-widget');
        }
    }

    #getElement(value) {
        return this.#template.querySelector(`*[element=${value}]`);
    }

    addLayer(layer, options = {}) {
        this.#layers.push(layer);

        const layerDom = document.createElement('div');
        this.domElement.appendChild(layerDom);

        const layerDomName = this.#getElement('layer-name')?.cloneNode(true);
        layerDomName.innerHTML = `${layer.name || layer.id}`;
        layerDom.appendChild(layerDomName);

        if (layer.isTiledGeometryLayer) {
            this.#addVisibilityToggle(layerDom, layer, options.visibility);
            this.#addWireframeToggle(layerDom, layer, options.wireframe);
        } else if (layer.isColorLayer) {
            this.#addVisibilityToggle(layerDom, layer, options.visibility);
            this.#addOpacitySlider(layerDom, layer, options.opacity);
        } else if (layer.isC3DTilesLayer) {
            this.#addVisibilityToggle(layerDom, layer, options.visibility);
            this.#addOpacitySlider(layerDom, layer, options.opacity);
            this.#addWireframeToggle(layerDom, layer, options.wireframe);
            this.#addSSEThresholdSlider(layerDom, layer, options.sseThreshold);

            // Bounding boxes and wireframe toggle
            const obbLayer = layer.attachedLayers
                .filter(l => l.id === `${layer.id}-obb`)[0];
            if (obbLayer) {
                layerDom.appendChild(this.#bindLayerInput(
                    this.#getElement('bounding-boxes'),
                    (value) => {
                        obbLayer.visible = value;
                        this.#view.notifyChange(obbLayer);
                    },
                ));
            }
        }
    }

    #bindLayerInput(inputContainer, callback) {
        const domElement = inputContainer?.cloneNode(true);
        const input = domElement.querySelector('input');
        input[eventTrigger.get(input.type)] = (event) => {
            callback(event.target[eventValue.get(input.type)]);
        }
        return domElement;
    }

    #addVisibilityToggle(parentDomElement, layer, enabled = true) {
        if (!enabled) { return; }

        parentDomElement.appendChild(this.#bindLayerInput(
            this.#getElement('visibility'),
            (value) => {
                layer.visible = value;
                this.#view.notifyChange(layer);
            },
        ));
    }

    #addOpacitySlider(parentDomElement, layer, enabled = true) {
        if (!enabled) { return; }

        parentDomElement.appendChild(this.#bindLayerInput(
            this.#getElement('opacity'),
            (value) => {
                layer.opacity = value;
                this.#view.notifyChange(layer);
            },
        ));
    }

    #addWireframeToggle(parentDomElement, layer, enabled = true) {
        if (!enabled) { return; }

        parentDomElement.appendChild(this.#bindLayerInput(
            this.#getElement('wireframe'),
            (value) => {
                layer.wireframe = value;
                this.#view.notifyChange(layer);
            },
        ));
    }

    #addSSEThresholdSlider(parentDomElement, layer, enabled = true) {
        if (!enabled) { return; }
        // TODO : is this check realy necessary ?
        if (layer.sseThreshold === undefined) { return; }

        // Initialize slider value from layer property
        const sseThresholdSlider = this.#getElement('sse-threshold');
        sseThresholdSlider.querySelector('input').value = layer.sseThreshold;

        parentDomElement.appendChild(this.#bindLayerInput(
            this.#getElement('sse-threshold'),
            (value) => {
                layer.sseThreshold = value;
                this.#view.notifyChange(this.#view.camera.camera3D);
            },
        ));
    }
}

