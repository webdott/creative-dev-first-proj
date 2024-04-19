import Component from "../classes/Component.js";
import GSAP from "gsap";
import { split } from "../utils/text.js";
import { Texture } from "ogl";

export default class Preloader extends Component {
    constructor({ canvas }) {
        super({
            element: ".preloader",
            elements: {
                title: ".preloader__text",
                number: ".preloader__number",
                numberText: ".preloader__number__text",
            },
        });

        this.canvas = canvas;

        window.TEXTURES = {};

        split({
            element: this.elements.title,
            expression: "<br>",
        });

        split({
            element: this.elements.title,
            expression: "<br>",
        });

        this.elements.titleSpans =
            this.elements.title.querySelectorAll("span span");

        this.length = 0;

        this.createLoader();
    }

    createLoader() {
        window.ASSETS.forEach((image) => {
            const media = new window.Image();
            media.crossOrigin = "anonymous";
            media.src = image;

            const texture = new Texture(this.canvas.gl, {
                generateMipmaps: false,
            });

            media.onload = (_) => {
                texture.image = media;
                this.onAssetLoaded();
            };

            window.TEXTURES[image] = texture;
        });
    }

    onAssetLoaded() {
        this.length += 1;

        const percentage = this.length / window.ASSETS.length;
        this.elements.numberText.innerHTML = `${Math.round(percentage * 100)}%`;

        if (this.length >= window.ASSETS.length) {
            this.onLoaded();
        }
    }

    onLoaded() {
        return new Promise((resolve) => {
            this.emit("completed");

            this.animateOut = GSAP.timeline({
                delay: 1,
                onComplete: resolve,
            });

            this.animateOut.to(this.elements.titleSpans, {
                y: "100%",
                duration: 1.5,
                ease: "expo.out",
                stagger: 0.1,
            });

            this.animateOut.to(
                this.elements.numberText,
                {
                    y: "100%",
                    duration: 1.5,
                    ease: "expo.out",
                },
                "-=1.4"
            );

            this.animateOut.to(
                this.element,
                {
                    autoAlpha: 0,
                    delay: 1,
                    duration: 1,
                },
                "-=1"
            );

            this.animateOut.call((_) => {
                this.destroy?.();
            });
        });
    }

    destroy() {
        this.element.parentNode?.removeChild(this.element);
    }
}
