import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementTimer } from "../store/reducer";
import Form from "./Form";
import Table from "./Table";

export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0, // 0 이상이면 다 opened
};

const MineSearch = () => {
  const halted = useSelector((state) => state.halted);
  const timer = useSelector((state) => state.timer);
  const result = useSelector((state) => state.result);
  const dispatch = useDispatch();
  
  useEffect(() => {
    let interval;
    if (halted === false) {
      interval = setInterval(() => {
        dispatch(incrementTimer());
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [halted, dispatch]);

  return (
    <div>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </div>
  );
};

export default MineSearch;
