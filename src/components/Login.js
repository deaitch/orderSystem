import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Container, Form, Button } from "react-bootstrap";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../feature/firebase";
toast.configure();
// toast.warn("Order closed!", { position: toast.POSITION.TOP_RIGHT });

function Login() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignin = async () => {
    if (email == "") {
      toast.error("Email can not be empty!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    } else if (password == "") {
      toast.error("Password can not be empty!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userData", JSON.stringify(res));
      toast.success("Login successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      history.replace({ pathname: "/order" });
    } catch (error) {
      toast.error("Invaild credential!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  return (
    <Container fluid className="bg-dark-color">
      <Row>
        <Col md={4} lg={6} className="d-none d-md-flex bg-image"></Col>
        <Col md={8} lg={6}>
          <div className="login d-flex align-items-center py-5">
            <Container>
              <Row>
                <Col md={9} lg={8} className="mx-auto pl-5 pr-5">
                  <h3 className="login-heading mb-4">Welcome back!</h3>
                  <Form>
                    <div className="form-label-group">
                      <Form.Control
                        type="email"
                        id="inputEmail"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Form.Label htmlFor="inputEmail">
                        Email address
                      </Form.Label>
                    </div>
                    <div className="form-label-group">
                      <Form.Control
                        type="password"
                        id="inputPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Form.Label htmlFor="inputPassword">Password</Form.Label>
                    </div>
                    <Form.Check
                      className="mb-3"
                      custom
                      type="checkbox"
                      id="custom-checkbox"
                      label="Remember password"
                    />
                    <Link
                      className="btn btn-lg btn-outline-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                      onClick={onSignin}
                    >
                      Sign in
                    </Link>
                    <div className="text-center pt-3">
                      Don’t have an account?
                      <Link className="font-weight-bold" to="/register">
                        Sign Up
                      </Link>
                    </div>
                    <hr className="my-4" />
                    {/* <p className="text-center">LOGIN WITH</p>
                    <div className="row">
                      <div className="col pr-2">
                        <Button
                          className="btn pl-1 pr-1 btn-lg btn-google font-weight-normal text-white btn-block text-uppercase"
                          type="submit"
                        >
                          <FontAwesome icon="google" className="mr-2" />
                          Google
                        </Button>
                      </div>
                      <div className="col pl-2">
                        <Button
                          className="btn pl-1 pr-1 btn-lg btn-facebook font-weight-normal text-white btn-block text-uppercase"
                          type="submit"
                        >
                          <FontAwesome icon="facebook" className="mr-2" />
                          Facebook
                        </Button>
                      </div>
                    </div> */}
                  </Form>
                </Col>
              </Row>
            </Container>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
