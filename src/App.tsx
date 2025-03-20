import { useState } from 'react';
import { Github, RotateCcw } from 'lucide-react';

function Square({ value, onSquareClick }: { value: string | null; onSquareClick: () => void }) {
  return (
    <button
      className={`square h-20 w-20 border-2 border-indigo-200 text-4xl font-bold 
        ${value === 'X' ? 'text-indigo-600' : 'text-pink-500'}
        hover:bg-indigo-50 transition-colors duration-200`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({
  xIsNext,
  squares,
  onPlay
}: {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
}) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : squares.every(square => square)
      ? "It's a draw!"
      : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-semibold text-gray-700 mb-2">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {Array(9).fill(null).map((_, i) => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((_, move) => {
    const description = move === 0 ? 'Game start' : `Move #${move}`;
    const isCurrentMove = move === currentMove;

    return (
      <li key={move} className="mb-2">
        <button
          onClick={() => jumpTo(move)}
          className={`px-4 py-2 rounded-md text-sm transition-colors duration-200
            ${isCurrentMove
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Tic Tac Toe</h1>
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start justify-center">
          <div className="game-board bg-white p-8 rounded-xl shadow-lg">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            <button
              onClick={resetGame}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 
                hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
            >
              <RotateCcw size={18} />
              Reset Game
            </button>
          </div>
          <div className="game-info bg-white p-8 rounded-xl shadow-lg min-w-[200px]">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Game History</h2>
            <ol className="space-y-2">{moves}</ol>
          </div>
        </div>
      </div>
      <footer className="mt-12 text-center">
      <a
        href="https://github.com/aravind-manoj/Tic-Tac-Toe"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <Github size={20} />
        <span>Aravind Manoj</span>
      </a>
      </footer>
    </div>
  );
}