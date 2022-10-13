import React, { useState, useEffect } from "react";
import { Table } from "antd";

function AdvancedDataTable(props) {
  const data = [
    {
      id: 1,
      name: "my name",
      email: "myemail@gmail.com",
    },
  ];
  return (
    <div>
      <Table
        columns={props.columns}
        dataSource={props.dataSource}
        bordered
        loading={props.loading}
        pagination={{ showSizeChanger: true }}
        // rowKey="id"
      />
    </div>
  );
}

export default AdvancedDataTable;
