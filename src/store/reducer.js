import { createSlice } from "@reduxjs/toolkit";
import { CODE } from "../components/MineSearch";

const plantMine = (row, cell, mine) => {
  const candidate = Array(row * cell)
    .fill()
    .map((arr, i) => {
      return i;
    });
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(
      Math.floor(Math.random() * candidate.length),
      1
    )[0];
    shuffle.push(chosen);
  }
  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }

  return data;
};

const initialState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: "",
  halted: true,
  openedCount: 0,
};

const slice = createSlice({
  name: "main",
  initialState,
  reducers: {
    startGame(state, action) {
      state.data = action.payload;
      state.openedCount = 0;
      state.tableData = plantMine(
        action.payload.row,
        action.payload.cell,
        action.payload.mine
      );
      state.halted = false;
      state.timer = 0;
    },
    openCell(state, action) {
      let halted = false;
      let result = "";
      if (
        state.data.row * state.data.cell - state.data.mine ===
        state.openedCount + action.payload.openedCount
      ) {
        // 승리
        halted = true;
        result = `${state.timer}초만에 승리하셨습니다`;
      }
      state.result = result;
      state.halted = halted;
      state.openedCount = state.openedCount + action.payload.openedCount;
      state.tableData = action.payload.tableData;
    },
    clickMine(state, action) {
      state.tableData[action.payload.rowIndex][action.payload.cellIndex] =
        CODE.CLICKED_MINE;
      state.halted = true;
    },
    flagCell(state, action) {
      if (
        state.tableData[action.payload.rowIndex][action.payload.cellIndex] ===
        CODE.MINE
      ) {
        state.tableData[action.payload.rowIndex][action.payload.cellIndex] =
          CODE.FLAG_MINE;
      } else {
        state.tableData[action.payload.rowIndex][action.payload.cellIndex] =
          CODE.FLAG;
      }
    },
    questionCell(state, action) {
      if (
        state.tableData[action.payload.rowIndex][action.payload.cellIndex] ===
        CODE.FLAG_MINE
      ) {
        state.tableData[action.payload.rowIndex][action.payload.cellIndex] =
          CODE.QUESTION_MINE;
      } else {
        state.tableData[action.payload.rowIndex][action.payload.cellIndex] =
          CODE.QUESTION;
      }
    },
    normalizeCell(state, action) {
      if (
        state.tableData[action.payload.rowIndex][action.payload.cellIndex] ===
        CODE.QUESTION_MINE
      ) {
        state.tableData[action.payload.rowIndex][action.payload.cellIndex] =
          CODE.MINE;
      } else {
        state.tableData[action.payload.rowIndex][action.payload.cellIndex] =
          CODE.NORMAL;
      }
    },
    incrementTimer(state) {
      state.timer += 1;
    },
  },
});

export const {
  startGame,
  openCell,
  clickMine,
  flagCell,
  questionCell,
  normalizeCell,
  incrementTimer,
} = slice.actions;
export default slice.reducer;
