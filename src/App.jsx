import React from 'react';
import { useMachine } from '@xstate/react';
import classNames from 'classnames';

import fieldMachine from './machines/fieldMachine';

const App = () => {
  const [state, send] = useMachine(fieldMachine);
  const { field, score, uncoveredCells } = state.context;

  return (
    <div data-state={state.toStrings()}>
      <h1>Mine Sweeper</h1>
      {state.matches('gameover.loser') && <h1>You died</h1>}
      {state.matches('gameover.winner') && <h1>You won!</h1>}
      {state.matches('gameover') && (
        <button onClick={() => send('NEW_GAME')}>New Game</button>
      )}
      <span>Score: {score.toString().padStart(3, '0')}</span>
      <div className="field">
        {field.map((row, nRow) =>
          row.map((value, nCol) => {
            let id = `${nRow}${nCol}`;
            return (
              <div
                key={id}
                className={classNames('cell', {
                  'is-covered': !(id in uncoveredCells),
                  'is-mine': value === 1 && state.matches('gameover'),
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
