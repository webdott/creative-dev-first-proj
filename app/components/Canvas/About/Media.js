import { Mesh, Program, Texture } from "ogl";

import vertex from "../../../shaders/plane-vertex.glsl";
import fragment from "../../../shaders/plane-fragment.glsl";
import GSAP from "gsap";

export default class Media {
    constructor({ element, geometry, gl, scene, sizes, index }) {
        this.gl = gl;
        this.scene = scene;
        this.sizes = sizes;
        this.geometry = geometry;
        this.element = element;
        this.index = index;

        this.createTexture();
        this.createProgram();
        this.createMesh();
    }

    createTexture() {
        this.elementImg = this.element.querySelector("img");

        this.texture =
            window.TEXTURES[this.elementImg.getAttribute("data-src")];
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program,
        });

        this.mesh.setParent(this.scene);
    }

    createProgram() {
        this.program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms: {
                uAlpha: { value: 0 },
                tMap: { value: this.texture },
            },
        });
    }

    createBounds({ sizes }) {
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
        GSAP.fromTo(
            this.program.uniforms.uAlpha,
            {
                value: 0,
            },
            {
                value: 1,
            }
        );
    }

    hide() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 0,
        });
    }

    updateRotation() {
        this.mesh.rotation.z = GSAP.utils.mapRange(
            -this.sizes.width / 2,
            this.sizes.width / 2,
            Math.PI * 0.1,
            -Math.PI * 0.1,
            this.mesh.position.x
        );
    }

    /**
     * Events
     */
    onResize(event) {
        this.extra = 0;

        this.createBounds(event);
    }

    /**
     * Loops
     */
    updateScale() {
        const { height, width } = this.sizes;

        this.width = this.bounds.width / window.innerWidth;
        this.height = this.bounds.height / window.innerHeight;

        this.mesh.scale.x = width * this.width;
        this.mesh.scale.y = height * this.height;
    }

    updateX(x = 0) {
        const { width } = this.sizes;
        this.x = (this.bounds.left + x) / window.innerWidth;

        this.mesh.position.x =
            -width / 2 + this.mesh.scale.x / 2 + this.x * width + this.extra;
    }

    updateY(y = 0) {
        const { height } = this.sizes;
        this.y = (this.bounds.top + y) / window.innerHeight;

        this.mesh.position.y =
            height / 2 - this.mesh.scale.y / 2 - this.y * height;
        this.mesh.position.y +=
            Math.cos(
                (this.mesh.position.x / this.sizes.width) * Math.PI * 0.1
            ) *
                40 -
            40;
    }

    update(scroll) {
        this.updateRotation();
        this.updateScale();
        this.updateX(scroll);
        this.updateY(0);
    }
}
