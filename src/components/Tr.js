import React from "react";
import { useSelector } from "react-redux";
import Td from "./Td";

const Tr = ({ rowIndex }) => {
  const tableData = useSelector((state) => state.tableData);
  return (
    <tr>
      {tableData[0] &&
        Array(tableData[0].length)
          .fill()
          .map((td, i) => <Td rowIndex={rowIndex} cellIndex={i} />)}
    </tr>
  );
};

export default Tr;
