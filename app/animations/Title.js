import GSAP from "gsap";
import _ from "lodash";

import { calculate, split } from "../utils/text.js";
import Animation from "../classes/Animations.js";

export default class Title extends Animation {
    constructor({ element, elements }) {
        super({
            element,
            elements,
        });
    }

    animateIn() {
        GSAP.to(this.element, {
            autoAlpha: 1,
            duration: 1,
            delay: 0.5,
        });
    }

    animateOut() {
        GSAP.set(this.element, {
            autoAlpha: 0,
        });
    }

    onResize() {
        this.elementLines = calculate(this.elementLinesSpans);
    }
}
