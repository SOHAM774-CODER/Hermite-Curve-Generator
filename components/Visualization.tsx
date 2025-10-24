import React from 'react';
import { Point } from '../types';

interface VisualizationProps {
  points: [Point, Point];
  tangents: [Point, Point];
  isCurveVisible: boolean;
  intermediatePoints: Point[];
}

const hermiteBasis = {
  h00: (t: number) => 2 * t * t * t - 3 * t * t + 1,
  h10: (t: number) => -2 * t * t * t + 3 * t * t,
  h01: (t: number) => t * t * t - 2 * t * t + t,
  h11: (t: number) => t * t * t - t * t,
};

const calculateCurvePath = (p0: Point, p1: Point, t0: Point, t1: Point, steps: number): string => {
  let path = `M ${p0.x} ${p0.y} `;
  for (let i = 1; i <= steps; i++) {
    const u = i / steps;
    const x = hermiteBasis.h00(u) * p0.x + hermiteBasis.h10(u) * p1.x + hermiteBasis.h01(u) * t0.x + hermiteBasis.h11(u) * t1.x;
    const y = hermiteBasis.h00(u) * p0.y + hermiteBasis.h10(u) * p1.y + hermiteBasis.h01(u) * t0.y + hermiteBasis.h11(u) * t1.y;
    path += `L ${x} ${y} `;
  }
  return path;
};

export const Visualization: React.FC<VisualizationProps> = ({ points, tangents, isCurveVisible, intermediatePoints }) => {
  const [p0, p1] = points;
  const [t0, t1] = tangents;

  const allNodes = [p0, p1, ...intermediatePoints];
  const xCoords = allNodes.map(p => p.x);
  const yCoords = allNodes.map(p => p.y);
  
  const xRange = Math.max(...xCoords) - Math.min(...xCoords);
  const yRange = Math.max(...yCoords) - Math.min(...yCoords);
  const marginX = Math.max(xRange * 0.15, 2);
  const marginY = Math.max(yRange * 0.15, 2);

  const minX = Math.min(...xCoords) - marginX;
  const maxX = Math.max(...xCoords) + marginX;
  const minY = Math.min(...yCoords) - marginY;
  const maxY = Math.max(...yCoords) + marginY;
  
  const width = maxX - minX;
  const height = maxY - minY;
  const FONT_SIZE = width * 0.025;
  const STROKE_WIDTH = width * 0.005;
  const POINT_RADIUS = width * 0.01;

  const viewBox = `${minX} ${-maxY} ${width} ${height}`;

  const curvePath = calculateCurvePath(p0, p1, t0, t1, 100);
  
  const getTicks = (min: number, max: number) => {
    const range = max - min;
    if (range === 0) return [min];
    
    // Aim for ~5-8 ticks for a cleaner look
    const numTicks = 8;
    const rawStep = range / numTicks;
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const res = rawStep / mag;
    let tickStep;
    if (res > 5) tickStep = 10 * mag;
    else if (res > 2) tickStep = 5 * mag;
    else if (res > 1) tickStep = 2 * mag;
    else tickStep = mag;

    const ticks = [];
    let current = Math.floor(min / tickStep) * tickStep;
    while (current <= max) {
      ticks.push(parseFloat(current.toPrecision(10)));
      current += tickStep;
    }
    return ticks;
  }

  const xTicks = getTicks(minX, maxX);
  const yTicks = getTicks(minY, maxY);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-4">Curve Visualization</h2>
      <div className="w-full aspect-square">
        {isCurveVisible ? (
            <svg viewBox={viewBox} className="w-full h-full bg-white rounded-md border border-gray-200">
            <g transform="scale(1, -1)" strokeWidth={STROKE_WIDTH/2} fontSize={FONT_SIZE} fontFamily="sans-serif">
                {/* Grid Lines */}
                {xTicks.map(x => (
                  <line key={`grid-x-${x}`} x1={x} y1={minY} x2={x} y2={maxY} stroke="#e5e7eb" />
                ))}
                {yTicks.map(y => (
                  <line key={`grid-y-${y}`} x1={minX} y1={y} x2={maxX} y2={y} stroke="#e5e7eb" />
                ))}

                {/* Axis Lines */}
                <line x1={minX} y1={minY} x2={maxX} y2={minY} stroke="#9ca3af" />
                <line x1={minX} y1={minY} x2={minX} y2={maxY} stroke="#9ca3af" />


                {/* Axis Tick Labels */}
                {xTicks.map(x => (
                    <g key={`tick-x-${x}`} transform={`translate(${x}, ${minY})`}>
                        <text y={FONT_SIZE * 1.5} transform="scale(1,-1)" textAnchor="middle" fill="#6b7280" fontSize={FONT_SIZE * 0.7}>{x}</text>
                    </g>
                ))}
                {yTicks.map(y => (
                     <g key={`tick-y-${y}`} transform={`translate(${minX}, ${y})`}>
                        <text x={-FONT_SIZE * 0.5} transform="scale(1,-1)" textAnchor="end" dominantBaseline="middle" fill="#6b7280" fontSize={FONT_SIZE * 0.7}>{y}</text>
                    </g>
                ))}
                
                {/* Curve path */}
                <path d={curvePath} stroke="#FF7E67" strokeWidth={STROKE_WIDTH} fill="none" />
                
                {/* Endpoints P0 and P1 */}
                <g>
                    <title>{`P0: (${p0.x.toFixed(2)}, ${p0.y.toFixed(2)})`}</title>
                    <circle cx={p0.x} cy={-p0.y} r={POINT_RADIUS} fill="#1f2937" />
                    <text x={p0.x} y={-(p0.y - POINT_RADIUS * 4)} transform="scale(1,-1)" textAnchor="middle" fill="#1f2937" fontWeight="bold">P0</text>
                </g>
                <g>
                    <title>{`P1: (${p1.x.toFixed(2)}, ${p1.y.toFixed(2)})`}</title>
                    <circle cx={p1.x} cy={-p1.y} r={POINT_RADIUS} fill="#1f2937" />
                    <text x={p1.x} y={-(p1.y - POINT_RADIUS * 4)} transform="scale(1,-1)" textAnchor="middle" fill="#1f2937" fontWeight="bold">P1</text>
                </g>

                {/* Intermediate Points and Labels */}
                {intermediatePoints.map((p, i) => (
                    <g key={`q-${i}`}>
                        <title>{`Q${i + 1}: (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`}</title>
                        <circle cx={p.x} cy={-p.y} r={POINT_RADIUS * 1.1} fill="#006A71" />
                        <text 
                          x={p.x} 
                          y={-(p.y + POINT_RADIUS * 4)} 
                          transform="scale(1,-1)" 
                          textAnchor="middle" 
                          fill="#00565c"
                          fontWeight="bold"
                          fontSize={FONT_SIZE * 0.85}
                        >
                            ({p.x.toFixed(1)}, {p.y.toFixed(1)})
                        </text>
                    </g>
                ))}
            </g>
            </svg>
        ) : (
            <div className="w-full h-full bg-gray-50 rounded-md border flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                    Adjust the points and click "Make Curve" to generate the visualization.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};