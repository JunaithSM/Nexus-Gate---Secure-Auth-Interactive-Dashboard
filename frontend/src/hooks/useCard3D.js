import { useState, useEffect } from 'react';
import { useMotionValue, useTransform, useSpring } from 'framer-motion';

export const useCard3D = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [needsPermission, setNeedsPermission] = useState(false);

    useEffect(() => {
        const handleOrientation = (event) => {
            const { beta, gamma } = event;
            if (beta === null || gamma === null) return;

            // Clamp values and map as before
            const xVal = Math.max(-0.5, Math.min(0.5, (gamma / 90) * -0.5));
            const yVal = Math.max(-0.5, Math.min(0.5, ((beta - 45) / 90) * -0.5));

            x.set(xVal);
            y.set(yVal);
        };

        // iOS 13+ requires permission
        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            setNeedsPermission(true);
        } else {
            // Android and non-iOS 13+ devices don't need permission
            window.addEventListener("deviceorientation", handleOrientation);
        }

        return () => window.removeEventListener("deviceorientation", handleOrientation);
    }, [x, y]);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const shineX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
    const shineY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

    const shineBackground = useTransform(
        [shineX, shineY],
        ([latestX, latestY]) => `radial-gradient(circle at ${latestX} ${latestY}, rgba(255,255,255,0.10), transparent 80%)`
    );

    const handleMouseMove = (e) => {
        // Use currentTarget to always refer to the stable wrapper
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const requestGyroPermission = async () => {
        try {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setNeedsPermission(false);
                    window.addEventListener("deviceorientation", (event) => {
                        const { beta, gamma } = event;
                        if (beta === null || gamma === null) return;
                        const xVal = Math.max(-0.5, Math.min(0.5, (gamma / 90) * -0.5));
                        const yVal = Math.max(-0.5, Math.min(0.5, ((beta - 45) / 90) * -0.5));
                        x.set(xVal);
                        y.set(yVal);
                    });
                } else {
                    alert("Permission denied for 3D effect.");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return {
        handleMouseMove,
        handleMouseLeave,
        rotateX,
        rotateY,
        shineX,
        shineY,
        shineBackground,
        needsPermission,
        requestGyroPermission
    };
};
