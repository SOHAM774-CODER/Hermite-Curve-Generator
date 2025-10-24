import React, { useState, useCallback, useMemo } from 'react';
import { Point } from './types';
import { ControlPanel } from './components/ControlPanel';
import { Visualization } from './components/Visualization';
import { CalculatedPoints } from './components/CalculatedPoints';

const initialPoints: Point[] = [
  { x: 2, y: 2 },   // P0
  { x: 12, y: 10 },  // P1
  { x: 4, y: 8 }, // P2 (Control)
];

const hermiteBasis = {
  h00: (t: number) => 2 * t * t * t - 3 * t * t + 1,
  h10: (t: number) => -2 * t * t * t + 3 * t * t,
  h01: (t: number) => t * t * t - 2 * t * t + t,
  h11: (t: number) => t * t * t - t * t,
};

const App: React.FC = () => {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [isCurveVisible, setIsCurveVisible] = useState<boolean>(false);

  // FIX: Cast the result of useMemo to [Point, Point] to ensure type correctness
  // for the 'tangents' prop in the Visualization component.
  const derivedTangents = useMemo(() => {
    if (points.length < 3) return [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    const [p0, p1, p2] = points;
    const tension = 0.5; // Cardinal spline tension

    // Tangent at P0 is defined by the vector from P0 to P2
    const t0 = {
      x: tension * (p2.x - p0.x),
      y: tension * (p2.y - p0.y),
    };

    // Tangent at P1 is defined by the vector from P2 to P1
    const t1 = {
      x: tension * (p1.x - p2.x),
      y: tension * (p1.y - p2.y),
    };
    
    return [t0, t1];
  }, [points]) as [Point, Point];

  const intermediatePoints = useMemo(() => {
    if (!isCurveVisible || points.length < 2) return [];
    const [p0, p1] = points;
    const [t0, t1] = derivedTangents;

    const uValues = [0.2, 0.4, 0.6, 0.8, 1.0];
    const calculated = uValues.map(u => {
      const x = hermiteBasis.h00(u) * p0.x + hermiteBasis.h10(u) * p1.x + hermiteBasis.h01(u) * t0.x + hermiteBasis.h11(u) * t1.x;
      const y = hermiteBasis.h00(u) * p0.y + hermiteBasis.h10(u) * p1.y + hermiteBasis.h01(u) * t0.y + hermiteBasis.h11(u) * t1.y;
      return { x, y };
    });
    
    return calculated;
  }, [points, derivedTangents, isCurveVisible]);

  const updatePoint = useCallback((index: number, axis: 'x' | 'y', value: number) => {
    setPoints(prev => {
      const newPoints = [...prev];
      newPoints[index] = { ...newPoints[index], [axis]: value };
      return newPoints;
    });
    setIsCurveVisible(false); // Hide curve when points are modified
  }, []);

  const reset = useCallback(() => {
    // Re-create the initial points array from the constant to ensure a clean state reset,
    // preventing any potential reference-related issues.
    setPoints(initialPoints.map(p => ({...p})));
    setIsCurveVisible(false); // Hide curve on reset
  }, []);

  const handleMakeCurve = useCallback(() => {
    setIsCurveVisible(true); // Show the curve
  }, []);


  return (
    <div className="min-h-screen bg-[#F0F7F4] text-gray-800 font-sans">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-[#006A71] tracking-tight">
            CAD ASSIGNMENT : Hermite Curve Generator
          </h1>
          <p className="text-xl text-gray-600">Soham Burhan_68</p>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
             <ControlPanel
                points={points}
                updatePoint={updatePoint}
                reset={reset}
                handleMakeCurve={handleMakeCurve}
             />
             {isCurveVisible && intermediatePoints.length > 0 && (
                <CalculatedPoints points={intermediatePoints} />
             )}
          </div>
          <div className="lg:col-span-2">
            {/* FIX: Add a type assertion to treat the array as a tuple '[Point, Point]', resolving the type error. */}
            <Visualization 
              points={[points[0], points[1]] as [Point, Point]} 
              tangents={derivedTangents}
              isCurveVisible={isCurveVisible}
              intermediatePoints={intermediatePoints} 
            />
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-gray-500 mt-8">
      </footer>
    </div>
  );
};

export default App;