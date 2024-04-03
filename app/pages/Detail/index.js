import Page from "../../classes/Page.js";
import Button from "../../classes/Button.js";

export default class Detail extends Page {
    constructor() {
        super({
            id: 'detail', element: '.detail',
            elements: {
                button: '.detail__button',
            }
        });
    }

    create() {
        super.create();

        this.button = new Button({
            element: this.elements.button
        })
    }

    destroy() {
        super.destroy();

        this.button.removeEventListeners();
    }
}
