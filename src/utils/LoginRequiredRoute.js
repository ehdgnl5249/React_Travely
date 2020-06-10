import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppContext } from "store";

function LoginRequiredRoute({ component: Component, ...kwargs }) {
  // 항상 Route 컴포넌트 반환
  const {
    store: { isAuthenticated }
  } = useAppContext(); // login여부만 확인하기 위함

  // console.log("isAuthenticated :", isAuthenticated);

  return (
    <Route
      {...kwargs}
      render={props => {
        // history, match, location 등 다양한 값들이 넘어옴
        if (isAuthenticated) {
          // login 상태이면
          return <Component {...props} />;
        } else {
          // login 상태가 아니라면
          return (
            <Redirect
              to={{
                pathname: "/accounts/login", // 로그인 창으로
                state: { from: props.location } // 어디서 넘어왔는지
              }}
            />
          );
        }
      }}
    />
  );
}

export default LoginRequiredRoute;
