import React, { useMemo } from 'react';

export function Pit({ count, onClick, isCenter, isOwner, disabled, highlight, compact }) {
  // Generate seed positions deterministically based on count
  const seeds = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Randomized but deterministic-ish positions within the circle
      const angle = (i * 137.5) * (Math.PI / 180); 
      const r = (Math.sqrt(i + 0.5) / Math.sqrt(count + 1)) * 35; 
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      const rotation = (i * 45) % 360;
      return { x, y, rotation };
    });
  }, [count]);

  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`
        relative flex items-center justify-center
        ${isCenter 
          ? 'w-16 h-16 md:w-28 md:h-28' // Smaller centers on mobile
          : 'w-11 h-11 md:w-20 md:h-20' // Smaller pits on mobile (44px vs 80px)
        }
        rounded-full transition-all duration-300
        ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-105 active:scale-95'}
        ${highlight ? 'ring-4 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]' : ''}
        
        /* Neumorphic/Depth Look */
        bg-[#2a2a2a]
        shadow-[inset_3px_3px_6px_rgba(0,0,0,0.7),inset_-3px_-3px_6px_rgba(255,255,255,0.05)]
        md:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.7),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]
        border border-white/5
        
        ${!disabled && isOwner ? 'hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.8),inset_-5px_-5px_10px_rgba(251,191,36,0.1)]' : ''}
      `}
    >
      {/* Seed Count Badge - Floating */}
      {count > 0 && (
        <div className={`
          absolute -top-1 -right-1 
          ${isCenter ? 'w-8 h-8 text-sm' : 'w-6 h-6 text-xs'}
          flex items-center justify-center
          bg-gradient-to-br from-amber-500 to-orange-600 
          text-white font-bold rounded-full 
          shadow-lg border border-amber-300/50 z-20
          animate-in zoom-in duration-300
        `}>
          {count}
        </div>
      )}

      {/* Seeds Container */}
      <div className="relative w-full h-full rounded-full overflow-hidden">
        {seeds.map((pos, i) => (
          <div
            key={i}
            className="absolute w-3.5 h-3.5 rounded-full shadow-sm z-10"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
              background: 'radial-gradient(circle at 30% 30%, #fbbf24, #b45309)',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          />
        ))}
        
        {/* Inner Glow for active pits */}
        {!disabled && isOwner && (
          <div className="absolute inset-0 bg-amber-500/5 rounded-full pointer-events-none" />
        )}
      </div>
    </div>
  );
}
