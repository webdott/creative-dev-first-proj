import Media from "./Media.js";
import _ from "lodash";
import {lerp} from "../../../utils/math.js";
import {Transform} from "ogl";

export default class Gallery {
    constructor({
                    element,
                    geometry,
                    gl,
                    scene,
                    sizes,
                    index
                }) {
        this.element = element;
        this.elementWrapper = element.querySelector('.about__gallery__wrapper');
        this.geometry = geometry;
        this.gl = gl;
        this.scene = scene;
        this.sizes = sizes;
        this.index = index;

        this.scroll = {
            current: 0,
            target: 0,
            start: 0,
            velocity: 1,
            lerp: 0.1,
        }

        this.createGroup(scene);
        this.createMedias();
    }

    createGroup(scene) {
        this.group = new Transform();
        this.group.setParent(scene);
    }

    createMedias() {
        this.medias = this.element.querySelectorAll('.about__gallery__media');

        this.medias = _.map(this.medias, (media, index) => {
            return new Media({
                element: media,
                geometry: this.geometry,
                gl: this.gl,
                scene: this.group,
                sizes: this.sizes,
                index
            });
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
        if (!this.elementWrapper) return;

        this.sizes = event.sizes;

        this.bounds = this.elementWrapper?.getBoundingClientRect();

        this.width = (this.bounds?.width) / window.innerWidth * this.sizes.width;

        this.scroll.current = this.scroll.target = 0;

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

    /**
     * Loops
     */
    update(scroll) {
        if (!this.bounds) return;

        const distance = (scroll.current - scroll.target) * 0.1;
        const y = scroll.current / window.innerHeight;

        if (this.scroll.target > this.scroll.current) {
            this.direction = 'right';
            this.scroll.velocity = -1;
        } else if (this.scroll.target < this.scroll.current) {
            this.direction = 'left';
            this.scroll.velocity = 1;
        }

        this.scroll.target -= this.scroll.velocity;
        this.scroll.target += distance;

        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.lerp);

        _.map(this.medias, (media, index) => {
            const scaleX = media.mesh.scale.x / 2 + 0.25;

            if (this.direction === 'left') {
                const x = media.mesh.position.x + scaleX;

                if (x < -this.sizes.width / 2) {
                    media.extra += this.width;
                }
            } else if (this.direction === 'right') {
                const x = media.mesh.position.x - scaleX;

                if (x > this.sizes.width / 2) {
                    media.extra -= this.width;
                }
            }

            media.update(this.scroll.current);
        });

        this.group.position.y = y * this.sizes.height;
    }

    destroy() {
        this.scene.removeChild(this.group);
    }
}
