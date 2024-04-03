import GSAP from "gsap";
import _ from 'lodash';

import {calculate, split} from "../utils/text.js";
import Animation from "../classes/Animations.js";

export default class Paragraph extends Animation {
    constructor({element, elements}) {
        super({
            element,
            elements
        });

        split({
            element: this.element
        })

        split({
            element: this.element
        })

        this.elementLinesSpans = this.element.querySelectorAll('span span');
    }

    animateIn() {
        this.timelineIn = GSAP.timeline({
            delay: 0.5
        });

        this.timelineIn.set(this.element, {
            autoAlpha: 1
        })

        _.each(this.elementLines, (line, index) => {
            this.timelineIn.fromTo(line, {
                autoAlpha: 0,
                y: '100%'
            }, {
                autoAlpha: 1,
                duration: 1,
                ease: 'expo.out',
                delay: index * 0.1,
                y: '0%',
            }, 0);
        })
    }

    animateOut() {
        GSAP.set(this.element, {
            autoAlpha: 0
        })
    }

    onResize() {
        this.elementLines = calculate(this.elementLinesSpans);
    }
}
