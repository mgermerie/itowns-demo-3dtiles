export class Widget {
    constructor(view, options = {}) {
        this.parentElement = options.parentElement || view.domElement;

        this.domElement = document.createElement('div');
        this.parentElement.appendChild(this.domElement);

        this.domElement.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
        });
        this.domElement.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    }
}
