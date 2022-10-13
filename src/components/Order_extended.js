import {
  arrayRemove,
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AdvancedDataTable from "./../components/table/AdvancedDataTable";
import UserData from "../feature/CheckAuth";
import { db } from "../feature/firebase";
import OrderDetailModal from "./modals/OrderDetailModal";

function Order() {
  const histroy = useHistory();
  const [orderList, setOrderList] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [backupDB, setBackupDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState([]);
  const columns = [
    {
      title: "#",
      key: "index",
      dataIndex: "id",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      align: "center",
      editTable: true,
      // sorter: {
      //   compare: (a, b) => b.orderDate - a.orderDate,
      // },
      //   width: "100%",
    },
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      align: "center",
      editTable: true,
      sorter: {
        compare: (a, b) => b.orderNumber - a.orderNumber,
      },
      //   width: "100%",
    },
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      editTable: true,
      sorter: {
        compare: (a, b) => (a.name > b.name ? 1 : -1),
      },
      //   width: "100%",
    },
    {
      title: "Order Amount",
      dataIndex: "orderAmount",
      align: "center",
      editTable: true,
      sorter: {
        compare: (a, b) => a.orderAmount - b.orderAmount,
      },
      //   width: "100%",
    },
    {
      title: "Order Comment",
      dataIndex: "orderComment",
      align: "center",
      editTable: true,
      //   width: "100%",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      align: "center",
      editTable: true,
      //   width: "100%",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      align: "center",
      editTable: true,
      //   width: "100%",
    },
    {
      title: "Detail",
      align: "center",
      editTable: true,
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <button
            className="mr-1 btn btn-outline-info"
            onClick={() => showDetailOrder(record)}
          >
            Detail{" "}
          </button>
        ) : (
          ""
        ),
      //   width: "100%",
    },
  ];
  useEffect(() => {
    if (UserData) {
      let orders = [];
      const q = query(collection(db, "pendingOrders"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          orders.push(doc.data());
        });
        let temp = [...orders].sort(function (a, b) {
          let adate = "";
          let bdate = "";
          if (a.hasOwnProperty("orderDate")) {
            adate = a.orderDate;
          } else {
            adate = a.orderTime;
          }
          if (b.hasOwnProperty("orderDate")) {
            bdate = b.orderDate;
          } else {
            bdate = b.orderTime;
          }

          let date1 = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(adate);
          let date2 = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(bdate);
          return new Date(date1) > new Date(date2) ? -1 : 1;
        });
        // let temp = [...orders];
        setOrderList(temp);
        console.log(temp);
      });
      return () => {
        unsub();
      };
    } else {
      histroy.replace({ pathname: "/login" });
    }
  }, []);

  useEffect(() => {
    let tempArr = [];
    for (let i = 0; i < orderList.length; i++) {
      let orderDate = "";
      if (orderList[i].hasOwnProperty("orderDate")) {
        orderDate = orderList[i].orderDate;
      } else {
        orderDate = orderList[i].orderTime;
      }

      let clientSecret = "";
      if (orderList[i].hasOwnProperty("clientSecret")) {
        clientSecret = orderList[i].clientSecret;
      }

      let orderNumber = "";
      if (orderList[i].hasOwnProperty("orderNumber")) {
        orderNumber = orderList[i].orderNumber;
      } else {
        orderNumber = orderList[i].orderNum;
      }
      let status = "";
      if (orderList[i].hasOwnProperty("status")) {
        status = orderList[i].status;
      }

      let submitTime = "";
      if (orderList[i].hasOwnProperty("submitTime")) {
        submitTime = orderList[i].submitTime;
      }

      let token = "";
      if (orderList[i].hasOwnProperty("token")) {
        token = orderList[i].token;
      }

      let totalPrice = "";
      if (orderList[i].hasOwnProperty("totalPrice")) {
        totalPrice = orderList[i].totalPrice;
        totalPrice = parseFloat(totalPrice).toFixed(2);
      }

      let date = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(orderDate);

      let id = i + 1;

      tempArr.push({
        id: id,
        orderDate: date,
        clientSecret: clientSecret,
        contactNumber: orderList[i].contactNumber,
        name: orderList[i].name,
        orders: orderList[i].order,
        orderNumber: orderNumber,
        orderAmount: orderList[i].order.length,
        orderComment: orderList[i].orderComment,
        status: status,
        submitTime: submitTime,
        token: token,
        totalPrice: totalPrice,
      });
    }
    setDataSource(tempArr);
    setBackupDB(tempArr);
    setLoading(false);
  }, [orderList]);

  const onSearch = (val) => {
    setSearchVal(val);
    setDataSource(backupDB);
    if (val) {
      val = val.toLowerCase();
      let temp = backupDB.filter((value) => {
        return (
          value.orderDate.includes(val) ||
          value.contactNumber.includes(val) ||
          value.name.toLowerCase().includes(val)
          //   value.orderNumber.includes(val)
          //   value.orderAmount.includes(val) ||
          //   value.orderComment.toLowerCase().includes(val) ||
          //   value.totoalPrice.includes(val)
        );
      });
      setDataSource(temp);
    } else {
      setDataSource(backupDB);
    }
  };

  const showDetailOrder = (record) => {
    setDetailModal(true);
    setOrderDetail(record);
  };

  const onHide = () => {
    setDetailModal(false);
  };

  const newOrder = () => {
    histroy.replace({ pathname: "/offers" });
  };

  return (
    <div
      style={{
        margin: "auto",
        padding: "30px",
        fontSize: "17px",
      }}
    >
      <div
        style={{
          display: "inline-block",
          float: "right",
          padding: "0px",
          marginBottom: "15px",
        }}
      >
        <input
          className="search_input"
          placeholder="Search for..."
          type="text"
          value={searchVal}
          onChange={(e) => onSearch(e.target.value)}
        />
        <button
          style={{ marginRight: "30px", marginLeft: "15px" }}
          className="mr-1 btn btn-info"
          onClick={newOrder}
        >
          New Order{" "}
        </button>{" "}
      </div>{" "}
      <AdvancedDataTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
      />{" "}
      <OrderDetailModal
        orderDetail={orderDetail}
        show={detailModal}
        onHide={() => onHide()}
      />{" "}
    </div>
  );
}

export default Order;
