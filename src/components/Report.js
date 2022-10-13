import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";

import { DateRangePicker } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import AdvancedDataTable from "./../components/table/AdvancedDataTable";
import UserData from "../feature/CheckAuth";
import { db } from "../feature/firebase";
import {
  arrayRemove,
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

function Report() {
  const columns = [
    {
      title: "#",
      key: "index",
      dataIndex: "id",
    },

    {
      title: "Food Name",
      dataIndex: "name",
      align: "center",
      editTable: true,
      sorter: {
        compare: (a, b) => (a.name > b.name ? 1 : -1),
      },
      //   width: "100%",
    },
    {
      title: "Quentity(ea)",
      dataIndex: "quentity",
      align: "center",
      editTable: true,
      sorter: {
        compare: (a, b) => (a.quentity > b.quentity ? 1 : -1),
      },
      //   width: "100%",
    },
    {
      title: "Weight(kg)",
      dataIndex: "weight",
      align: "center",
      editTable: true,
      sorter: {
        compare: (a, b) => a.weight - b.weight,
      },
      //   width: "100%",
    },
  ];

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openCal, setOpenCal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const convertTimeZone = (val) => {
    const d = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(val);
    return new Date(d);
  };
  const onSearchOrder = () => {
    const start = convertTimeZone(range[0].startDate);
    const end = convertTimeZone(range[0].endDate);
    setOpenCal(false);
    setLoading(true);
    let orders = [];
    const q = query(collection(db, "pendingOrders"));
    let sumDic = [];
    let id = 0;
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        orders.push(doc.data());
      });
      orders.map((item) => {
        if (!item.hasOwnProperty("clientSecret")) {
          const orderDate = convertTimeZone(item.orderDate);
          if (start <= orderDate && orderDate <= end) {
            if (item.order.length) {
              let order = item.order;
              order.map((torder) => {
                let tempOrder = torder.items[0];
                if (
                  tempOrder.quentity != undefined &&
                  tempOrder.weight != undefined
                ) {
                  let quentityTemp = tempOrder.quentity.split(" ");
                  let quentity = quentityTemp[0] ? quentityTemp[0] * 1 : 0;
                  let weightTemp = tempOrder.weight.split(" ");
                  let weight = weightTemp[0] ? weightTemp[0] * 1 : 0;
                  let depend = false;
                  sumDic = sumDic.map((data1) => {
                    if (data1.name == tempOrder.name) {
                      depend = true;
                      return {
                        ...data1,
                        quentity: data1.quentity + quentity,
                        weight: data1.weight + weight,
                      };
                    }
                    return data1;
                  });
                  if (!depend) {
                    id = id + 1;
                    sumDic.push({
                      id: id,
                      name: tempOrder.name,
                      quentity: quentity,
                      weight: weight,
                    });
                  }
                }
              });
            }
          }
        }
      });
      setDataSource(sumDic);
      setLoading(false);
    });
  };
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        fontSize: "18px",
        minHeight: "500px",
      }}
    >
      <Container>
        <Row>
          <Col md={12}>
            <div>
              <label htmlFor="">Date Range: &nbsp;&nbsp;&nbsp;&nbsp;</label>
              <input
                type="text"
                readOnly
                value={`${format(range[0].startDate, "MM/dd/yyyy")} to ${format(
                  range[0].endDate,
                  "MM/dd/yyyy"
                )}`}
                onClick={() => setOpenCal(!openCal)}
                style={{
                  width: "250px",
                  background: "none",
                  backgroundColor: "#272727",
                  textAlign: "center",
                }}
              />

              <button
                type="button"
                className="btn-sm right inc btn btn-outline-secondary"
                style={{
                  width: "150px",
                  background: "none",
                  backgroundColor: "#272727",
                  marginLeft: "100px",
                }}
                onClick={onSearchOrder}
              >
                Search
              </button>
            </div>
          </Col>
          <Col md={12}>
            <div style={{ display: "block" }}>
              {openCal && (
                <DateRangePicker
                  ranges={range}
                  onChange={(item) => setRange([item.selection])}
                  editableDateInputs={true}
                  moveRangeOnFirstSelection={true}
                  months={2}
                  direction="horizontal"
                  className="calendarElement"
                />
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} style={{ marginTop: "30px" }}>
            <AdvancedDataTable
              columns={columns}
              dataSource={dataSource}
              loading={loading}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Report;
