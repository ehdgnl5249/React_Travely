import React, { useState, useEffect } from "react";
import Axios from "axios";
import Post from "./Post_copy";
import { useAppContext } from "store";
import { Skeleton, Card, Spin } from "antd";

function PostList() {
  const {
    store: { jwtToken },
  } = useAppContext();

  const headers = { Authorization: `Bearer ${jwtToken}` };

  const [page, setPage] = useState(2);
  const [error, setError] = useState(false);
  const [postList, setPostList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    Axios.get(`http://localhost:8000/api/posts/?page=1`, { headers }).then((res) => {
      setPostList((prevState) => [...prevState, ...res.data.results]);
    });
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    fetchMorePostList();
  }, [isFetching]);

  function handleScroll() {
    var scrollHeight = document.body.scrollHeight;
    var scrollTop = document.documentElement.scrollTop;
    var innerHeight = window.innerHeight;
    if (scrollHeight - (innerHeight + scrollTop) < 100)
      // return;
      setIsFetching(true);
  }

  const fetchMorePostList = async () => {
    try {
      await Axios.get(`http://localhost:8000/api/posts/?page=${page}`, { headers }).then((res) => {
        setTimeout(() => {
          setPage(page + 1);
          setPostList((prevState) => [...prevState, ...res.data.results]);
          setIsFetching(false);
        }, 250);
      });
    } catch (error) {
      setError(true);
    }
  }

  // 좋아요 & 취소 로직
  const handleLike = async ({ post, isLike, likeUser }) => {
    const apiUrl = `http://localhost:8000/api/posts/${post.id}/like/`;
    const method = isLike ? "POST" : "DELETE";

    try {
      await Axios({
        url: apiUrl,
        method,
        headers,
      });

      setPostList((prevList) => {
        return prevList.map((currentPost) =>
          currentPost === post
            ? { ...currentPost, is_like: isLike, like_user: likeUser }
            : currentPost
        );
      });
    } catch (error) {
      console.log("좋아요 기능 에러 : ", error);
    }
  };

  return (
    <div>
      {postList && postList.length === 0 && (
        <div>
          <Card>
            <Skeleton avatar active title paragraph={{ rows: 5 }} />
          </Card>
          <Card>
            <Skeleton avatar active title paragraph={{ rows: 4 }} />
          </Card>
          <Card>
            <Skeleton avatar active title paragraph={{ rows: 4 }} />
          </Card>
          <Card>
            <Skeleton avatar active title paragraph={{ rows: 4 }} />
          </Card>
          <Card>
            <Skeleton avatar active title paragraph={{ rows: 4 }} />
          </Card>
          <Card>
            <Skeleton avatar active title paragraph={{ rows: 4 }} />
          </Card>
          <Card>
            <Skeleton avatar active title paragraph={{ rows: 4 }} />
          </Card>
        </div>
      )}

      {postList &&
        postList.map((post) => <Post post={post} key={post.id} handleLike={handleLike} />)}
      
      {isFetching && !error && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Spin size="large" tip="Loading ..." />
        </div>
      )}
      
      {error && (
        <div style={{ margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: "inherit" }}>마지막 게시물입니다.</span>
        </div>
      )}
    </div>
  );
}

export default PostList;
