import { useState, useCallback, useEffect } from 'react';

// Board indices mapping:
// Player A: 0-6 (Left to Right)
// Center 2 (Right): 7
// Player B: 8-14 (Right to Left from A's perspective, but array is linear)
// Center 1 (Left): 15

const INITIAL_SEEDS = 4;
const TOTAL_PITS = 16;
const PLAYER_A_PITS = [0, 1, 2, 3, 4, 5, 6];
const PLAYER_B_PITS = [8, 9, 10, 11, 12, 13, 14];
const CENTER_PITS = [7, 15];

const getInitialBoard = () => {
  const board = Array(TOTAL_PITS).fill(INITIAL_SEEDS);
  board[7] = 0; // Center 2
  board[15] = 0; // Center 1
  return board;
};

export function useAkongGame() {
  const [board, setBoard] = useState(getInitialBoard);
  const [turn, setTurn] = useState('A'); // 'A' or 'B'
  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'finished'
  const [winner, setWinner] = useState(null);
  const [lastSownIndex, setLastSownIndex] = useState(null);
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp', 'ai-easy', 'ai-medium'

  const resetGame = useCallback(() => {
    setBoard(getInitialBoard());
    setTurn('A');
    setScores({ A: 0, B: 0 });
    setGameStatus('playing');
    setWinner(null);
    setLastSownIndex(null);
  }, []);

  const checkWinner = useCallback((currentBoard, currentScores) => {
    const seedsA = PLAYER_A_PITS.reduce((sum, idx) => sum + currentBoard[idx], 0);
    const seedsB = PLAYER_B_PITS.reduce((sum, idx) => sum + currentBoard[idx], 0);

    if (seedsA === 0 || seedsB === 0) {
      let finalScores = { ...currentScores };
      
      if (seedsA === 0) {
        finalScores.B += seedsB;
      } else {
        finalScores.A += seedsA;
      }

      setScores(finalScores);
      setGameStatus('finished');
      
      if (finalScores.A > finalScores.B) setWinner('A');
      else if (finalScores.B > finalScores.A) setWinner('B');
      else setWinner('draw');
      
      const clearedBoard = Array(TOTAL_PITS).fill(0);
      clearedBoard[7] = currentBoard[7];
      clearedBoard[15] = currentBoard[15];
      setBoard(clearedBoard);
      return true; // Game ended
    }
    return false; // Game continues
  }, []);

  const sow = useCallback((index) => {
    if (gameStatus !== 'playing') return;

    const isPlayerA = turn === 'A';
    const validIndices = isPlayerA ? PLAYER_A_PITS : PLAYER_B_PITS;
    
    if (!validIndices.includes(index)) {
      console.warn("Invalid move: Not your pit");
      return;
    }

    if (board[index] === 0) {
      console.warn("Invalid move: Empty pit");
      return;
    }

    let newBoard = [...board];
    let seeds = newBoard[index];
    newBoard[index] = 0;
    
    let currentIndex = index;
    
    while (seeds > 0) {
      currentIndex = (currentIndex + 1) % TOTAL_PITS;
      newBoard[currentIndex]++;
      seeds--;
    }
    
    setLastSownIndex(currentIndex);

    const opponentPits = isPlayerA ? PLAYER_B_PITS : PLAYER_A_PITS;
    let captureIndex = currentIndex;
    let totalCaptured = 0;

    while (opponentPits.includes(captureIndex) && (newBoard[captureIndex] === 2 || newBoard[captureIndex] === 3)) {
      totalCaptured += newBoard[captureIndex];
      newBoard[captureIndex] = 0;
      captureIndex = (captureIndex - 1 + TOTAL_PITS) % TOTAL_PITS;
    }

    const newScores = { ...scores };
    if (totalCaptured > 0) {
      newScores[turn] += totalCaptured;
    }

    setBoard(newBoard);
    setScores(newScores);

    const isGameOver = checkWinner(newBoard, newScores);
    
    if (!isGameOver) {
      setTurn(turn === 'A' ? 'B' : 'A');
    }

  }, [board, turn, scores, gameStatus, checkWinner]);

  // AI Logic
  useEffect(() => {
    if (gameStatus !== 'playing' || turn !== 'B' || gameMode === 'pvp') return;

    const makeAiMove = () => {
      const validMoves = PLAYER_B_PITS.filter(idx => board[idx] > 0);
      
      if (validMoves.length === 0) return; // Should be handled by checkWinner, but safety check

      let selectedMove;

      if (gameMode === 'ai-easy') {
        // Random move
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        selectedMove = validMoves[randomIndex];
      } else {
        // Medium/Hard: Prioritize captures
        // Simple heuristic: Simulate moves and pick the one with most captures
        let bestMove = validMoves[0];
        let maxCaptures = -1;

        for (const move of validMoves) {
          // Simulation (simplified, just checking immediate capture)
          let simBoard = [...board];
          let seeds = simBoard[move];
          simBoard[move] = 0;
          let idx = move;
          while (seeds > 0) {
            idx = (idx + 1) % TOTAL_PITS;
            simBoard[idx]++;
            seeds--;
          }
          
          let captures = 0;
          let cIdx = idx;
          while (PLAYER_A_PITS.includes(cIdx) && (simBoard[cIdx] === 2 || simBoard[cIdx] === 3)) {
            captures += simBoard[cIdx];
            simBoard[cIdx] = 0;
            cIdx = (cIdx - 1 + TOTAL_PITS) % TOTAL_PITS;
          }

          if (captures > maxCaptures) {
            maxCaptures = captures;
            bestMove = move;
          }
        }
        selectedMove = bestMove;
      }

      // Delay for realism
      setTimeout(() => {
        sow(selectedMove);
      }, 1000);
    };

    makeAiMove();
  }, [turn, gameStatus, gameMode, board, sow]);

  return {
    board,
    turn,
    scores,
    gameStatus,
    winner,
    lastSownIndex,
    gameMode,
    setGameMode,
    sow,
    resetGame
  };
}
