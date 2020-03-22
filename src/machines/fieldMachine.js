import { Machine, assign } from 'xstate';
import { uncoverCell, generateEmptyField, plantMines } from '../utils';

const fieldMachine = Machine(
  {
    id: 'field-machine',
    context: {
      field: [],
      uncoveredCells: {},
      mines: 10,
      score: 0,
    },
    initial: 'initializing',
    states: {
      initializing: {
        entry: assign({
          field: ctx => generateEmptyField(ctx.mines - 2),
        }),
        on: {
          'CELL.UNCOVER': [
            { target: 'playing', actions: ['plantMines', 'uncover'] },
          ],
        },
      },
      playing: {
        invoke: {
          src: _ctx => cb => {
            const interval = setInterval(() => {
              cb('COUNT_SCORE');
            }, 1000);
            return () => clearInterval(interval);
          },
        },
        on: {
          '': [{ target: 'gameover.winner', cond: 'isWinner' }],
          COUNT_SCORE: {
            actions: assign({
              score: ctx => ctx.score + 1,
            }),
          },
          'CELL.UNCOVER': [
            { target: 'gameover.loser', cond: 'isLoser' },
            { actions: ['uncover'], cond: 'isCovered' },
          ],
        },
      },
      gameover: {
        initial: 'unknown',
        states: {
          unknown: {},
          winner: {},
          loser: {},
        },
        on: {
          'CELL.UNCOVER': null,
          NEW_GAME: {
            actions: assign((ctx, e) => ({
              field: generateEmptyField(ctx.mines - 2),
              uncoveredCells: {},
            })),
            target: 'initializing',
          },
        },
      },
    },
  },
  {
    actions: {
      plantMines: assign({
        field: (ctx, e) =>
          plantMines(ctx.field, ctx.mines, e.position.row, e.position.col),
      }),
      uncover: assign({
        uncoveredCells: (ctx, e) => {
          const { row, col } = e.position;
          const uncoveredCells = uncoverCell(ctx.field, row, col);
          return {
            ...ctx.uncoveredCells,
            ...uncoveredCells,
          };
        },
      }),
    },
    guards: {
      isWinner: ({ uncoveredCells, field, mines }) => {
        return (
          Object.keys(uncoveredCells).length ===
          field.length * field[0].length - mines
        );
      },
      isLoser: (ctx, e) => ctx.field[e.position.row][e.position.col] === 1,
      isCovered: (ctx, e) =>
        ctx.uncoveredCells[`${e.position.row}${e.position.col}`] === undefined,
    },
  }
);

export default fieldMachine;
