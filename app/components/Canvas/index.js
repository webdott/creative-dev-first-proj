import { Camera, Renderer, Transform } from "ogl";

import Home from "./Home/index.js";
import About from "./About/index.js";
import Collections from "./Collections/index.js";

export default class Canvas {
    constructor({ template }) {
        this.template = template;

        this.x = {
            start: 0,
            distance: 0,
            end: 0,
        };

        this.y = {
            start: 0,
            distance: 0,
            end: 0,
        };

        this.createRenderer();
        this.createScene();
        this.createCamera();

        this.onResize();
    }

    createRenderer() {
        this.renderer = new Renderer({
            alpha: true,
            antialias: true,
        });

        this.gl = this.renderer.gl;

        document.body.appendChild(this.gl.canvas);
    }

    createScene() {
        this.scene = new Transform();
    }

    createAbout() {
        this.about = new About({
            gl: this.gl,
            scene: this.scene,
            sizes: this.sizes,
        });
    }

    createHome() {
        this.home = new Home({
            gl: this.gl,
            scene: this.scene,
            sizes: this.sizes,
        });
    }

    createCollections() {
        this.collections = new Collections({
            gl: this.gl,
            scene: this.scene,
            sizes: this.sizes,
        });
    }

    destroyAbout() {
        if (!this.about) return;

        this.about.destroy();
        this.about = null;
    }

    destroyHome() {
        if (!this.home) return;

        this.home.destroy();
        this.home = null;
    }

    destroyCollections() {
        if (!this.collections) return;

        this.collections.destroy();
        this.collections = null;
    }

    createCamera() {
        this.camera = new Camera(this.gl);
        this.camera.position.z = 5;
    }

    /**
     * Events
     */
    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.camera.perspective({
            aspect: window.innerWidth / window.innerHeight,
        });

        const fov = this.camera.fov * (Math.PI / 180);
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
        const width = height * this.camera.aspect;

        this.sizes = {
            height,
            width,
        };

        const values = { sizes: this.sizes };

        if (this.home) this.home.onResize(values);

        if (this.about) this.about.onResize(values);

        if (this.collections) this.collections.onResize(values);
    }

    onPreloaded() {
        this.onChangeEnd(this.template);
    }

    onChangeStart() {
        if (this.about) {
            this.about.hide();
        }

        if (this.collections) {
            this.collections.hide();
        }

        if (this.home) {
            this.home.hide();
        }
    }

    onChangeEnd(template) {
        if (template === "collections") {
            this.createCollections();
        } else if (this.collections) {
            this.destroyCollections();
        }

        if (template === "about") {
            this.createAbout();
        } else if (this.about) {
            this.destroyAbout();
        }

        if (template === "home") {
            this.createHome();
        } else if (this.home) {
            this.destroyHome();
        }
    }

    onTouchDown = (event) => {
        this.down = true;

        this.x.start = event.touches ? event.touches[0].clientX : event.clientX;
        this.y.start = event.touches ? event.touches[0].clientY : event.clientY;

        const values = {
            x: this.x,
            y: this.y,
        };

        if (this.home) {
            this.home.onTouchDown(values);
        }

        if (this.about) {
            this.about.onTouchDown(values);
        }

        if (this.collections) {
            this.collections.onTouchDown(values);
        }
    };

    onTouchMove = (event) => {
        if (!this.down) return;

        const x = event.touches ? event.touches[0].clientX : event.clientX;
        const y = event.touches ? event.touches[0].clientY : event.clientY;

        this.x.end = x;
        this.y.end = y;

        const values = {
            x: this.x,
            y: this.y,
        };

        if (this.home) {
            this.home.onTouchMove(values);
        }

        if (this.about) {
            this.about.onTouchMove(values);
        }

        if (this.collections) {
            this.collections.onTouchMove(values);
        }
    };

    onTouchUp = (event) => {
        this.down = false;
        const x = event.changedTouches
            ? event.changedTouches[0].clientX
            : event.clientX;
        const y = event.changedTouches
            ? event.changedTouches[0].clientY
            : event.clientY;

        this.x.end = x;
        this.y.end = y;

        const values = {
            x: this.x,
            y: this.y,
        };

        if (this.home) {
            this.home.onTouchUp(values);
        }

        if (this.about) {
            this.about.onTouchUp(values);
        }

        if (this.collections) {
            this.collections.onTouchUp(values);
        }
    };

    onWheel = (event) => {
        if (this.home) {
            this.home.onWheel(event);
        }

        if (this.about) {
            this.about.onWheel(event);
        }

        if (this.collections) {
            this.collections.onWheel(event);
        }
    };

    /**
     * Loops
     */
    update(scroll) {
        if (this.home) {
            this.home.update();
        }

        if (this.about) {
            this.about.update(scroll);
        }

        if (this.collections) {
            this.collections.update();
        }

        this.renderer.render({ scene: this.scene, camera: this.camera });
    }
}
