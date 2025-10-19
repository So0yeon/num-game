import React, { useState, useEffect } from 'react';

const NumberBlockGame = () => {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [currentSum, setCurrentSum] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // 초기 그리드 생성
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        row.push({
          value: Math.floor(Math.random() * 9) + 1,
          row: i,
          col: j,
          id: `${i}-${j}`
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  const isAdjacent = (cell1, cell2) => {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const handleMouseDown = (cell) => {
    setIsDrawing(true);
    setSelected([cell]);
    setCurrentSum(cell.value);
  };

  const handleMouseEnter = (cell) => {
    if (!isDrawing) return;
    
    const lastSelected = selected[selected.length - 1];
    
    // 이미 선택된 블록인지 확인
    if (selected.some(s => s.id === cell.id)) return;
    
    // 인접한 블록인지 확인
    if (!isAdjacent(lastSelected, cell)) return;
    
    const newSum = currentSum + cell.value;
    
    // 합이 10을 초과하면 선택 불가
    if (newSum > 10) return;
    
    setSelected([...selected, cell]);
    setCurrentSum(newSum);
  };

  const handleMouseUp = () => {
    if (currentSum === 10 && selected.length > 0) {
      // 블록 제거 및 점수 추가
      setScore(score + selected.length * 10);
      
      // 선택된 블록들을 새로운 숫자로 교체
      const newGrid = grid.map(row => [...row]);
      selected.forEach(cell => {
        newGrid[cell.row][cell.col] = {
          value: Math.floor(Math.random() * 9) + 1,
          row: cell.row,
          col: cell.col,
          id: cell.id
        };
      });
      setGrid(newGrid);
    }
    
    setIsDrawing(false);
    setSelected([]);
    setCurrentSum(0);
  };

  const isSelected = (cell) => {
    return selected.some(s => s.id === cell.id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">숫자 블록 게임</h1>
        <p className="text-center text-gray-600 mb-6">블록을 연결해서 합이 10을 만드세요!</p>
        
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">
            점수: <span className="text-3xl">{score}</span>
          </div>
          <div className="text-xl font-semibold">
            현재 합: <span className={`text-2xl ${currentSum === 10 ? 'text-green-600' : currentSum > 10 ? 'text-red-600' : 'text-blue-600'}`}>
              {currentSum}
            </span>
          </div>
        </div>

        <div 
          className="grid grid-cols-8 gap-2 mb-6 select-none"
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, i) => (
            row.map((cell, j) => (
              <div
                key={cell.id}
                className={`
                  aspect-square flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer
                  transition-all duration-200 transform
                  ${isSelected(cell) 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-110 shadow-lg' 
                    : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white hover:scale-105 hover:shadow-md'
                  }
                `}
                onMouseDown={() => handleMouseDown(cell)}
                onMouseEnter={() => handleMouseEnter(cell)}
                onMouseUp={handleMouseUp}
              >
                {cell.value}
              </div>
            ))
          ))}
        </div>

        <div className="text-center space-y-2 text-gray-600">
          <p className="text-sm">💡 마우스로 드래그하여 인접한 블록을 연결하세요</p>
          <p className="text-sm">✨ 합이 정확히 10이 되면 블록이 깨집니다</p>
          <button
            onClick={initializeGrid}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-md"
          >
            새 게임
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumberBlockGame;
