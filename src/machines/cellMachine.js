import { Machine, assign, sendParent } from 'xstate';

const cellMachine = Machine({
  id: 'cell',
  context: {
    isCovered: true,
    value: 0,
    xPos: null,
    yPos: null,
  },
  initial: 'covered',
  states: {
    covered: {
      on: {
        UNCOVER: {
          target: 'uncovered',
          actions: [
            assign({ isCovered: false }),
            sendParent(ctx => ({ type: 'CELL.UNCOVERED', cell: ctx })),
          ],
        },
      },
    },
    uncovered: {},
  },
});

export default cellMachine;
