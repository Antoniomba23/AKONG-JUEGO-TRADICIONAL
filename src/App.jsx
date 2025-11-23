import React, { useState, useEffect } from 'react';
import { useAkongGame } from "./hooks/useAkongGame";
import { Board } from "./components/Board";
import { TutorialOverlay } from "./components/TutorialOverlay";
import { useGameSounds } from './hooks/useGameSounds';
import confetti from 'canvas-confetti';
import { translations } from './translations';

export default function AkongApp() {
  const { board, turn, scores, gameStatus, winner, sow, resetGame, gameMode, setGameMode, lastSownIndex } = useAkongGame();
  const [showTutorial, setShowTutorial] = useState(false);
  const [language, setLanguage] = useState('es'); // 'es', 'en', 'fa'
  const { playMoveSound, playCaptureSound, playWinSound } = useGameSounds();

  const t = translations[language];

  // Sound Effects
  useEffect(() => {
    if (lastSownIndex !== null) {
      playMoveSound();
    }
  }, [lastSownIndex, playMoveSound]);

  // Winner Celebration
  useEffect(() => {
    if (winner) {
      playWinSound();
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#d97706', '#ffffff'] // Amber/Gold theme
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#d97706', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [winner, playWinSound]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-stone-200 font-sans selection:bg-amber-500/30 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl p-6 flex flex-col items-center min-h-screen z-10">
        
        {/* Header */}
        <header className="w-full flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-700 rounded-xl shadow-lg flex items-center justify-center text-2xl font-black text-black">
              A
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white">
                AKONG
              </h1>
              <p className="text-stone-500 text-xs uppercase tracking-widest font-bold mt-1">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            {/* Language Selector */}
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#1a1a1a] text-stone-300 text-xs font-bold uppercase tracking-wider border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
              <option value="fa">FA</option>
              <option value="fr">FR</option>
              <option value="pt">PT</option>
            </select>

            {/* Mode Selector */}
            <select 
              value={gameMode}
              onChange={(e) => {
                setGameMode(e.target.value);
                resetGame();
              }}
              className="bg-[#1a1a1a] text-stone-300 text-xs font-bold uppercase tracking-wider border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="pvp">{t.gameMode.pvp}</option>
              <option value="ai-easy">{t.gameMode.aiEasy}</option>
              <option value="ai-medium">{t.gameMode.aiMedium}</option>
            </select>

            <button 
              onClick={() => setShowTutorial(true)}
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              {t.buttons.tutorial}
            </button>
            <button 
              onClick={resetGame}
              className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-amber-900/20 hover:shadow-amber-600/40"
            >
              {t.buttons.reset}
            </button>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="w-full flex-1 flex flex-col items-center justify-center gap-12">
          
          {/* Score Board */}
          <div className="flex w-full max-w-4xl justify-between items-center px-12">
            {/* Player B Score */}
            <div className={`flex flex-col items-center transition-all duration-500 ${turn === 'B' ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`}>
              <div className="relative">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 drop-shadow-sm">
                  {scores.B}
                </div>
                {turn === 'B' && gameStatus === 'playing' && (
                  <div className="absolute -right-4 -top-2 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
                )}
              </div>
              <div className="mt-2 text-xs font-bold tracking-[0.2em] uppercase text-stone-500">{t.board.player} B</div>
            </div>

            {/* VS Badge */}
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center shadow-xl">
              <span className="text-stone-600 font-black text-xs">{t.board.vs}</span>
            </div>

            {/* Player A Score */}
            <div className={`flex flex-col items-center transition-all duration-500 ${turn === 'A' ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`}>
              <div className="relative">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 drop-shadow-sm">
                  {scores.A}
                </div>
                {turn === 'A' && gameStatus === 'playing' && (
                  <div className="absolute -right-4 -top-2 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
                )}
              </div>
              <div className="mt-2 text-xs font-bold tracking-[0.2em] uppercase text-stone-500">{t.board.player} A</div>
            </div>
          </div>

          {/* Board */}
          <div className="transform transition-all duration-700 hover:scale-[1.01]">
            <Board 
              board={board} 
              turn={turn} 
              onSow={sow} 
              gameStatus={gameStatus}
              t={t}
            />
          </div>

        </main>

        {/* Tutorial Overlay */}
        {showTutorial && (
          <TutorialOverlay onClose={() => setShowTutorial(false)} t={t} />
        )}

        {/* Game Over State */}
        {gameStatus === 'finished' && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
              <div className="bg-stone-900 p-8 rounded-2xl border border-amber-500/30 shadow-2xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold text-amber-500 mb-2">
                  {t.gameOver.title}
                </h2>
                
                <div className="my-6 flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-sm text-stone-400">{t.board.player} A</div>
                    <div className="text-2xl font-bold text-white">{scores.A}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-stone-400">{t.board.player} B</div>
                    <div className="text-2xl font-bold text-white">{scores.B}</div>
                  </div>
                </div>

                <div className="text-xl font-medium text-white mb-8">
                  {winner === 'draw' 
                    ? t.gameOver.draw 
                    : t.gameOver.winner.replace('{player}', winner === 'A' ? 'A' : 'B')}
                </div>

                <button 
                  onClick={resetGame}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold hover:from-amber-500 hover:to-orange-500 transition-all transform hover:scale-[1.02]"
                >
                  {t.buttons.playAgain}
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
