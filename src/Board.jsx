import React, { useState } from "react";
import Cell from "./Cell";
import { random } from "lodash";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/
// TODO: Set defaults for size
function Board({ nrows = 4, ncols = 4, chanceLightStartsOn = 0.30 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let row = 0; row < nrows; row++) {
      const newRow = [];
      for (let column = 0; column < ncols; column++) {
        newRow.push(random(0, 1, true) > chanceLightStartsOn ? false : true);
      }

      initialBoard.push(newRow);
    }

    return initialBoard;
  }

  /**
   * Checks if all cells are false
   */
  function hasWon() {
    return board.every((row) => row.every((col) => !col));
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = oldBoard.map((a) => [...a]);

      flipCell(y, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);

      return boardCopy;
    });
  }

  const boardTable = [];
  for (let row = 0; row < nrows; row++) {
    let newRow = [];
    for (let col = 0; col < ncols; col++) {
      newRow.push(
        <Cell
          key={`${row}-${col}`}
          isLit={board[row][col]}
          flipCellsAroundMe={() => flipCellsAround(`${row}-${col}`)}
        />
      );
    }
    boardTable.push(<tr key={`row-${row}`}>{newRow}</tr>);
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (
      <div>
        "You Won!"
      </div>
    );
  }
  // TODO: rEFACTOR RETURN STATEMENT
  return (
    <div>
      <table>
        <tbody>
          {boardTable}
        </tbody>
      </table>
    </div>
  );
}

export default Board;
