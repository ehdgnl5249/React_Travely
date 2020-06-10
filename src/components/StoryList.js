import React from "react";
import { Card } from "antd";
import "./StoryList.scss";

const StoryList = ({ style }) => {
  return (
    <div style={style}>
      <Card
        title="트레블리 스토리"
        size="small"
        style={{ fontSize: "13px", border: "0.5px solid #E2E2E2" }}
      >
        팔로우 하시면 더 많은 소식을 볼 수 있습니다.
      </Card>
    </div>
  );
};

export default StoryList;
