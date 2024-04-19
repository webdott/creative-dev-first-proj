import _ from "lodash";
import GSAP from "gsap";
import Prefix from "prefix";

import { clamp, lerp } from "../utils/math.js";
import Title from "../animations/Title.js";
import Paragraph from "../animations/Paragraph.js";
import Label from "../animations/Label.js";
import Highlight from "../animations/Highlight.js";
import AsyncLoad from "./AsyncLoad.js";

import { ColorsManager } from "./Colors.js";

export default class Page {
    constructor({ id, element, elements }) {
        this.selector = element;
        this.selectorChildren = {
            ...elements,

            animationTitles: '[data-animation="title"]',
            animationParagraphs: '[data-animation="paragraph"]',
            animationLabels: '[data-animation="label"]',
            animationHighlights: '[data-animation="highlight"]',

            preloaders: "[data-src]",
        };

        this.id = id;

        this.transformPrefix = Prefix("transform");
    }

    create() {
        this.element = document.querySelector(this.selector);
        this.elements = {};

        this.scroll = {
            current: 0,
            target: 0,
            last: 0,
            limit: 0,
        };

        _.each(this.selectorChildren, (entry, key) => {
            if (
                entry instanceof window.HTMLElement ||
                entry instanceof window.NodeList ||
                Array.isArray(entry)
            ) {
                this.elements[key] = entry;
            } else {
                this.elements[key] = document.querySelectorAll(entry);

                if (this.elements[key].length === 0) {
                    this.elements[key] = null;
                } else if (this.elements[key].length === 1) {
                    this.elements[key] = document.querySelector(entry);
                }
            }
        });

        this.createAnimations();
        this.createPreloader();
    }

    createAnimations() {
        this.animations = [];

        _.map(this.elements.animationTitles, (element) => {
            this.animations.push(new Title({ element }));
        });

        _.map(this.elements.animationParagraphs, (element) => {
            this.animations.push(new Paragraph({ element }));
        });

        _.map(this.elements.animationLabels, (element) => {
            this.animations.push(new Label({ element }));
        });

        _.map(this.elements.animationHighlights, (element) => {
            this.animations.push(new Highlight({ element }));
        });
    }

    createPreloader() {
        this.preloaders = _.map(this.elements.preloaders, (element) => {
            return new AsyncLoad({ element });
        });
    }

    // Animations
    show() {
        return new Promise((resolve) => {
            ColorsManager.change({
                backgroundColor: this.element.getAttribute("data-background"),
                color: this.element.getAttribute("data-color"),
            });

            this.animateIn = GSAP.timeline();

            this.animateIn.fromTo(
                this.element,
                {
                    autoAlpha: 0,
                },
                {
                    autoAlpha: 1,
                    duration: 0.5,
                }
            );

            this.animateIn.call((_) => {
                this.addEventListeners();

                resolve();
            });
        });
    }

    hide() {
        return new Promise((resolve) => {
            this.destroy();

            this.animateOut = GSAP.timeline();

            this.animateOut.to(this.element, {
                autoAlpha: 0,
                onComplete: resolve,
            });
        });
    }

    // Events
    onMouseWheel = ({ pixelY }) => {
        this.scroll.target += pixelY;
    };

    onResize() {
        if (this.elements.wrapper)
            this.scroll.limit =
                this.elements.wrapper.clientHeight - window.innerHeight;
    }

    // Loop
    update() {
        this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);
        this.scroll.current = lerp(
            this.scroll.current,
            this.scroll.target,
            0.1
        );

        if (this.scroll.target < 0.01) this.scroll.target = 0;

        if (this.elements.wrapper)
            this.elements.wrapper.style[
                this.transformPrefix
            ] = `translateY(${-this.scroll.current}px)`;
    }

    // Event Listeners
    addEventListeners() {}

    removeEventListeners() {}

    // Destroy
    destroy() {
        this.removeEventListeners();
    }
}
