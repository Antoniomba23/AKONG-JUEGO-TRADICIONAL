import { useCallback, useRef, useEffect } from 'react';

export function useGameSounds() {
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction (browser policy)
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const playTone = useCallback((frequency, type, duration, volume = 0.1) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  // Procedural Wood/Seed Sound
  const playMoveSound = useCallback(() => {
    // Simulate a wooden "clack" using a short, low-frequency sine/triangle wave with quick decay
    // A bit of randomness for realism
    const pitch = 200 + Math.random() * 50;
    playTone(pitch, 'triangle', 0.1, 0.15);
    // Add a higher "click" component
    playTone(pitch * 2.5, 'sine', 0.05, 0.05);
  }, [playTone]);

  const playCaptureSound = useCallback(() => {
    // A more distinct, slightly higher sound for capture
    playTone(400, 'sine', 0.2, 0.2);
    setTimeout(() => playTone(600, 'sine', 0.3, 0.1), 100);
  }, [playTone]);

  const playWinSound = useCallback(() => {
    // A simple major arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
    notes.forEach((note, i) => {
      setTimeout(() => playTone(note, 'sine', 0.5, 0.2), i * 150);
    });
  }, [playTone]);

  return { playMoveSound, playCaptureSound, playWinSound };
}
