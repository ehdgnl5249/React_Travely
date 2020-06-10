import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { Form, Input, Button, notification, Card, DatePicker } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import "./Signup.scss";

function Signup() {
  const history = useHistory();
  const [fieldErrors, setFieldErrors] = useState({});
  const [idValid, setIdValid] = useState({});
  const [nameValid, setNameValid] = useState({});
  const [date, setDate] = useState([]);

  const handleOnBlur = async (value) => {
    // ID 중복 확인
    console.log(value);
    const response = await Axios.get("http://localhost:8000/accounts/signup/?username=" + value);
    console.log("gg :", response.data.length);
    if (response.data.length !== 0) {
      setIdValid({ help: "중복된 유저 이메일 입니다.", validateStatus: "error" });
    } else {
      setIdValid({});
    }
  };

  const handleNameOnBlur = async (value) => {
    // 이름 중복 확인
    console.log(value);
    const response = await Axios.get("http://localhost:8000/accounts/signup/?name=" + value);
    console.log(response.data);
    if (response.data.length !== 0) {
      setNameValid({ help: "중복된 닉네임 입니다.", validateStatus: "error" });
    } else {
      setNameValid({});
    }
  };

  const onChange = (date, dateString) => {
    setDate(dateString);
  };

  const onFinish = (values) => {
    async function fn() {
      const { username, name, password } = values;
      setFieldErrors({});

      const formData = new FormData(); // js 기능
      formData.append("username", username);
      formData.append("name", name);
      formData.append("birthday", date);
      formData.append("password", password);

      // const data = { username, name, email, gender, phone_number, avatar, password };

      try {
        await Axios.post("http://localhost:8000/accounts/signup/", formData);
        notification.open({
          message: "회원가입 성공",
          description: "로그인 페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        history.push("/accounts/login");
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "회원가입 실패",
            description: "아이디/암호를 확인해주세요",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });

          const { data: fieldsErrorMessages } = error.response;

          setFieldErrors(
            Object.entries(fieldsErrorMessages).reduce((acc, [fieldName, errors]) => {
              acc[fieldName] = {
                validateStatus: "error",
                help: errors.join(" "),
              };
              return acc;
            }, {})
          );
        }
      }
    }
    fn();
  };

  return (
    <Card title="회원가입" className="signup-form">
      <Form
        className="signup-form-items"
        {...layout}
        onFinish={onFinish}
        //className="login-form"
        // username과 password값이 둘다 있을 때 values값으로 가짐
      >
        <Form.Item
          help={idValid.help}
          validateStatus={idValid.validateStatus}
          label="E-mail"
          name="username"
          rules={[
            { required: true, message: "이메일을 입력해주세요" },
            { type: "email", message: "이메일 형식을 확인해주세요." },
          ]}
          hasFeedback
          {...fieldErrors.username}
        >
          <Input onBlur={(e) => handleOnBlur(e.target.value)} onFocus={(e) => setIdValid({})} />
        </Form.Item>

        <Form.Item
          help={nameValid.help}
          validateStatus={nameValid.validateStatus}
          label="이름"
          name="name"
          rules={[
            { required: true, message: "이름을 입력해주세요." },
            // { pattern: new RegExp("/^ss*$/"), message: "공백은 사용할 수 없습니다." },
            { min: 2, message: "2글자 이상 입력해주세요." },
            { max: 8, message: "8글자 이하로 입력해주세요" },
          ]}
          hasFeedback
        >
          <Input
            onBlur={(e) => handleNameOnBlur(e.target.value)}
            onFocus={(e) => setNameValid({})}
          />
        </Form.Item>

        <Form.Item
          label="Birthday"
          name="birthday"
          rules={[{ required: true, message: "생일을 입력해주세요." }]}
        >
          <DatePicker onChange={onChange} />
        </Form.Item>

        <Form.Item
          label="비밀번호"
          name="password"
          rules={[
            { required: true, message: "패스워드를 입력해주세요." },
            { min: 8, message: "8자 이상, 특수문자, 영문, 숫자를 혼합하여 입력해주세요." },
          ]}
          {...fieldErrors.password}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="비밀번호 확인"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "패스워드 확인을 입력해주세요.",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("비밀번호가 일치하지 않습니다. 확인해주세요.");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  // antd 는 하나의 행을 24칸으로 나눈 디자인
};

const tailLayout = {
  wrapperCol: { offset: 20, span: 16 },
  // button에는 앞에 레이블이 없음. 21칸 띄워주고 16칸 시작
};

export default Signup;
