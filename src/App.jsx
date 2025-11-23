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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

      <div className="relative mx-auto max-w-7xl p-2 md:p-4 flex flex-col items-center min-h-screen z-10">
        
        {/* Header */}
        <header className="w-full flex items-center justify-between mb-2 md:mb-4 border-b border-white/5 pb-3 md:pb-4 relative">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-orange-700 rounded-xl shadow-lg flex items-center justify-center text-xl md:text-2xl font-black text-black">
              A
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                AKONG
              </h1>
              <p className="text-stone-500 text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 hidden md:block">{t.subtitle}</p>
            </div>
          </div>
          
          {/* Desktop Controls */}
          <div className="hidden md:flex gap-3 items-center">
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

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-5 duration-200">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Idioma</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#252525] text-stone-300 text-sm font-bold uppercase tracking-wider border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fa">Fang</option>
                  <option value="fr">Français</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Modo de Juego</label>
                <select 
                  value={gameMode}
                  onChange={(e) => {
                    setGameMode(e.target.value);
                    resetGame();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-[#252525] text-stone-300 text-sm font-bold uppercase tracking-wider border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
                >
                  <option value="pvp">{t.gameMode.pvp}</option>
                  <option value="ai-easy">{t.gameMode.aiEasy}</option>
                  <option value="ai-medium">{t.gameMode.aiMedium}</option>
                </select>
              </div>

              <hr className="border-white/5 my-1" />

              <button 
                onClick={() => {
                  setShowTutorial(true);
                  setIsMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-bold uppercase tracking-wider text-sm transition-all"
              >
                {t.buttons.tutorial}
              </button>
            </div>
          )}
        </header>

        {/* Main Game Area */}
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          
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
