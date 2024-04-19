import _ from 'lodash';
import {Plane, Transform} from "ogl";
import Prefix from 'prefix';

import Media from "./Media.js";
import {lerp} from "../../../utils/math.js";
import GSAP from "gsap";

export default class Collections {
    constructor({gl, scene, sizes}) {
        this.gl = gl;
        this.sizes = sizes;
        this.scene = scene;

        this.transformPrefix = Prefix('transform');

        this.titleElements = document.querySelector('.collections__titles');
        this.galleryElement = document.querySelector('.collections__gallery');
        this.galleryElementWrapper = document.querySelector('.collections__gallery__wrapper');
        this.collectionElements = document.querySelectorAll('.collections__article');
        this.mediaElements = document.querySelectorAll('.collections__gallery__media');

        this.scroll = {
            current: 0,
            target: 0,
            start: 0,
            velocity: 1,
            direction: 'left',
            limit: 0,
            lerp: 0.1,
        }

        this.createGroup(scene);
        this.createGeometry();
        this.createGallery();

        this.show();
    }

    createGeometry() {
        this.geometry = new Plane(this.gl);
    }

    createGroup(scene) {
        this.group = new Transform();
        this.group.setParent(scene);
    }

    createGallery() {
        this.medias = _.map(this.mediaElements, (media, index) => {
            return new Media({
                element: media,
                geometry: this.geometry,
                gl: this.gl,
                scene: this.group,
                sizes: this.sizes,
                index
            })
        });
    }

    /**
     * Animations
     */

    show() {
        _.map(this.medias, media => media?.show());
    }

    hide() {
        _.map(this.medias, media => media?.hide());
    }


    /**
     * Changes
     */
    onChange(index) {
        this.index = index;

        const selectedCollection = this.mediaElements[index]?.getAttribute('data-index');

        _.map(this.collectionElements, (collection, index) => {
            if (index === +selectedCollection) {
                collection.classList.add('collections__article--active');
            } else {
                collection.classList.remove('collections__article--active');
            }
        });

        this.titleElements.style[this.transformPrefix] = `translate(-50%,  ${selectedCollection * 100}%) rotate(-90deg)`;
    }

    /**
     * Events
     */
    onResize(event) {
        if (!this.galleryElementWrapper) return;

        this.sizes = event.sizes;

        this.bounds = this.galleryElementWrapper.getBoundingClientRect();

        this.scroll.current = this.scroll.target = 0;
        this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth;

        _.map(this.medias, media => media?.onResize(event));
    }

    onTouchDown({x, y}) {
        this.scroll.start = this.scroll.current;
    }

    onTouchMove({x, y}) {
        const distance = x.end - x.start;

        this.scroll.target = this.scroll.start + distance;
    }

    onTouchUp({x, y}) {

    }

    onWheel({pixelX}) {
        this.scroll.target -= pixelX;
    }

    /**
     * Loops
     */
    update() {
        if (!this.bounds) return;

        this.scroll.target = GSAP.utils.clamp(-this.scroll.limit, 0, this.scroll.target);

        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.lerp);

        this.galleryElement.style[this.transformPrefix] = `translateX(${this.scroll.current}px)`;

        if (this.scroll.current < this.scroll.target) {
            this.scroll.direction = 'right'
        } else if (this.scroll.current > this.scroll.target) {
            this.scroll.direction = 'left'
        }

        _.map(this.medias, (media, index) => {
            media.update(this.scroll)
        })

        const index = Math.floor(Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length);

        if (index !== this.index) {
            this.onChange(index)
        }
    }

    /**
     * Destroy
     */
    destroy() {
        this.scene.removeChild(this.group);
    }
}
