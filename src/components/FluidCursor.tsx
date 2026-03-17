'use client';
import { useEffect } from 'react';
import fluidCursor from '@/hooks/use-FluidCursor';

const FluidCursor = () => {
  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
      <canvas id="fluid" style={{ width: '100vw', height: '100vh', display: 'block' }} />
    </div>
  );
};

export default FluidCursor;
