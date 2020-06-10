import React from "react";
import "./Suggestion.scss";
import { Button, Avatar } from "antd";

// presentation component (주입받은대로 보여줌)
const Suggestion = ({ SuggestionUser, onFollowUser, refetch }) => {
  const { username, name, avatar_url, is_follow } = SuggestionUser;

  return (
    <div className="suggestion">
      <div className="avatar">
        <Avatar
          size="medium"
          icon={<img src={"http://localhost:8000" + avatar_url} alt={`${username}'s avatar`} />}
        />
      </div>
      {/* <div className="username">{name.length === 0 && username.length < 15 ? username : name}</div> */}
      <div className="username" style={{ fontSize: "13px" }}>
        {name}
      </div>

      <div className="actions">
        {is_follow && "팔로우 완료"}
        {!is_follow && (
          <Button size="small" onClick={() => onFollowUser(username)}>
            <span style={{ fontSize: "11px" }}>팔로우</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Suggestion;
