export function NoiseBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-gray-50" />
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{ filter: "url(#noiseFilter)" }}
      />
      <svg style={{ display: "none" }}>
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="6.29"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
    </>
  );
}
