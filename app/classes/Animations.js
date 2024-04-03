import Component from "./Component.js";

export default class Animation extends Component {
    constructor({element, elements}) {
        super({element, elements});

        this.createObserver();
    }

    createObserver() {
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateIn();
                } else {
                    this.animateOut();
                }
            })
        });

        this.observer.observe(this.element);
    }

    animateIn() {
    }

    animateOut() {
    }

    onResize() {
    }
}
