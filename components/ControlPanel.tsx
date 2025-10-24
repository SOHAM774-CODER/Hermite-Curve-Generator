import React from 'react';
import { Point } from '../types';
import { RefreshIcon, PencilSquareIcon } from './Icons';

interface ControlPanelProps {
  points: Point[];
  updatePoint: (index: number, axis: 'x' | 'y', value: number) => void;
  reset: () => void;
  handleMakeCurve: () => void;
}

const NumberInput: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FF7E67] focus:border-[#FF7E67] transition bg-teal-50 focus:bg-white"
    />
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  points,
  updatePoint,
  reset,
  handleMakeCurve,
}) => {
  const pointLabels = ["Start Point P0", "End Point P1", "Control Point P2"];
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 h-full">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-3">Controls</h2>
      
      <div className="space-y-4">
        {points.map((p, i) => (
          <div key={i} className="p-4 border rounded-lg bg-gray-50/50">
            <p className="font-bold text-lg text-[#006A71]">{pointLabels[i]}</p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <NumberInput label="X-coordinate" value={p.x} onChange={(e) => updatePoint(i, 'x', parseFloat(e.target.value) || 0)} />
              <NumberInput label="Y-coordinate" value={p.y} onChange={(e) => updatePoint(i, 'y', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t space-y-3">
        <button onClick={reset} className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006A71] transition">
          <RefreshIcon className="w-5 h-5 mr-2" /> Reset
        </button>
        <button onClick={handleMakeCurve} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#006A71] hover:bg-[#00565c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006A71] transition">
            <PencilSquareIcon className="w-5 h-5 mr-2" /> Make Curve
        </button>
      </div>
    </div>
  );
};