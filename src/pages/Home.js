import React, { useState } from "react";
import { Button, Modal } from "antd";
import PostList from "components/PostList";
import AppLayout from "../components/AppLayout";
import StoryList from "../components/StoryList";
import SuggestionList from "../components/SuggestionList";
import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();

  // const handleClick = () => {
  //   history.push("/posts/new");
  // };
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  }

  const handleDetail = () => {
    setVisible(false);
    history.push("/posts/new/detail");
  };

  const handleQuick = () => {
    setVisible(false);
    history.push("/posts/new/quick");
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const sidebar = (
    <>
      <Button type="primary" block style={{ marginBottom: "29px" }} onClick={showModal}>
        새 포스팅 쓰기
      </Button>

      <Modal
          visible={visible}
          title="포스팅 작성"
          onOk={handleDetail}
          onCancel={handleCancel}
          footer={[
            <Button key="quick" onClick={handleQuick}>
              간편 리뷰
            </Button>,
            <Button key="detail" type="primary" onClick={handleDetail}>
              상세 리뷰
            </Button>,
          ]}
        >
          <p> 소중한 여행 후기를 남겨주세요. </p>
        </Modal>

      <StoryList style={{ marginBottom: "1rem" }} />
      <SuggestionList style={{ marginBottom: "1rem" }} />
      <div style={{ fontSize: "13px", fontWeight: "lighter", textAlign: "center" }}>
        <span>&copy; Travely Project 2020 </span>
      </div>
    </>
  );
  return (
    <AppLayout sidebar={sidebar}>
      <PostList />
    </AppLayout>
  );
}

export default Home;
