import React, { useState, useEffect } from 'react';
import { useMachine, useService } from '@xstate/react';

import fieldMachine from './machines/fieldMachine';

const Cell = ({ cellRef }) => {
  const [state, send] = useService(cellRef);
  const { value, xPos, yPos, isCovered } = state.context;

  return (
    <div
      className="cell"
      key={`${xPos}-${yPos}`}
      onClick={() => send('UNCOVER')}
      data-is-covered={isCovered}
    >
      {value}
    </div>
  );
};

const App = () => {
  const [state, send] = useMachine(fieldMachine);
  const { field, score } = state.context;

  if (state.matches('gameover')) {
    return <div>You died</div>;
  }

  return (
    <div>
      <h1>Mine Sweeper</h1>
      <span>Score: {score}</span>
      <div className="field">
        {field.map(row =>
          row.map(cell => (
            <Cell key={`${cell.xPos}:${cell.yPos}`} cellRef={cell.ref} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
