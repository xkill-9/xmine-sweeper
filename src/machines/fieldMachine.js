import { Machine, send, assign, spawn } from 'xstate';
import cellMachine from './cellMachine';

const fieldMachine = Machine(
  {
    id: 'field-machine',
    context: {
      field: [
        [0, 1, -1],
        [0, 1, 1],
        [0, 0, 0],
      ],
      score: 0,
    },
    initial: 'initializing',
    states: {
      initializing: {
        entry: assign({
          field: ctx => {
            return ctx.field.map((row, xPos) =>
              row.map((value, yPos) => ({
                value,
                xPos,
                yPos,
                ref: spawn(
                  cellMachine.withContext({
                    ...cellMachine.context,
                    value,
                    xPos,
                    yPos,
                  })
                ),
              }))
            );
          },
        }),
      },
      playing: {
        initial: 'idle',
        states: {
          idle: {},
          uncovering: {},
        },
        activities: ['counting'],
      },
      gameover: {},
    },
    on: {
      'CELL.UNCOVERED': [
        { target: '.gameover', cond: 'isGameOver' },
        { target: 'playing.idle', cond: 'isTurnOver' },
        {
          actions: (ctx, e) => {
            if (e.cell && e.cell.xPos >= 0 && e.cell.yPos >= 0) {
              const { xPos, yPos } = e.cell;
              let xStart = xPos - 1;
              let yStart = yPos - 1;

              for (let neighborX = xStart; neighborX <= xPos + 1; neighborX++) {
                for (
                  let neighborY = yStart;
                  neighborY <= yPos + 1;
                  neighborY++
                ) {
                  if (
                    ctx.field[neighborX] !== undefined &&
                    ctx.field[neighborX][neighborY] !== undefined &&
                    ctx.field[neighborX][neighborY].value !== -1 &&
                    !(neighborX === xPos && neighborY === yPos)
                  ) {
                    ctx.field[neighborX][neighborY].ref.send('UNCOVER'); // send uncover event to neighbors
                  }
                }
              }
            }
          },
          cond: 'isEmpty',
        },
      ],
    },
  },
  {
    activities: {
      counting: ctx => {
        const interval = setInterval(() => {
          assign({ score: ctx => ctx.score + 1 });
        }, 1000);

        return () => clearInterval(interval);
      },
    },
    guards: {
      isTurnOver: (_ctx, e) => e.cell && e.cell.value > 0,
      isGameOver: (_ctx, e) => e.cell && e.cell.value === -1,
      isEmpty: (_ctx, e) => e.cell && e.cell.value === 0,
    },
  }
);

export default fieldMachine;
