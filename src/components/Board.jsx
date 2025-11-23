import React from 'react';
import { Pit } from './Pit';

export function Board({ board, turn, onSow, gameStatus, t }) {
  const isPlaying = gameStatus === 'playing';
  const isPlayerBTurn = turn === 'B';
  const isPlayerATurn = turn === 'A';

  // Indices for Player A (bottom/right) and Player B (top/left)
  // Player A: 0-6 (left to right)
  // Player B: 7-13 (right to left)
  const PLAYER_A_INDICES = [0, 1, 2, 3, 4, 5, 6];
  const PLAYER_B_INDICES = [13, 12, 11, 10, 9, 8, 7];
  
  // Center indices
  const CENTER_1 = 14; // Corrected indices based on useAkongGame logic (0-13 are pits, 14,15 are centers?)
  // Wait, let me check useAkongGame.js logic for centers. 
  // In useAkongGame.js (from memory/previous context):
  // 0-6: Player A
  // 7: Center 1 (Store A?) - No, usually Akong has 2 centers.
  // Let's check the previous Board.jsx content in the context.
  // Previous Board.jsx had:
  // PLAYER_B_INDICES = [14, 13, 12, 11, 10, 9, 8];
  // CENTER_1 = 15;
  // CENTER_2 = 7;
  // PLAYER_A_INDICES = [0, 1, 2, 3, 4, 5, 6];
  
  // Let's stick to the indices used in the previous valid version.
  
  const INDICES_B = [14, 13, 12, 11, 10, 9, 8];
  const INDICES_A = [0, 1, 2, 3, 4, 5, 6];
  const C1 = 15;
  const C2 = 7;

  return (
    <div className="relative p-4 md:p-8">
      {/* Board Container */}
      <div className={`
        relative flex flex-row md:flex-col items-center gap-3 md:gap-6 bg-[#232323] p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] border border-white/5
      `}>
        
        {/* Player B Section */}
        {/* Mobile: Left Column (14..8 Top to Bottom). Desktop: Top Row (14..8 Left to Right) */}
        <div className={`
          flex flex-col md:flex-row gap-2 md:gap-4 p-3 md:p-5 rounded-2xl transition-all duration-500
          ${isPlayerBTurn ? 'bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'opacity-80'}
        `}>
          {INDICES_B.map((idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 md:gap-2">
              <Pit
                count={board[idx]}
                onClick={() => onSow(idx)}
                isOwner={true}
                disabled={!isPlaying || !isPlayerBTurn || board[idx] === 0}
                highlight={false}
                compact={true} // Prop to adjust size on mobile
              />
            </div>
          ))}
        </div>

        {/* Middle Section (Centers) */}
        <div className="flex flex-col md:flex-row justify-between w-full md:px-8 items-center py-2 md:py-4 gap-8 md:gap-0 h-full md:h-auto">
          {/* Center 1 (Left/Top) */}
          <div className="flex flex-col items-center gap-2 md:gap-3">
             <span className="text-[#8a8a8a] text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold rotate-90 md:rotate-0">{t ? t.board.royalHouse : 'Casa Real'}</span>
             <div className="p-1.5 md:p-2 rounded-full bg-[#151515] shadow-[inset_0_0_10px_rgba(0,0,0,1)] border border-white/5">
               <Pit count={board[C1]} isCenter={true} disabled={true} compact={true} />
             </div>
          </div>
          
          {/* Branding/Status */}
          <div className="flex flex-col items-center md:rotate-0 -rotate-90 whitespace-nowrap">
            <div className="text-xl md:text-2xl font-black tracking-[0.5em] text-[#333] drop-shadow-[0_2px_3px_rgba(255,255,255,0.1)] select-none">
              AKONG
            </div>
            {isPlaying && (
              <div className={`mt-2 px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                isPlayerATurn ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {t ? t.board.turn : 'Turno'}: {isPlayerATurn ? 'A' : 'B'}
              </div>
            )}
          </div>

          {/* Center 2 (Right/Bottom) */}
          <div className="flex flex-col items-center gap-2 md:gap-3">
             <span className="text-[#8a8a8a] text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold rotate-90 md:rotate-0">{t ? t.board.royalHouse : 'Casa Real'}</span>
             <div className="p-1.5 md:p-2 rounded-full bg-[#151515] shadow-[inset_0_0_10px_rgba(0,0,0,1)] border border-white/5">
               <Pit count={board[C2]} isCenter={true} disabled={true} compact={true} />
             </div>
          </div>
        </div>

        {/* Player A Section */}
        <div className={`
          flex flex-col md:flex-row gap-2 md:gap-4 p-3 md:p-5 rounded-2xl transition-all duration-500
          ${isPlayerATurn ? 'bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'opacity-80'}
        `}>
          {INDICES_A.map((idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 md:gap-2">
              <Pit
                count={board[idx]}
                onClick={() => onSow(idx)}
                isOwner={true}
                disabled={!isPlaying || !isPlayerATurn || board[idx] === 0}
                highlight={false}
                compact={true}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
