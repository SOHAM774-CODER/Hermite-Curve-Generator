import React from 'react';
import { Point } from '../types';

interface MathDetailsProps {
    points: [Point, Point];
    tangents: [Point, Point];
}

const formatNumber = (num: number) => {
    return Number(num.toFixed(2));
};

const Coeffs: React.FC<{ p0: Point, p1: Point, t0: Point, t1: Point }> = ({ p0, p1, t0, t1 }) => {
    const ax = formatNumber(2 * p0.x - 2 * p1.x + t0.x + t1.x);
    const bx = formatNumber(-3 * p0.x + 3 * p1.x - 2 * t0.x - t1.x);
    const cx = formatNumber(t0.x);
    const dx = formatNumber(p0.x);
    
    const ay = formatNumber(2 * p0.y - 2 * p1.y + t0.y + t1.y);
    const by = formatNumber(-3 * p0.y + 3 * p1.y - 2 * t0.y - t1.y);
    const cy = formatNumber(t0.y);
    const dy = formatNumber(p0.y);

    const term = (val: number, variable: string) => {
        if (val === 0) return '';
        const sign = val > 0 ? '+' : '-';
        const absVal = Math.abs(val);
        if (absVal === 1 && variable) return ` ${sign} ${variable}`;
        return ` ${sign} ${absVal}${variable}`;
    };

    const xEq = `${ax ? `${ax}u³` : ''}${term(bx, 'u²')}${term(cx, 'u')}${term(dx, '')}`.trim().replace(/^ \+ /, '');
    const yEq = `${ay ? `${ay}u³` : ''}${term(by, 'u²')}${term(cy, 'u')}${term(dy, '')}`.trim().replace(/^ \+ /, '');

    return (
        <div className="font-mono text-sm bg-gray-100 p-4 rounded-md overflow-x-auto">
            <p>P<span className="text-xs">x</span>(u) = {xEq || '0'}</p>
            <p>P<span className="text-xs">y</span>(u) = {yEq || '0'}</p>
        </div>
    );
};

export const MathDetails: React.FC<MathDetailsProps> = ({ points, tangents }) => {
    return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-4">Mathematical Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-lg text-gray-600 mb-2">Hermite Matrix (M<sub className="text-xs">H</sub>)</h3>
                    <p className="text-gray-600 mb-2">The Hermite matrix transforms the geometric constraints (points and tangents) into the polynomial coefficients [a, b, c, d].</p>
                    <div className="font-mono text-center p-4 bg-gray-100 rounded-md inline-block">
                        <div className="grid grid-cols-4 gap-4">
                            <span>2</span><span>-2</span><span>1</span><span>1</span>
                            <span>-3</span><span>3</span><span>-2</span><span>-1</span>
                            <span>0</span><span>0</span><span>1</span><span>0</span>
                            <span>1</span><span>0</span><span>0</span><span>0</span>
                        </div>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg text-gray-600 mb-2">Basis Functions</h3>
                    <p className="text-gray-600 mb-2">These functions blend the influence of the control points and tangents over the parameter `u` (from 0 to 1).</p>
                     <div className="font-mono text-sm bg-gray-100 p-4 rounded-md">
                        <p>H<sub className="text-xs">00</sub>(u) = 2u³ - 3u² + 1</p>
                        <p>H<sub className="text-xs">10</sub>(u) = -2u³ + 3u²</p>
                        <p>H<sub className="text-xs">01</sub>(u) = u³ - 2u² + u</p>
                        <p>H<sub className="text-xs">11</sub>(u) = u³ - u²</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-6">
                <h3 className="font-semibold text-lg text-gray-600 mb-2">Parametric Equations</h3>
                {points.length > 1 ? (
                    <div>
                        <h4 className="font-medium text-[#006A71]">Segment (P0 to P1)</h4>
                        <Coeffs p0={points[0]} p1={points[1]} t0={tangents[0]} t1={tangents[1]} />
                    </div>
                ) : (
                    <p className="text-gray-500">Not enough points to generate segment equations.</p>
                )}
            </div>
        </div>
    );
};