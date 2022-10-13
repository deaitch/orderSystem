import {
  arrayRemove,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import UserData from "../feature/CheckAuth";
import { db } from "../feature/firebase";
import { Row, Col, Container } from "react-bootstrap";
import PageTitle from "./common/PageTitle";
import CouponCard from "./common/CouponCard";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AdvancedDataTable from "./table/AdvancedDataTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function Offers() {
  const histroy = useHistory();
  const [foodList, setFoodList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [orderComment, setOrderComment] = useState("");
  const [curDate, setCurDate] = useState(new Date());
  useEffect(() => {
    if (UserData) {
      let products = [];
      const q = query(collection(db, "menu"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          products.push(doc.data());
        });
        setFoodList(products);
        // console.log(products);
      });
      return () => {
        unsub();
      };
    } else {
      histroy.replace({ pathname: "/login" });
    }
  }, []);

  const columns = [
    {
      title: "Menu Name",
      key: "index",
      dataIndex: "menuName",
    },
    {
      title: "Food Name",
      dataIndex: "foodName",
      align: "center",
      editable: true,
    },
    {
      title: "Item comment",
      dataIndex: "comment",
      align: "center",
      editable: true,
    },
    {
      title: "Quentity",
      dataIndex: "quentity",
      align: "center",
      editable: true,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      align: "center",
      editable: true,
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <button
            className="mr-1 btn btn-outline-danger"
            onClick={() => deleteOrder(record)}
          >
            Cancel
          </button>
        ) : (
          ""
        ),
    },
  ];

  const onAddCart = (foodName, comment, quentity, weight, menuID, menuName) => {
    let foodArr = foodName.split(".");
    let temp = dataSource;
    temp.push({
      menuID: menuID,
      menuName: menuName,
      foodID: foodArr[0],
      foodName: foodArr[1],
      comment: comment,
      quentity: quentity ? quentity + " ea" : "",
      weight: weight ? weight + " kg" : "",
    });
    setDataSource([...temp]);
  };

  const deleteOrder = (record) => {
    let temp = [];
    for (let i = 0; i < dataSource.length; i++) {
      if (
        !(
          dataSource[i].foodID == record.foodID &&
          dataSource[i].menuCat == record.menuCat &&
          dataSource[i].quentity == record.quentity &&
          dataSource[i].weight == record.weight &&
          dataSource[i].foodName == record.foodName
        )
      ) {
        temp.push({
          menuID: dataSource[i].menuID,
          menuName: dataSource[i].menuName,
          foodID: dataSource[i].foodID,
          foodName: dataSource[i].foodName,
          comment: dataSource[i].comment,
          quentity: dataSource[i].quentity,
          weight: dataSource[i].weight,
        });
      }
      setDataSource([...temp]);
    }
  };

  const saveOrder = () => {
    if (orderName == "") {
      toast.error("Name can not be empty!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (dataSource == []) {
      toast.error("These is no any order!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (contactNumber == "") {
      toast.error("Contact Number should not be empty!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      let cur_date_num = curDate.getTime();
      let orderNum = 1;
      let orderNumList = [];
      const q = query(collection(db, "orderNum"));
      onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.metadata.hasPendingWrites) {
          querySnapshot.docs.map((doc) => {
            orderNumList.push(doc.data());
          });

          orderNum = orderNumList[0].number;
          let temp = [];
          for (let i = 0; i < dataSource.length; i++) {
            let items = [
              {
                id: dataSource[i].foodID,
                name: dataSource[i].foodName,
                price: 0,
                weight: dataSource[i].weight,
                quentity: dataSource[i].quentity,
                itemComment: dataSource[i].comment,
              },
            ];
            temp.push({
              id: dataSource[i].menuID,
              menuCat: dataSource[i].menuName,
              items: items,
            });
          }

          let res = {
            contactNumber: contactNumber,
            name: orderName,
            orderComment: orderComment,
            orderDate: cur_date_num,
            orderNumber: orderNum + 1,
            order: temp,
          };
          sendOrder(res);
        }
      });
    }
  };

  const sendOrder = (data) => {
    const q = query(collection(db, "pendingOrders"));
    setDoc(doc(q), data)
      .then(() => {
        histroy.replace({ pathname: "/" });
        toast.success("New Order is added!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        updateOrderNum(data.orderNumber);
      })
      .catch((err) => {
        toast.error("Add Order is failed!. Please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const updateOrderNum = async (orderNum) => {
    const data = {
      number: orderNum,
    };
    const ref = doc(db, "orderNum", "sequentialNum");
    await updateDoc(ref, data);
  };
  return (
    <>
      <PageTitle
        title="Offers for you"
        subTitle="Explore top deals and offers exclusively for you!"
      />
      <section className="section pt-5 pb-5">
        <Container>
          <Row>
            <Col md={12}>
              <label className="font-weight-bold mt-0 mb-3">
                <h4>Order List</h4>
              </label>
              <button
                type="button"
                className="btn-sm right inc btn btn-outline-secondary"
                style={{
                  width: "130px",
                  height: "35px",
                  float: "right",
                }}
                onClick={saveOrder}
              >
                Save Order
              </button>
              <input
                type="text"
                style={{
                  width: "250px",
                  background: "none",
                  backgroundColor: "#272727",
                  fontSize: "18px",
                  float: "right",
                  marginRight: "20px",
                }}
                placeholder="Order Comment"
                value={orderComment}
                onChange={(e) => setOrderComment(e.target.value)}
              />
              <input
                type="text"
                style={{
                  width: "150px",
                  background: "none",
                  backgroundColor: "#272727",
                  fontSize: "18px",
                  float: "right",
                  marginRight: "20px",
                }}
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
              <input
                type="text"
                style={{
                  width: "150px",
                  background: "none",
                  backgroundColor: "#272727",
                  fontSize: "18px",
                  float: "right",
                  marginRight: "20px",
                }}
                placeholder="Name for order"
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
              />
              <DatePicker
                selected={curDate}
                onChange={(date: Date) => setCurDate(date)}
              />
            </Col>
            <Col md={12} style={{ marginBottom: "30px" }}>
              <AdvancedDataTable
                columns={columns}
                dataSource={dataSource}
                loading={loading}
              />
            </Col>
            <Col md={12}>
              <h4 className="font-weight-bold mt-0 mb-3">Available Coupons</h4>
            </Col>

            {foodList.map((item, key) => {
              let temp = item.base;
              const base = [...temp].sort((a, b) => (a.name > b.name ? 1 : -1));
              return (
                <Col md={4} key={key}>
                  <CouponCard
                    title="Get 50% OFF on your first osahan eat order"
                    // logoImage="img/bank/1.png"
                    subTitle="Use code OSAHANEAT50 & get 50% off on your first osahan order on Website and Mobile site. Maximum discount: $200"
                    copyBtnText="COPY CODE"
                    foods={base}
                    menuName={item.name}
                    menuID={item.id}
                    onAddCart={onAddCart}
                  />
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Offers;
