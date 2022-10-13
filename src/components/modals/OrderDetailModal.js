import React from "react";
import { Form, Modal, Button } from "react-bootstrap";

function OrderDetailModal(props) {
  const orderData = props.orderDetail;
  let totalPrice = 0;
  if (orderData.hasOwnProperty("totalPrice")) {
    totalPrice = orderData.totalPrice;
  }
  let order = [];
  if (orderData.hasOwnProperty("orders")) {
    order = orderData.orders;
    if (order.length) {
      return (
        <Modal
          show={props.show}
          onHide={props.onHide}
          size="sm"
          centered
          className="modal-view"
        >
          <Modal.Header closeButton={true}>
            <Modal.Title as="h5" id="edit-profile">
              Order Detail
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="form-row" style={{ display: "block" }}>
                <div style={{ fontSize: "18px" }}>
                  Order - {orderData.orderNumber} - {orderData.name}
                </div>
                <div style={{ fontSize: "14px" }}> {orderData.orderDate} </div>
                <div
                  style={{
                    fontSize: "16px",
                    marginTop: "15px",
                    marginLeft: "15px",
                    display: "block",
                  }}
                >
                  {order.map((item, key1) => (
                    <div style={{ marginBottom: "10px" }} key={key1}>
                      <div style={{ display: "block" }}>
                        Menu: {item.menuCat}
                      </div>
                      <div style={{ fontSize: "15px", marginLeft: "15px" }}>
                        {item.items.map((orderArr, index) => {
                          let res = Object.entries(orderArr);
                          let str = "-";
                          for (let i = 0; i < res.length; i++) {
                            const element = res[i];
                            if (element[0] != "id") {
                              str += element[0] + ":" + element[1] + ", ";
                            }
                          }
                          return <div key={index}> {str} </div>;
                        })}
                      </div>
                      <div style={{ fontSize: "18px" }}>
                        Total Price: $ {totalPrice ? totalPrice : 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              onClick={props.onHide}
              variant="outline-primary"
              className="d-flex text-center justify-content-center"
              style={{ width: "150px!important", padding: "5px 15px" }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return (
        <Modal
          show={props.show}
          onHide={props.onHide}
          size="sm"
          centered
          className="modal-view"
        >
          <Modal.Header closeButton={true}>
            <Modal.Title as="h5" id="edit-profile">
              Order Detail
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="form-row" style={{ display: "block" }}>
                <div style={{ fontSize: "18px" }}>There is no any Order!.</div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              onClick={props.onHide}
              variant="outline-primary"
              className="d-flex w-0 text-center justify-content-center"
              style={{ width: "150px!important", padding: "5px 15px" }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
  return "";
}

export default OrderDetailModal;
