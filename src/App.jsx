import React from 'react';
import { useMachine } from '@xstate/react';
import classNames from 'classnames';

import { generateEmptyField, plantMines } from './utils';
import fieldMachine from './machines/fieldMachine';

const App = () => {
  const [state, send] = useMachine(
    fieldMachine.withContext({
      ...fieldMachine.context,
      field: plantMines(generateEmptyField(8), 8),
    })
  );
  const { field, score, uncoveredCells } = state.context;

  return (
    <div data-state={state.value}>
      <h1>Mine Sweeper</h1>
      {state.matches('gameover') && <h1>You died</h1>}
      {state.matches('winner') && <h1>You won!</h1>}
      {state.matches('gameover') && (
        <button
          onClick={() =>
            send({
              type: 'NEW_GAME',
              field: plantMines(generateEmptyField(8), 8),
            })
          }
        >
          New Game
        </button>
      )}
      <span>Score: {score}</span>
      <div className="field">
        {field.map((row, nRow) =>
          row.map((value, nCol) => {
            let id = `${nRow}${nCol}`;
            return (
              <div
                key={id}
                className={classNames('cell', {
                  'is-covered': !(id in uncoveredCells),
                  'is-mine':
                    value === 1 &&
                    (state.matches('gameover') || state.matches('winner')),
                })}
                onClick={() =>
                  send({
                    type: 'CELL.UNCOVER',
                    position: { row: nRow, col: nCol },
                  })
                }
              >
                {uncoveredCells[id]}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default App;
