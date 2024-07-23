import 'gsap';

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
