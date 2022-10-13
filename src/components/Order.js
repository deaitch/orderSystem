import {
  collection,
  doc,
  onSnapshot,
  query,
  deleteDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AdvancedDataTable from "./../components/table/AdvancedDataTable";
import UserData from "../feature/CheckAuth";
import { db } from "../feature/firebase";
import OrderDetailModal from "./modals/OrderDetailModal";
import EditOrderModal from "./modals/EditOrderModal";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function Order() {
  const histroy = useHistory();
  const [orderList, setOrderList] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [backupDB, setBackupDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editOrderData, setEditOrderData] = useState([]);
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
          <>
            <button
              className="mr-1 btn btn-outline-success"
              onClick={() => showDetailOrder(record)}
            >
              Detail
            </button>
            <button
              className="mr-1 btn btn-outline-info"
              onClick={() => editOrder(record)}
            >
              Edit
            </button>
            <button
              className="mr-1 btn btn-outline-danger"
              onClick={() => deleteOrder(record)}
            >
              Delete
            </button>
          </>
        ) : (
          ""
        ),
      //   width: "100%",
    },
  ];

  const convertTimeZone = (val) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(val);
  };

  const showOrderList = () => {
    if (UserData) {
      let orders = [];
      const q = query(collection(db, "pendingOrders"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          orders.push({ docID: doc.id, ...doc.data() });
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

          let date1 = convertTimeZone(adate);
          let date2 = convertTimeZone(bdate);
          return new Date(date1) > new Date(date2) ? -1 : 1;
        });
        // let temp = [...orders];
        setOrderList(temp);
      });
      return () => {
        unsub();
      };
    } else {
      histroy.replace({ pathname: "/login" });
    }
  };

  useEffect(() => {
    showOrderList();
  }, []);

  useEffect(() => {
    let tempArr = [];
    for (let i = 0; i < orderList.length; i++) {
      if (!orderList[i].hasOwnProperty("clientSecret")) {
        // let totalPrice = "";
        // if (orderList[i].hasOwnProperty("totalPrice")) {
        //   totalPrice = orderList[i].totalPrice;
        //   totalPrice = parseFloat(totalPrice).toFixed(2);
        // }
        let date = convertTimeZone(orderList[i].orderDate);
        let id = i + 1;
        tempArr.push({
          id: id,
          docID: orderList[i].docID,
          orderDate: date,
          contactNumber: orderList[i].contactNumber,
          name: orderList[i].name,
          orders: orderList[i].order,
          orderNumber: orderList[i].orderNumber,
          orderAmount: orderList[i].order.length,
          orderComment: orderList[i].orderComment,
          totalPrice: orderList[i].totalPrice,
        });
      }
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

  const editOrder = (record) => {
    setEditModal(true);
    setEditOrderData(record);
  };

  const onDeleteOrder = async (record) => {
    setLoading(true);
    const q = query(collection(db, "pendingOrders"));
    try {
      await deleteDoc(doc(q, record.docID)).then(() => {
        toast.success("This order is deleted!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false);
      });
      showOrderList();
    } catch (error) {
      toast.error("Delete Order is failed!. Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const deleteOrder = (record) => {
    confirmAlert({
      title: "This order will be removed!",
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => onDeleteOrder(record),
        },
        {
          label: "No",
          // onClick: () => alert("Click No"),
        },
      ],
    });
  };

  const onHide = () => {
    setDetailModal(false);
    setEditModal(false);
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
          New Order
        </button>
      </div>
      <AdvancedDataTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
      />
      <OrderDetailModal
        orderDetail={orderDetail}
        show={detailModal}
        onHide={() => onHide()}
      />
      <EditOrderModal
        orderOriginData={editOrderData}
        show={editModal}
        onHide={() => onHide()}
        refresh={() => showOrderList()}
      />
    </div>
  );
}

export default Order;
