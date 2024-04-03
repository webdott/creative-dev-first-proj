import _ from 'lodash';

import Home from 'pages/Home/index.js';
import About from 'pages/About/index.js';
import Detail from 'pages/Detail/index.js';
import Collections from 'pages/Collections/index.js';

import Preloader from "./components/Preloader.js";
import Navigation from "./components/Navigation.js";

import Canvas from "./components/Canvas/index.js";
import NormalizeWheel from "normalize-wheel";

class App {
    constructor() {
        console.log('App initialized');
        this.createContent();

        this.createPreloader();
        this.createNavigation();
        this.createCanvas();
        this.createPages();

        this.addEventListeners();
        this.addLinkListeners();

        this.update();
    }

    createNavigation() {
        this.navigation = new Navigation({
            template: this.template
        });
    }

    createPreloader() {
        this.preloader = new Preloader();
        this.preloader.on('completed', _ => this.onPreloaded());
    }

    createCanvas() {
        this.canvas = new Canvas({
            template: this.template
        });
    }

    createContent() {
        this.content = document.querySelector('.content');
        this.template = this.content.getAttribute('data-template');
    }

    createPages() {
        this.pages = {
            home: new Home(),
            about: new About(),
            detail: new Detail(),
            collections: new Collections()
        }

        this.page = this.pages[this.template];
        this.page.create();
    }

    /**
     * Events
     */
    onPreloaded() {
        this.preloader?.destroy?.();

        this.page?.onResize();

        this.page?.show();
    }

    onPopState = () => {
        this.onChange({
            url: window.location.pathname,
            push: false
        })
    }

    async onChange({url, push = true}) {
        this.canvas.onChangeStart();
        await this.page.hide();

        const response = await fetch(url);

        if (response.status === 200) {
            const html = await response.text();
            const div = document.createElement('div');

            if (push)
                window.history.pushState({}, '', url);

            div.innerHTML = html;

            const divContent = div.querySelector('.content');

            this.template = divContent.getAttribute('data-template');

            this.navigation.onChange(this.template);

            this.content.setAttribute('data-template', this.template);
            this.content.innerHTML = divContent.innerHTML;

            this.canvas.onChangeEnd(this.template);


            this.page = this.pages[this.template];
            this.page.create();

            this.onResize();

            this.page.show();

            this.addLinkListeners();
        } else {
            console.log('ERROR');
        }
    }

    onResize = () => {
        if (this.page && this.page.onResize) {
            this.page.onResize();
        }


        if (this.canvas && this.canvas.onResize) {
            this.canvas.onResize();
        }
    }

    onTouchDown = (event) => {
        if (this.canvas && this.canvas.onTouchDown) {
            this.canvas.onTouchDown(event);
        }
    }

    onTouchMove = (event) => {
        if (this.canvas && this.canvas.onTouchMove) {
            this.canvas.onTouchMove(event);
        }
    }

    onTouchUp = (event) => {
        if (this.canvas && this.canvas.onTouchUp) {
            this.canvas.onTouchUp(event);
        }
    }

    onWheel = (event) => {
        const normalizeWheel = NormalizeWheel(event);

        if (this.canvas && this.canvas.onWheel) {
            this.canvas.onWheel(normalizeWheel);
        }

        if (this.page && this.page.onMouseWheel) {
            this.page.onMouseWheel(normalizeWheel);
        }
    }

    /**
     * Event Listeners
     */
    addEventListeners() {
        window.addEventListener('mousewheel', this.onWheel);

        window.addEventListener('mousedown', this.onTouchDown);
        window.addEventListener('mousemove', this.onTouchMove);
        window.addEventListener('mouseup', this.onTouchUp);

        window.addEventListener('touchstart', this.onTouchDown);
        window.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('touchend', this.onTouchUp);

        window.addEventListener('popstate', this.onPopState);

        window.addEventListener('resize', this.onResize);

    }

    addLinkListeners() {
        const links = document.querySelectorAll('a');

        _.each(links, link => {
            link.onclick = event => {
                event.preventDefault();

                const {href} = link;

                this.onChange({url: href});
            }
        })
    }

    /**
     * Loop
     */
    update() {
        if (this.page && this.page.update) {
            this.page.update();
        }

        if (this.canvas && this.canvas.update) {
            this.canvas.update(this.page.scroll);
        }

        this.frame = window.requestAnimationFrame(_ => this.update());
    }
}

new App()
