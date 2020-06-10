import React from "react";
import "./AppHeader.scss";
import PostSearch from "./PostSearch";
import LogoImage1 from "../assets/logo3.png";
import LogoImage2 from "../assets/logo2.png";
import { Menu, notification, Input } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";
import { useAppContext, deleteToken } from "store";

function AppHeader({ MenuItem }) {
  const { dispatch } = useAppContext();
  const history = useHistory();

  function Logout() {
    dispatch(deleteToken());
    // LocalStorage에 jwt토큰 저장 /  type: SET_TOKEN , value: jwtToken
    notification.open({
      message: "로그아웃 성공",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
    history.push("/");
  }

  return (
    <div className="header">
      <h1 className="page-title" style={{ display: "flex" }}>
        <Link to="/">
          <img src={LogoImage1} style={{ height: "45px", marginRight: "5px" }} alt="logo" />
          <img src={LogoImage2} style={{ height: "45px" }} alt="logo" />
        </Link>
      </h1>
      <div>
        {/* <PostSearch /> */}
      </div>
      <div className="search">
        <Input.Search
          placeholder="검색어를 입력해주세요."
          // onSearch={handleSearch}
          enterButton
          size="large"
        />
      </div>
      <div className="topnav">
        <Menu mode="horizontal" style={{ fontSize: "15px" }}>
          <Menu.Item onClick={() => history.push("/accounts/profile")}>{MenuItem}</Menu.Item>
          {/* <Logout /> */}
          <Menu.Item onClick={Logout}>로그아웃</Menu.Item>
        </Menu>
      </div>
    </div>
  );
}

export default AppHeader;
