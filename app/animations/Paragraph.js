import GSAP from "gsap";
import _ from "lodash";

import Animation from "../classes/Animations.js";

export default class Paragraph extends Animation {
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
}
