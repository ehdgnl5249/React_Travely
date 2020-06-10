import React from "react";
import PostQuickNewForm from "components/PostQuickNewForm";
import { Card } from "antd";
import "./PostQuickNew.scss";

export default function PostQuickNew() {
  return (
    <div className="PostQuickNew">
      <Card title="포스팅 작성">
        <PostQuickNewForm />
      </Card>
    </div>
  );
}
