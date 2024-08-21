import React from 'react';

interface RoundNumberProps {
    luasLahan: string;
}

export default function RoundNumber({ luasLahan }: RoundNumberProps) {
    const roundedNumber = parseFloat(luasLahan).toFixed(2);
    return (
        <div>
            <p>{roundedNumber} Ha</p>
        </div>
    );
}
