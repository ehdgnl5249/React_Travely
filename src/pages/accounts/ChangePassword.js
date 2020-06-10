import React from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { Form, Input, Button, notification, Card } from "antd";
import { SmileOutlined, FrownOutlined, LockOutlined } from "@ant-design/icons";
import { useAppContext } from "store";

function ChangePassword() {
  const history = useHistory();
  const {
    store: { jwtToken },
  } = useAppContext();

  const headers = { Authorization: `Bearer ${jwtToken}` };

  const onFinish = (values) => {
    // 수정 제출
    async function fn() {
      const { old_password, new_password } = values;
      const data = { old_password, new_password };

      try {
        await Axios.put("http://localhost:8000/accounts/edit/password/", data, { headers });
        notification.open({
          message: "패스워드 변경 성공",
          description: "메인페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        history.push("/");
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "패스워드 변경 실패",
            description: "기존 패스워드를 확인해주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });
        }
      }
    }
    fn();
  };

  return (
    <Card title="비밀번호 변경 페이지">
      <Form {...layout} onFinish={onFinish}>
        <Form.Item
          label="Password"
          name="old_password"
          rules={[{ required: true, message: "기존 패스워드를 입력해주세요" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="new_password"
          rules={[{ required: true, message: "새로운 패스워드를 입력해주세요" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="New Password"
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            비밀번호 변경
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

export default ChangePassword;
