import { Widget } from './../Widget.js';
import loadingScreenInnerHTML
    from './LoadingScreen.html'


const DEFAULT_OPTIONS = {
    hidingTimeout: 3000,
}


export class LoadingScreen extends Widget {
    #hidingTimeout;

    constructor(view, options = {}) {
        super(view, options);
        this.#hidingTimeout = options.hidingTimeout
            || DEFAULT_OPTIONS.hidingTimeout;

        this.domElement.innerHTML = loadingScreenInnerHTML;

        if (options.noStyle !== true) {
            const style = require('./LoadingScreen.css');
            this.domElement.classList.add('loading-screen-widget');
        }
    }

    hideOn(eventDispatcher, event) {
        const onHide = () => {
            this.domElement.classList.add('hidden');

            this.domElement.addEventListener('transitionend', () => {
                this.parentElement.removeChild(this.domElement);
            });

            eventDispatcher.removeEventListener(event, onHide);
        };

        eventDispatcher.addEventListener(event, onHide);
        setTimeout(onHide, this.#hidingTimeout);
    }
}

