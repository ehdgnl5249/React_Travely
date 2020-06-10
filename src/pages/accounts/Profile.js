import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxios from "axios-hooks";
import Axios from "axios";
import { useAppContext } from "store";
import { Avatar, Typography } from "antd";
import {
  UserOutlined,
  //   EditOutlined
  //   HeartFilled,
  //   HeartTwoTone,
  //   LikeFilled,
  //   DislikeFilled,
} from "@ant-design/icons";
import AppHeader from "../../components/AppHeader";
import { Row } from "react-bootstrap";
import ProfilePost from "./ProfilePost";
import "./Profile.scss";

function Profile() {
  const {
    store: { jwtToken },
  } = useAppContext();

  const headers = { Authorization: `Bearer ${jwtToken}` };
  const [profile, setProfile] = useState({});

  useEffect(() => {
    Axios.get("http://localhost:8000/accounts/profile/", { headers }).then((res) => {
      // const { username, name, avatar, following_set, follower_set } = res.data;
      // setProfile({ username, name, avatar, follower_set, following_set });
      const { username, name, avatar, follow_set, follower_set } = res.data;
      console.log(res.data);
      setProfile({ username, name, avatar, follow_set, follower_set });
    });
  }, []);

  const [{ data: Mypost, loading, error }, refetch] = useAxios({
    url: `http://localhost:8000/api/mypage/`,
    headers,
  });

  return (
    <div className="profile">
      <AppHeader />
      {/* 자신 프로필 사진, 이름, 편집 버튼 등.. */}
      <div style={{ width: "1024px" }}>
        <div style={{ display: "flex", marginTop: "70px" }}>
          <div style={{ marginLeft: "30px" }}>
            <Avatar size={180} icon={<img src={profile.avatar} alt={profile.username} />} />
          </div>
          <div style={{ marginLeft: "60px" }}>
            <Typography.Title level={2}>{profile.name}</Typography.Title>
            <Typography.Title level={3}>{profile.username}</Typography.Title>
            <div style={{ display: "flex", marginTop: "40px" }}>
              <div>
                <span style={{ fontWeight: "lighter", fontSize: "20px" }}>팔로우</span>
                <span style={{ marginLeft: "15px", fontSize: "20px" }}>
                  {/* {profile.following_set && profile.following_set.length} */}
                  {profile.follow_set && profile.follow_set.length}
                </span>
              </div>
              <div style={{ marginLeft: "35px" }}>
                <span style={{ fontWeight: "lighter", fontSize: "20px" }}>팔로워</span>
                <span style={{ marginLeft: "15px", fontSize: "20px" }}>
                  {profile.follower_set && profile.follower_set.length}
                </span>
              </div>
            </div>
          </div>
          <hr />
          <div style={{ float: "right" }}>
            <Link to="/accounts/edit">프로필 수정</Link>
          </div>
        </div>
        <div style={{ marginTop: "100px" }}>
          <Row xs="3">
            {Mypost && Mypost.map((post) => <ProfilePost post={post} key={post.id} />)}
          </Row>
        </div>
      </div>
      {error && (
        <div>
          <span>마이페이지 게시물 에러</span>
        </div>
      )}
    </div>
  );
}

export default Profile;
