import _ from 'lodash';
import {Plane, Transform} from "ogl";

import Gallery from "./Gallery.js";

export default class Index {
    constructor({gl, scene, sizes}) {
        this.gl = gl;
        this.sizes = sizes;

        this.createGroup(scene);

        this.createGeometry();
        this.createGalleries();

        this.show();
    }

    createGeometry() {
        this.geometry = new Plane(this.gl);
    }

    createGroup(scene) {
        this.group = new Transform();
        this.group.setParent(scene);
    }

    createGalleries() {
        this.galleriesElements = document.querySelectorAll('.about__gallery');

        this.galleries = _.map(this.galleriesElements, (galleryElement, index) => {
            return new Gallery({
                element: galleryElement,
                geometry: this.geometry,
                gl: this.gl,
                scene: this.group,
                sizes: this.sizes,
                index
            })
        });
    }

    show() {
        _.map(this.galleries, gallery => gallery?.show());
    }

    hide() {
        _.map(this.galleries, gallery => gallery?.hide());
    }

    /**
     * Events
     */
    onResize(event) {
        _.map(this.galleries, gallery => gallery?.onResize(event));
    }

    onTouchDown(event) {
        _.map(this.galleries, gallery => gallery?.onTouchDown(event));
    }

    onTouchMove(event) {
        _.map(this.galleries, gallery => gallery?.onTouchMove(event));
    }

    onTouchUp(event) {
        _.map(this.galleries, gallery => gallery?.onTouchUp(event));
    }

    onWheel({pixelX, pixelY}) {

    }

    /**
     * Loops
     */
    update(scroll) {
        _.map(this.galleries, gallery => gallery?.update(scroll));
    }

    /**
     * Destroy
     */
    destroy() {
        _.map(this.galleries, gallery => gallery?.destroy());
    }
}
