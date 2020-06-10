import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { Card, Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";

import "./Login.scss";

function Find() {
  const history = useHistory();
  const [valid, setValid] = useState({});
  const [inputVisible, setInputVisible] = useState({ visible: false });

  var limitTime = 300000;
  const [time, setTime] = useState(moment(limitTime)); // 설정 시간
  const [timeClone, setTimeClone] = useState(moment(limitTime)); // 보여지는 시간
  const [timeTick, setTimeTick] = useState(null);
  const [inputDisabled, setInputDisabled] = useState(true);

  const startTimer = () => {
    const tick = () => {
      setTime((prevTime) => prevTime.subtract(1, "seconds"));
      setTimeClone((prevTime) => prevTime.clone().subtract(1, "seconds"));
    };
    const clearTime = () => {
      if (moment(time) <= moment(0)) {
        clearInterval(timeTick);
        setInputVisible({ visible: false });
        setValid({ help: "인증 시간 초과 입니다.", validateStatus: "error" });
      }
    };
    const timeTick = setInterval(() => {
      tick();
      clearTime();
    }, 1000);

    setTimeTick(timeTick);
  };

  const handleNameOnBlur = async (value) => {
    // ID 중복 확인
    try {
      const response = await Axios.get("http://localhost:8000/accounts/find/password/", {
        params: {
          username: value,
        },
      });

      console.log(response.data);
      if (response.data.length !== 0) {
        setValid({ help: "인증번호 전송 완료 !" });
        setInputVisible({ visible: true });
        setInputDisabled(false);
        startTimer();
      }
    } catch {
      setValid({ help: "존재하지 않는 유저 이메일 입니다.", validateStatus: "error" });
      setInputVisible({ visible: false });
    }
  };

  const onFinish = async (values) => {
    const { username, auth_code } = values;

    const formData = new FormData(); // js 기능
    formData.append("auth_code", auth_code);

    const apiUrl = `http://localhost:8000/accounts/find/password/?username=${username}`;

    try {
      const res = await Axios.post(apiUrl, formData);

      notification.open({
        message: "인증 성공",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      history.push("/accounts/reset/?username=" + res.data.username);
    } catch (error) {
      if (error.response) {
        notification.open({
          message: "인증 실패",
          icon: <FrownOutlined style={{ color: "#ff3333" }} />,
        });
      }
    }
  };

  return (
    <Card className="login-form" title="인증번호 발송" size="large">
      <Form className="login-form-items" {...layout} onFinish={onFinish}>
        <Form.Item
          help={valid.help}
          validateStatus={valid.validateStatus}
          label="E-mail"
          name="username"
          rules={[
            { type: "email", message: "E-mail 형식을 확인해주세요." },
            { required: true, message: "E-mail을 입력해주세요." },
          ]}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="E-mail"
            onBlur={(e) => {
              handleNameOnBlur(e.target.value);
            }}
            onFocus={(e) => setValid({})}
          />
        </Form.Item>

        <Form.Item name="auth_code" label="인증코드">
          <Input disabled={inputDisabled} />
        </Form.Item>
        <p style={{ marginTop: "-20px", textAlign: "right" }}>
          {moment(timeClone, "s").format("m:ss")}
        </p>
        {moment(time) < moment(0) && (
          <Form.Item {...tailLayout}>
            <Button onClick={() => window.location.reload(false)}>다시 인증하기</Button>
          </Form.Item>
        )}

        {inputVisible.visible && (
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              인증
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
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

export default Find;
