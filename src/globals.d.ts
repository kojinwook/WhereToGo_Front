import 'gsap';

interface SVGElement {
    _gsTransform?: {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        skewX: number;
        skewY: number;
        perspective: number;
    };
}

declare module 'gsap' {
    interface GSTransform {
        _gsTransform: {
            x: number;
            y: number;
            scaleX: number;
            scaleY: number;
            rotation: number;
        };
    }
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const content: any;
    export default content;
}

declare module '*.jfif' {
    const content: any;
    export default content;
}