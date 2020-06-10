import React from "react";
import { Comment as AntComment, Avatar, Tooltip } from "antd";
import moment from "moment";

export default function Comment({ comment }) {
  const {
    author: { username, name, avatar_url },
    message,
    created_at,
  } = comment;

  return (
    <AntComment
      author={name.length === 0 ? username : name}
      avatar={
        <Avatar
          // FIXME : avatar_url HOST 지정
          src={"http://localhost:8000" + avatar_url}
          alt={name.length === 0 ? username : name}
        />
      }
      content={<p>{message}</p>}
      datetime={
        <Tooltip title={moment().format(created_at)}>
          <span>{moment(created_at).fromNow()}</span>
        </Tooltip>
      }
    />
  );
}
