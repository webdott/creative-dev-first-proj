import GSAP from "gsap";

export function lerp(p1, p2, t) {
    return GSAP.utils.interpolate(p1, p2, t)
}

export function clamp(min, max, value) {
    return GSAP.utils.clamp(min, max, value);
}
