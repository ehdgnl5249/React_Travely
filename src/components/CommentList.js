import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "antd";
import useAxios from "axios-hooks";
import Axios from "axios";
import { useAppContext } from "store";
import Comment from "./Comment";

export default function CommentList({ post, visible }) {
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `Bearer ${jwtToken}` };
  const [commentContent, setCommentContent] = useState("");
  const [item, setItem] = useState({ preshow: 0, show: 3, expanded: false });

  const [{ data: commentList }, refetch] = useAxios({
    url: `http://localhost:8000/api/posts/${post.id}/comments/`,
    headers,
  });

  const handleCommentSave = async () => {
    const apiUrl = `http://localhost:8000/api/posts/${post.id}/comments/`;
    try {
      await Axios.post(apiUrl, { message: commentContent }, { headers });
      refetch();
      setCommentContent("");
    } catch (error) {
      console.log(error);
    }
  };

  const showMore = () => {
    item.show === 3
      ? setItem({ show: commentList.length, expanded: true })
      : setItem({ show: 3, expanded: false });
  };

  return (
    <div>
      {commentList &&
        commentList
          .slice(0, item.show)
          .map((comment) => <Comment key={comment.id} comment={comment} />)}
      {commentList && commentList.length > 3 && (
        <Link to="/#" onClick={() => showMore()}>
          {item.expanded ? <span>접기</span> : <span>댓글 더보기</span>}
        </Link>
      )}
      {/* {commentList && commentList.map((comment) => <Comment key={comment.id} comment={comment} />)} */}
      {visible === true && (
        <div>
          <Input.TextArea
            style={{ marginBottom: "0.5em" }}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Button
            block
            type="primary"
            disabled={commentContent.length === 0}
            onClick={handleCommentSave}
          >
            댓글 쓰기
          </Button>
        </div>
      )}
      {visible === false && <div></div>}
    </div>
  );
}
