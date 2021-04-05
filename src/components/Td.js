import React, { useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openCell,
  clickMine,
  flagCell,
  questionCell,
  normalizeCell,
} from "../store/reducer";
import { CODE } from "./MineSearch";

const getTdStyle = (code) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE:
      return {
        background: "#444",
      };
    case CODE.CLICKED_MINE:
    case CODE.OPENED:
      return {
        background: "white",
      };
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return {
        background: "yellow",
      };
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return {
        background: "red",
      };
    default:
      return {
        background: "white",
      };
  }
};

const getTdText = (code) => {
  switch (code) {
    case CODE.NORMAL:
      return "";
    case CODE.MINE:
      return "X";
    case CODE.CLICKED_MINE:
      return "펑";
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return "!";
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return "?";
    default:
      return code || "";
  }
};

const Td = memo(({ rowIndex, cellIndex }) => {
  const tableData = useSelector((state) => state.tableData);
  const halted = useSelector((state) => state.halted);
  const dispatch = useDispatch();
  const checkAroundWrap = useCallback(
    (rowIndex, cellIndex) => {
      const _tableData = [...tableData];
      _tableData.forEach((row, i) => {
        _tableData[i] = [...row];
      });

      const checked = [];
      let openedCount = 0;

      const checkAround = (row, cell) => {
        if (
          row < 0 ||
          row >= _tableData.length ||
          cell < 0 ||
          cell >= _tableData[0].length
        ) {
          return;
        } // 상하좌우 없는칸은 안 열기
        if (
          [
            CODE.OPENED,
            CODE.FLAG,
            CODE.FLAG_MINE,
            CODE.QUESTION_MINE,
            CODE.QUESTION,
          ].includes(_tableData[row][cell])
        ) {
          return;
        } // 닫힌 칸만 열기
        if (checked.includes(row + "/" + cell)) {
          return;
        } else {
          checked.push(row + "/" + cell);
        } // 한 번 연칸은 무시하기
        let around = [_tableData[row][cell - 1], _tableData[row][cell + 1]];
        if (_tableData[row - 1]) {
          around = around.concat([
            _tableData[row - 1][cell - 1],
            _tableData[row - 1][cell],
            _tableData[row - 1][cell + 1],
          ]);
        }
        if (_tableData[row + 1]) {
          around = around.concat([
            _tableData[row + 1][cell - 1],
            _tableData[row + 1][cell],
            _tableData[row + 1][cell + 1],
          ]);
        }
        const count = around.filter(function (v) {
          return [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v);
        }).length;
        if (count === 0) {
          // 주변칸 오픈
          if (row > -1) {
            const near = [];
            if (row - 1 > -1) {
              near.push([row - 1, cell - 1]);
              near.push([row - 1, cell]);
              near.push([row - 1, cell + 1]);
            }
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            if (row + 1 < _tableData.length) {
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }
            near.forEach((n) => {
              if (_tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkAround(n[0], n[1]);
              }
            });
          }
        }
        if (_tableData[row][cell] === CODE.NORMAL) {
          // 내 칸이 닫힌 칸이면 카운트 증가
          openedCount += 1;
        }
        _tableData[row][cell] = count;
      };
      checkAround(rowIndex, cellIndex);
      return {
        tableData: _tableData,
        openedCount,
      };
    },
    [tableData]
  );

  const onClickTd = useCallback(() => {
    if (halted) {
      return;
    }
    switch (tableData[rowIndex][cellIndex]) {
      case CODE.OPENED:
      case CODE.FLAG_MINE:
      case CODE.FLAG:
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return;
      case CODE.NORMAL:
        dispatch(openCell(checkAroundWrap(rowIndex, cellIndex)));
        return;
      case CODE.MINE:
        dispatch(clickMine({ rowIndex, cellIndex }));
        return;
      default:
        return;
    }
  }, [dispatch, checkAroundWrap, tableData, rowIndex, cellIndex, halted]);

  const onRightClickTd = useCallback(
    (e) => {
      e.preventDefault();
      if (halted) {
        return;
      }
      switch (tableData[rowIndex][cellIndex]) {
        case CODE.NORMAL:
        case CODE.MINE:
          dispatch(flagCell({ rowIndex, cellIndex }));
          return;
        case CODE.FLAG_MINE:
        case CODE.FLAG:
          dispatch(questionCell({ rowIndex, cellIndex }));
          return;
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
          dispatch(normalizeCell({ rowIndex, cellIndex }));
          return;
        default:
          return;
      }
    },
    [dispatch, tableData, rowIndex, cellIndex, halted]
  );
  return (
    <RealTd
      onClickTd={onClickTd}
      onRightClickTd={onRightClickTd}
      data={tableData[rowIndex][cellIndex]}
    />
  );
});

const RealTd = memo(({ onClickTd, onRightClickTd, data }) => {
  return (
    <td
      style={getTdStyle(data)}
      onClick={onClickTd}
      onContextMenu={onRightClickTd}
    >
      {getTdText(data)}
    </td>
  );
});

export default Td;
