import React, { useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import Axios from "axios";
import { Card, Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAppContext, setToken } from "store";
import SocialLogin from "./socialLogin";
import { parseErrorMessages } from "utils/forms";
import "./Login.scss";
import LogoImage1 from "../../assets/logo3.png";
import LogoImage2 from "../../assets/logo2.png";

function Login() {
  const { dispatch } = useAppContext();
  const location = useLocation();
  const history = useHistory();
  const [fieldErrors, setFieldErrors] = useState({});

  const { from: loginRedirectUrl } = location.state || {
    from: { pathname: "/" },
  };
  // LoginReqiredRoute.js의 state: { from: props.location } 에서 넘어온게
  // 아니라면 디폴트 값으로 "/"를 줌.
  // ex) accounts/profile에서 로그인상태가 아니라서 accounts/login으로 왔다면
  //     로그인 완료 후 accounts/profile 로 돌아갑니다.

  const onFinish = (values) => {
    async function fn() {
      const { username, password } = values;
      setFieldErrors({});

      const data = { username, password };

      try {
        // const headers = { "Content-type": "application/json" };
        const response = await Axios.post("http://localhost:8000/accounts/token/", data);
        const {
          // data: { token: jwtToken }, // data -> token 을 jwtToken이란 이름으로 가져옴
          // data: { access: jwtToken },
          data: { access: jwtToken, refresh: refreshToken },
        } = response;

        console.log(jwtToken, refreshToken);
        dispatch(setToken([jwtToken, refreshToken]));
        // LocalStorage에 jwt토큰 저장 /  type: SET_TOKEN , value: jwtToken
        notification.open({
          message: "로그인 성공",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        history.push(loginRedirectUrl);
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "로그인 실패",
            description: "아이디/암호를 확인해주세요",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });

          const { data: fieldsErrorMessages } = error.response;
          // fieldsErrorMessages => { username: ["m1", "m2"], password: [] }

          setFieldErrors(parseErrorMessages(fieldsErrorMessages));
        }
      }
    }
    fn();
  };

  return (
    <div>
      <Card
        className="login-form"
        title={
          <div style={{ marginLeft: "200px" }}>
            <img src={LogoImage1} style={{ height: "45px", marginRight: "5px" }} alt="logo" />
            <img src={LogoImage2} style={{ height: "45px" }} alt="logo" />
          </div>
        }
        size="large"
      >
        <Form
          className="login-form-items"
          {...layout}
          onFinish={onFinish}
          // username과 password값이 둘다 있을 때 values값으로 가짐
        >
          <Form.Item
            label="E-mail"
            name="username"
            rules={[
              { type: "email", message: "E-mail 형식을 확인해주세요." },
              { required: true, message: "E-mail을 입력해주세요." },
            ]}
            // hasFeedback
            {...fieldErrors.username} // 이 help 값이 있으면 기존 에러 사라지고 보여짐
            //{...fieldErrors.non_field_errors}
          >
            <Input
              style={{ width: "300px" }}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="E-mail"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "패스워드를 입력해주세요." }]}
            {...fieldErrors.password}
          >
            <Input.Password
              style={{ width: "300px" }}
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button className="lgn-btn" type="primary" htmlType="submit">
              로그인
            </Button>
            <div style={{ marginTop: "10px" }}>
              <Link className="register-form" to="/accounts/signup">
                새로 오셨나요?
              </Link>
              <Link className="login-form-forgot" to="/accounts/find">
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </Form.Item>
        </Form>

        <div>
          <SocialLogin />
        </div>
      </Card>
    </div>
  );
}

const layout = {
  // maxWidth: "300px",
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  // antd 는 하나의 행을 24칸으로 나눈 디자인
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
  // button에는 앞에 레이블이 없기에 그만큼 8칸 띄워주고 16칸 시작
};

export default Login;
