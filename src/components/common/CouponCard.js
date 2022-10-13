import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image, Button } from "react-bootstrap";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function CouponCard(props) {
  const [comment, setComment] = useState("");
  const [foodName, setFoodName] = useState("");
  const [quentity, setQuentity] = useState(0);
  const [weight, setWeight] = useState(0);
  const addCart = () => {
    if (!foodName) {
      toast.error("Please choose your favorite food!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (!quentity && !weight) {
      toast.error("Please input either Quentity or Weight!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (quentity && weight) {
      toast.error("Please input the amount on one of Quentity and Weight!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if ((isNaN(quentity) || quentity <= 0) && quentity) {
      toast.error("Please input valid Quentity!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if ((isNaN(weight) || weight <= 0) && weight) {
      toast.error("Please input valid Weight!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      props.onAddCart(
        foodName,
        comment,
        quentity * 1,
        weight * 1,
        props.menuID,
        props.menuName
      );
    }
  };
  return (
    <div
      className={
        "card offer-card shadow-sm mb-4" + (props.noBorder ? " border-0" : "")
      }
    >
      <div className="card-body">
        {" "}
        {props.logoImage || props.menuName ? (
          <h5 className="card-title">
            {" "}
            {/* {props.logoImage ? (
                                  <Image
                                    src={props.logoImage}
                                    alt={props.imageAlt}
                                    className={props.imageclassName}
                                  />
                                ) : (
                                  ""
                                )} */}{" "}
            {props.menuName ? props.menuName : ""}{" "}
          </h5>
        ) : (
          ""
        )}{" "}
        {/* <h6 className="card-subtitle mb-2 text-block">{props.title}</h6> */}{" "}
        {/* {props.subTitle ? <p className="card-text">{props.subTitle}</p> : ""} */}{" "}
        {/* {props.copyBtnText ? (
                      <Button variant="link" className="card-btn mr-3 p-0">
                        {props.copyBtnText}
                      </Button>
                    ) : (
                      ""
                    )} */}{" "}
        {/* {props.moreLinkText ? (
                      <Link to={props.morelinkUrl} className="card-link">
                        {props.moreLinkText}
                      </Link>
                    ) : (
                      ""
                    )} */}{" "}
        <h6 className="card-subtitle mb-2 text-block">
          Foods: {"  "}{" "}
          <select
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            style={{
              width: "230px",
              background: "none",
              backgroundColor: "#272727",
              //   border: "1px solid #fff",
              fontSize: "18px",
            }}
          >
            <option value=""> </option>{" "}
            {props.foods.map((item) => {
              return (
                <option value={item.id + "." + item.name}> {item.name} </option>
              );
            })}{" "}
          </select>{" "}
        </h6>{" "}
        <div>
          <textarea
            className="textarea"
            placeholder="Item comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />{" "}
        </div>{" "}
        <div style={{ display: "flex" }}>
          <div>
            <span> Quantity(ea) </span>{" "}
            <input
              type="text"
              value={quentity}
              onChange={(e) => setQuentity(e.target.value)}
              style={{
                width: "60px",
                marginRight: "10px",
                backgroundColor: "transparent",
              }}
            />{" "}
          </div>{" "}
          <div>
            <span> Weight(kg) </span>{" "}
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{
                width: "60px",
                marginRight: "10px",
                backgroundColor: "transparent",
              }}
            />{" "}
          </div>{" "}
          <button
            type="button"
            className="btn-sm right inc btn btn-outline-secondary"
            style={{ width: "150px", height: "35px", marginTop: "12px" }}
            onClick={addCart}
          >
            AddToCart <i className="icofont-plus"> </i>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

CouponCard.propTypes = {
  title: PropTypes.string.isRequired,
  logoImage: PropTypes.string,
  subTitle: PropTypes.string,
  imageAlt: PropTypes.string,
  imageclassName: PropTypes.string,
  morelinkUrl: PropTypes.string,
  moreLinkText: PropTypes.string,
  copyBtnText: PropTypes.string,
  couponCode: PropTypes.string,
  noBorder: PropTypes.bool,
};
CouponCard.defaultProps = {
  logoImage: "",
  subTitle: "",
  imageAlt: "",
  imageclassName: "",
  morelinkUrl: "#",
  moreLinkText: "KNOW MORE",
  copyBtnText: "",
  couponCode: "",
  noBorder: true,
};

export default CouponCard;
