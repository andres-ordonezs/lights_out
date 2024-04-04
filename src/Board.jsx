import React, {useState} from "react";
import Cell from "./Cell";
import {random} from "lodash";
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
function Board({nrows, ncols, chanceLightStartsOn}) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let row = 0; row < nrows; row++) {
      const newRow = [];
      // TODO: Use chanceLightStartsoN prop
      for (let column = 0; column < ncols; column++) {
        newRow.push(random(0, 1) ? true : false);
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

  // if the game is won, just show a winning msg & render nothing else
  /*  if (hasWon()) {
    return (
      <div>
        "You Won!"
      </div>
    );
  } */
  // TODO: rEFACTOR RETURN STATEMENT
  return (
    <div className="Board">
      {hasWon() ? (
        "You won!"
      ) : (
        <table className="Board-table">
          <tbody>
            {board.map((cellRow, row) => (
              <tr key={`row-${row}`}>
                {cellRow.map((cellState, col) => (
                  <Cell
                    key={`${row}-${col}`}
                    isLit={cellState}
                    flipCellsAroundMe={() => flipCellsAround(`${row}-${col}`)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Board;
