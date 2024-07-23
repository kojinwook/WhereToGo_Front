import React, { useEffect, useState } from 'react';
import './style.css'; // CSS 스타일을 관리합니다

interface ThermometerProps {
    temperature: number;
}

const Thermometer: React.FC<ThermometerProps> = ({ temperature }) => {
    const [status, setStatus] = useState<string>('');
    const [liquidWidth, setLiquidWidth] = useState<number>(0);

    useEffect(() => {
        const getStatus = (temp: number) => {
            if (temp <= 20) return 'very-low';
            if (temp <= 40) return 'low';
            if (temp <= 60) return 'moderate';
            if (temp <= 80) return 'high';
            return 'very-high';
        };

        setStatus(getStatus(temperature));

        // 액체의 너비를 계산
        const widthMap: { [key: string]: number } = {
            'very-low': 10,
            'low': 30,
            'moderate': 50,
            'high': 70,
            'very-high': 99,
        };

    }, [temperature, status]);

    const statusColors: { [key: string]: string } = {
        'very-low': '#249aa7',
        'low': '#b8e1f2',
        'moderate': '#abd25e',
        'high': '#f8c830',
        'very-high': '#f1594a',
    };

    return (
        <div className={`thermometer thermometer--${status}`}>
            <span><strong></strong></span>
            <div className="glass">
                <div className="liquid" style={{  backgroundColor: statusColors[status], background: `url(#pattern-${status})` }}>
                    <div className="temperature-label" style={{ left: `${liquidWidth}%` }}>
                        {temperature}°
                    </div>
                </div>
                <svg className="ruler">
                    <rect x="0px" y="0" width="20%" height="100%" fill="url(#ticks--very-low)" rx="2" />
                    <rect x="20%" y="0" width="20%" height="100%" fill="url(#ticks--low)" rx="2" />
                    <rect x="40%" y="0" width="20%" height="100%" fill="url(#ticks--moderate)" rx="2" />
                    <rect x="60%" y="0" width="20%" height="100%" fill="url(#ticks--high)" rx="2" />
                    <rect x="80%" y="0" width="20%" height="100%" fill="url(#ticks--very-high)" rx="2" />
                    <defs>
                        <pattern id="ticks--very-low" width="60px" height="100%" patternUnits="userSpaceOnUse">
                            <line x1="1px" x2="1px" y2="6px" />
                            <line x1="12px" x2="12px" y2="6px" />
                            <line x1="24px" x2="24px" y2="6px" />
                            <line x1="36px" x2="36px" y2="6px" />
                            <line x1="48px" x2="48px" y2="10px" />
                        </pattern>
                        <pattern id="ticks--low" width="60px" height="100%" patternUnits="userSpaceOnUse">
                            <line x1="1px" x2="1px" y2="6px" />
                            <line x1="12px" x2="12px" y2="6px" />
                            <line x1="24px" x2="24px" y2="6px" />
                            <line x1="36px" x2="36px" y2="6px" />
                            <line x1="48px" x2="48px" y2="10px" />
                        </pattern>
                        <pattern id="ticks--moderate" width="60px" height="100%" patternUnits="userSpaceOnUse">
                            <line x1="1px" x2="1px" y2="6px" />
                            <line x1="12px" x2="12px" y2="6px" />
                            <line x1="24px" x2="24px" y2="6px" />
                            <line x1="36px" x2="36px" y2="6px" />
                            <line x1="48px" x2="48px" y2="10px" />
                        </pattern>
                        <pattern id="ticks--high" width="60px" height="100%" patternUnits="userSpaceOnUse">
                            <line x1="1px" x2="1px" y2="6px" />
                            <line x1="12px" x2="12px" y2="6px" />
                            <line x1="24px" x2="24px" y2="6px" />
                            <line x1="36px" x2="36px" y2="6px" />
                            <line x1="48px" x2="48px" y2="10px" />
                        </pattern>
                        <pattern id="ticks--very-high" width="60px" height="100%" patternUnits="userSpaceOnUse">
                            <line x1="1px" x2="1px" y2="6px" />
                            <line x1="12px" x2="12px" y2="6px" />
                            <line x1="24px" x2="24px" y2="6px" />
                            <line x1="36px" x2="36px" y2="6px" />
                            <line x1="48px" x2="48px" y2="10px" />
                        </pattern>
                    </defs>
                </svg>
            </div>
        </div>
    );
};

export default Thermometer;
