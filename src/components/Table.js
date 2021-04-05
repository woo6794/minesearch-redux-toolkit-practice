import React from "react";
import { useSelector } from "react-redux";
import Tr from "./Tr";

const Table = () => {
  const tableData = useSelector((state) => state.tableData);
  return (
    <table>
      {Array(tableData.length)
        .fill()
        .map((tr, i) => (
          <Tr rowIndex={i} />
        ))}
    </table>
  );
};

export default Table;
