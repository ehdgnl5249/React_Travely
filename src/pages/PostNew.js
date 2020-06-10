import React from "react";
import PostNewForm from "components/PostNewForm";
import { Card } from "antd";
import "./PostNew.scss";

export default function PostNew() {
  return (
    <div className="PostNew">
      <Card title="포스팅 작성">
        <PostNewForm />
      </Card>
    </div>
  );
}
