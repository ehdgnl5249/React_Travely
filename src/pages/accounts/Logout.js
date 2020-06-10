import React from "react";
import { useHistory } from "react-router-dom";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useAppContext, deleteToken } from "store";

function Logout() {
  const { dispatch } = useAppContext();
  const history = useHistory();

  const LogoutHandler = () => {
    dispatch(deleteToken());
    // LocalStorage에 jwt토큰 저장 /  type: SET_TOKEN , value: jwtToken
    notification.open({
      message: "로그아웃 성공",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
    history.push("/");
  };

  return LogoutHandler;
  // return <Menu.Item onClick={LogoutHandler}>로그아웃</Menu.Item>;
}

export default Logout;
