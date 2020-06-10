import React from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { Form, Input, Button, notification, Card } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import queryString from "query-string";

function Reset({ location }) {
  const query = queryString.parse(location.search);
  const username = query.username;

  const history = useHistory();

  const onFinish = (values) => {
    // 수정 제출
    async function fn() {
      const { password } = values;
      const data = { password };

      try {
        await Axios.put(
          "http://localhost:8000/accounts/reset/password/?username=" + username,
          data
        );
        notification.open({
          message: "패스워드 재설정 성공",
          description: "로그인 페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        history.push("/");
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "패스워드 변경 실패",
            description: "패스워드를 확인해주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });
        }
      }
    }
    fn();
  };

  return (
    <Card title="비밀번호 재설정 페이지">
      <Form {...layout} onFinish={onFinish}>
        <Form.Item
          label="새 비밀번호"
          name="password"
          rules={[
            { required: true, message: "비밀번호를 입력해주세요." },
            { min: 8, message: "8자 이상, 특수문자, 영문, 숫자를 혼합하여 입력해주세요." },
          ]}
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
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            비밀번호 설정
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

export default Reset;
