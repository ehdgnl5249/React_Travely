import React, { useState, useEffect } from "react";
// import { GoogleLogin } from "react-google-login";
import KakaoLogin from "react-kakao-login";
import FacebookLogin from "react-facebook-login";
// import NaverLogin from "react-naver-login";
import { useAppContext, setToken } from "store";
import Axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";

import { Icon } from "react-icons-kit";

import { socialFacebook } from "react-icons-kit/typicons/socialFacebook";
import { speech_bubble_1 } from "react-icons-kit/ikons/speech_bubble_1";

import "./SocialLogin.scss";

function SocialLogin() {
  const history = useHistory();
  const { dispatch } = useAppContext();
  const [num, setNUm] = useState(0);
  const location = useLocation();
  const { naver } = window;

  const { from: loginRedirectUrl } = location.state || {
    from: { pathname: "/" },
  };

  const socialLogin = ({ username, name, image_url }) => {
    async function fn() {
      const data = { username, name, image_url };
      const loginData = { username };
      console.log("data :", data);
      console.log("login data :", loginData);
      try {
        await Axios.post("http://localhost:8000/accounts/signup/", data);
      } catch (e) {
        console.log("가입된 유저입니다.");
      } finally {
        const response = await Axios.post("http://localhost:8000/accounts/token/", loginData);
        console.log("res :", response);
        const {
          data: { token: jwtToken },
        } = response;
        dispatch(setToken(jwtToken));

        notification.open({
          message: "로그인 성공",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });

        history.push(loginRedirectUrl);
      }
    }
    fn();
  };

  // GoogleLogin
  // const responseGoogle = (res) => {
  //   console.log("리얼 응답값 :", res);
  //   // var password = res.googleId;
  //   var password = "google";
  //   var username = "google" + res.profileObj.googleId;
  //   var email = res.profileObj.email;
  //   var name = res.profileObj.name;
  //   var image_url = res.profileObj.imageUrl;
  //   // var password = res.accessToken;
  //   socialLogin({ username, email, name, image_url, password });
  // };

  // 네이버 로그인
  const Naver = () => {
    const naverLogin = new naver.LoginWithNaverId({
      clientId: "dJkmvI09wjfztCO3jxOn",
      callbackUrl: "http://localhost:3000/accounts/login",
      isPopup: false,
      callbackHandle: false,
      loginButton: { color: "green", type: 1, height: 45 },
    });

    naverLogin.init();

    naverLogin.getLoginStatus(function (status) {
      if (status) {
        var name = naverLogin.user.getName();
        var image_url = naverLogin.user.getProfileImage(); // profileImage
        var username = "naver" + naverLogin.user.getId(); // uniqId

        console.log(username, name, image_url);
        socialLogin({ username, name, image_url });
      } else {
      }
    });
  };

  useEffect(Naver, [num]);

  const responseKakao = (res) => {
    console.log(res);
    var username = "kakao" + res.profile.id;
    var name = res.profile.kakao_account.profile.nickname;
    var image_url = res.profile.kakao_account.profile.profile_image_url;

    socialLogin({ username, name, image_url });
  };

  const responseFacebook = (res) => {
    console.log("res : ", res);
    var name = res.name;
    var username = "facebook" + res.id;
    var image_url = res.picture.data.url;
    socialLogin({ username, name, image_url });
  };

  return (
    <>
      <h6
        style={{
          textAlign: "center",
          marginLeft: 50,
          marginBottom: 20,
          fontFamily: "'Noto Sans KR', sans-serif",
          color: "rgb(30,144,255)",
          opacity: "0.8",
        }}
      >
        소셜 로그인
      </h6>
      <div className="btn-form">
        <div>
          <div className="naver-btn" id="naverIdLogin" onClick={() => setNUm(1)}></div>
        </div>

        <div>
          <KakaoLogin
            className="kakao-btn"
            jsKey="6f9b5f2308e5c2873f3e75e2ef3d4277"
            // buttonText=" Kakao with Login"
            onSuccess={responseKakao}
            onFailure={responseKakao}
            getProfile="true"
          >
            <Icon icon={speech_bubble_1} size={33} />
          </KakaoLogin>
        </div>

        <div>
          <FacebookLogin
            cssClass="fb-button"
            size="large"
            appId="213730249953624" // facebook developer 페이지에 생성한 앱의 아이디
            autoLoad={false}
            fields="name,email,picture" // 페이스북에서 가져올 필드
            callback={responseFacebook} // 콜백함수 지정( container에 생성 )
            // icon="fa-facebook" // 아이콘 지정
            icon={<Icon icon={socialFacebook} size={45} />}
            textButton="" // 버튼에 표시할 텍스트
          />
        </div>

        {/* <GoogleLogin
        clientId="124109851625-dp33ekckrhiha52gid9ttgjqiad462fv.apps.googleusercontent.com"
        buttonText="Google Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        // isSignedIn={true}
      /> */}
      </div>
    </>
  );
}

export default SocialLogin;
