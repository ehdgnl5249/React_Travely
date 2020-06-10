import React from "react";
import "./AppLayout.scss";
import AppHeader from "./AppHeader";

function AppLayout({ children, sidebar }) {
  // /pages/index.js의 AppLayout 컴포넌트 내부의 값을 children으로 가져옴
  return (
    <div className="app">
      <AppHeader MenuItem={"프로필"} />
      <div className="contents">{children}</div>
      <div className="sidebar">{sidebar}</div>
      {/* <div className="footer">&copy;Copyright 2020</div> */}
    </div>
  );
}

export default AppLayout;
