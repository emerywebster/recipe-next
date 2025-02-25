'use client';

export function NoiseBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-white" />
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{ filter: 'url(#noiseFilter)' }} />
      <svg style={{ display: 'none' }}>
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="10" numOctaves="10" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
    </>
  );
}
