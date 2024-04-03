import _ from 'lodash';
import {Plane, Transform} from "ogl";
import GSAP from "gsap";

import Media from "./Media.js";
import {lerp} from "../../../utils/math.js";

export default class Index {
    constructor({gl, scene, sizes}) {
        this.gl = gl;
        this.sizes = sizes;
        this.scene = scene;

        this.galleryElement = document.querySelector('.home__gallery');
        this.mediaElements = document.querySelectorAll('.home__gallery__media__image');

        this.x = {
            current: 0,
            target: 0,
            lerp: 0.1,
        }

        this.y = {
            current: 0,
            target: 0,
            lerp: 0.1,
        }

        this.scroll = {
            x: 0,
            y: 0
        }

        this.scrollCurrent = {
            x: 0,
            y: 0
        };

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

    show() {
        _.map(this.medias, media => media?.show());
    }

    hide() {
        _.map(this.medias, media => media?.hide());
    }

    /**
     * Events
     */
    onResize(event) {
        if (!this.galleryElement) return;

        this.sizes = event.sizes;

        this.galleryBounds = this.galleryElement.getBoundingClientRect();

        this.gallerySizes = {
            width: (this.galleryBounds?.width) / window.innerWidth * this.sizes.width,
            height: (this.galleryBounds.height) / window.innerHeight * this.sizes.height
        };

        this.scroll.x = this.x.target = 0;
        this.scroll.y = this.y.target = 0;

        _.map(this.medias, media => media?.onResize(event));
    }

    onTouchDown({x, y}) {
        this.scrollCurrent.x = this.scroll.x;
        this.scrollCurrent.y = this.scroll.y;
    }

    onTouchMove({x, y}) {
        const xDistance = x.end - x.start;
        const yDistance = y.end - y.start;

        this.x.target = this.scrollCurrent.x + xDistance;
        this.y.target = this.scrollCurrent.y + yDistance;
    }

    onTouchUp({x, y}) {

    }

    onWheel({pixelX, pixelY}) {
        this.x.target -= pixelX;
        this.y.target -= pixelY;
    }

    /**
     * Loops
     */
    update() {
        if (!this.galleryBounds) return;

        this.x.current = lerp(this.x.current, this.x.target, this.x.lerp);
        this.y.current = lerp(this.y.current, this.y.target, this.y.lerp);

        if (this.scroll.x < this.x.current) {
            this.x.direction = 'right'
        } else if (this.scroll.x > this.x.current) {
            this.x.direction = 'left'
        }

        if (this.scroll.y < this.y.current) {
            this.y.direction = 'down'
        } else if (this.scroll.y > this.y.current) {
            this.y.direction = 'up'
        }


        this.scroll.x = this.x.current;
        this.scroll.y = this.y.current;

        _.map(this.medias, (media, index) => {
            const scaleX = media.mesh.scale.x / 2;

            if (this.x.direction === 'left') {
                const x = media.mesh.position.x + scaleX;

                if (x < -this.sizes.width / 2) {
                    media.extra.x += this.gallerySizes.width;

                    media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
                }
            } else if (this.x.direction === 'right') {
                const x = media.mesh.position.x - scaleX;

                if (x > this.sizes.width / 2) {
                    media.extra.x -= this.gallerySizes.width;

                    media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
                }
            }

            const scaleY = media.mesh.scale.y / 2;

            if (this.y.direction === 'up') {
                const y = media.mesh.position.y - scaleY;

                if (y > this.sizes.height / 2) {
                    media.extra.y -= this.gallerySizes.height;

                    media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
                }
            } else if (this.y.direction === 'down') {
                const y = media.mesh.position.y + scaleY;

                if (y < -this.sizes.height / 2) {
                    media.extra.y += this.gallerySizes.height;

                    media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
                }
            }

            media.update(this.scroll)
        })
    }

    /**
     * Destroy
     */
    destroy() {
        this.scene.removeChild(this.group);
    }
}
