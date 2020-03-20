import { Machine, assign } from 'xstate';
import { uncoverCell } from '../utils';

const fieldMachine = Machine(
  {
    id: 'field-machine',
    context: {
      field: [],
      uncoveredCells: {},
      mines: 8,
      score: 0,
    },
    initial: 'initializing',
    states: {
      initializing: {},
      playing: {
        on: {
          '': [{ target: 'winner', cond: 'isWinner' }],
        },
        // activities: ['counting'],
      },
      winner: {
        on: {
          'CELL.UNCOVER': null,
        },
      },
      gameover: {
        on: {
          'CELL.UNCOVER': null,
          NEW_GAME: {
            actions: assign((_ctx, e) => ({
              field: e.field,
              uncoveredCells: {},
            })),
            target: 'initializing',
          },
        },
      },
    },
    on: {
      'CELL.UNCOVER': [
        { target: '.gameover', cond: 'isGameOver' },
        { target: 'playing', actions: ['uncover'], cond: 'isCovered' },
      ],
    },
  },
  {
    actions: {
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
    // activities: {
    // counting: ctx => {
    //   const interval = setInterval(() => {
    //     send('COUNT_SCORE');
    //   }, 1000);
    //   return () => clearInterval(interval);
    // },
    // },
    guards: {
      isWinner: ({ uncoveredCells, field, mines }) => {
        return (
          Object.keys(uncoveredCells).length ===
          field.length * field[0].length - mines
        );
      },
      isCovered: (ctx, e) =>
        ctx.uncoveredCells[`${e.position.row}${e.position.col}`] === undefined,
      isGameOver: (ctx, e) => ctx.field[e.position.row][e.position.col] === 1,
    },
  }
);

export default fieldMachine;
