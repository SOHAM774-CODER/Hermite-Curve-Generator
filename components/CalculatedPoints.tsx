import React from 'react';
import { Point } from '../types';

interface CalculatedPointsProps {
  points: Point[];
}

const formatCoord = (n: number) => n.toFixed(2);

export const CalculatedPoints: React.FC<CalculatedPointsProps> = ({ points }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-4">Calculated Points</h2>
      <ul className="space-y-2 font-mono text-sm text-gray-800">
        {points.map((p, i) => (
          <li key={i} className="flex justify-center items-center p-2 bg-gray-50/70 rounded-md">
            <span>(x: {formatCoord(p.x)}, y: {formatCoord(p.y)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};