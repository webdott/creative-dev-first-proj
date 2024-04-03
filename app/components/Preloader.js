import Component from "../classes/Component.js";
import _ from "lodash";
import GSAP from "gsap";
import {split} from "../utils/text.js";

export default class Preloader extends Component {
    constructor() {
        super({
            element: '.preloader',
            elements: {
                title: '.preloader__text',
                number: '.preloader__number',
                numberText: '.preloader__number__text',
                images: document.querySelectorAll('img')
            }
        });

        split({
            element: this.elements.title,
            expression: '<br>'
        })

        split({
            element: this.elements.title,
            expression: '<br>'
        })

        this.elements.titleSpans = this.elements.title.querySelectorAll('span span');

        this.length = 0;

        this.createLoader();
    }

    createLoader() {
        _.each(this.elements.images, (element, index) => {
            element.src = element.getAttribute('data-src');
            element.onload = _ => this.onAssetLoaded();
        });
    }

    onAssetLoaded() {
        this.length += 1;

        const percentage = this.length / this.elements.images.length;
        this.elements.numberText.innerHTML = `${Math.round(percentage * 100)}%`;

        if (this.length >= this.elements.images.length) {
            this.onLoaded();
        }
    }

    onLoaded() {
        return new Promise(resolve => {
            this.animateOut = GSAP.timeline({
                delay: 1,
                onComplete: resolve
            });

            this.animateOut.to(this.elements.titleSpans, {
                y: '100%',
                duration: 1.5,
                ease: 'expo.out',
                stagger: 0.1
            });

            this.animateOut.to(this.elements.numberText, {
                y: '100%',
                duration: 1.5,
                ease: 'expo.out',
            }, '-=1.4');

            this.animateOut.to(this.element, {
                duration: 1.5,
                ease: 'expo.out',
                scaleY: 0,
                transformOrigin: '100% 100%'
            }, '-=1')

            this.animateOut.call(_ => {
                this.emit('completed');
            })
        });
    };


    destroy() {
        this.element.parentNode?.removeChild(this.element);
    }
}
