import {Mesh, Program, Texture} from "ogl";
import GSAP from "gsap";

import vertex from "../../../shaders/plane-vertex.glsl";
import fragment from "../../../shaders/plane-fragment.glsl";

export default class Media {
    constructor({
                    element,
                    geometry,
                    gl,
                    scene,
                    sizes,
                    index
                }) {
        this.gl = gl;
        this.scene = scene;
        this.sizes = sizes;
        this.geometry = geometry;
        this.element = element;
        this.index = index;

        this.createTexture();
        this.createProgram();
        this.createMesh();

        this.extra = {
            x: 0,
            y: 0
        }
    }

    createTexture() {
        this.texture = new Texture(this.gl);

        this.image = new Image();
        this.image.crossOrigin = 'anonymous';
        this.image.src = this.element.getAttribute('data-src');
        this.image.onload = _ => this.texture.image = this.image;
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        });

        this.mesh.setParent(this.scene);

        this.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
    }

    createProgram() {
        this.program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms: {
                uAlpha: {value: 0},
                tMap: {value: this.texture}
            }
        })
    }

    createBounds({sizes}) {
        this.sizes = sizes;
        this.bounds = this.element.getBoundingClientRect();

        this.updateScale();
        this.updateX();
        this.updateY();
    }

    /**
     * Animations
     */
    show() {
        GSAP.fromTo(this.program.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1
        })
    }

    hide() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 0
        })
    }

    /**
     * Events
     */
    onResize(event) {
        this.extra = {
            x: 0,
            y: 0
        }

        this.createBounds(event);
    }

    /**
     * Loops
     */
    updateScale() {
        const {height, width} = this.sizes;

        this.width = this.bounds.width / window.innerWidth;
        this.height = this.bounds.height / window.innerHeight;

        this.mesh.scale.x = width * this.width;
        this.mesh.scale.y = height * this.height;
    }

    updateX(x = 0) {
        const {width} = this.sizes;
        this.x = (this.bounds.left + x) / window.innerWidth;

        this.mesh.position.x = (-width / 2) + (this.mesh.scale.x / 2) + ((this.x) * width) + this.extra.x;
    }

    updateY(y = 0) {
        const {height} = this.sizes;
        this.y = (this.bounds.top + y) / window.innerHeight;

        this.mesh.position.y = (height / 2) - (this.mesh.scale.y / 2) - ((this.y) * height) + this.extra.y;
    }

    update(scroll) {
        this.updateX(scroll.x);
        this.updateY(scroll.y);
    }
}
