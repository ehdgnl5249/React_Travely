import React, { useState, useEffect } from "react";
import { Card } from "antd";
import "./SuggestionList.scss";
import Suggestion from "./Suggestion";
import Axios from "axios";
import useAxios from "axios-hooks";
import { useAppContext } from "store";

const SuggestionList = ({ style }) => {
  const {
    store: { jwtToken },
  } = useAppContext();

  const [userList, setUserList] = useState([]);

  const headers = { Authorization: `Bearer ${jwtToken}` };

  const [{ data: origUserList, loading, error }, refetch] = useAxios({
    url: "http://localhost:8000/accounts/suggestions/",
    headers,
  });

  //   useEffect(() => {
  //     async function fetchUserList() {
  //       const apiUrl = "http://localhost:8000/accounts/suggestions/";
  //       const headers = { Authorization: `JWT ${jwtToken}` };
  //       try {
  //         const { data } = await Axios.get(apiUrl, { headers });
  //         setUserList(data);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //     fetchUserList();
  //   }, []); // mount시 읽어옴

  useEffect(() => {
    if (!origUserList) setUserList([]);
    // 없으면 빈 배열
    else setUserList(origUserList.map((user) => ({ ...user, is_follow: false })));
  }, [origUserList]);
  // 2번째 인자인 originUserList 값이 바뀔 때만 함수를 실행시켜줌

  const onFollowUser = (username) => {
    const data = { username };
    const config = { headers };
    Axios.post("http://localhost:8000/accounts/follow/", data, config)
      .then((response) => {
        setUserList((prevUserList) =>
          prevUserList.map((user) =>
            user.username !== username ? user : { ...user, is_follow: true }
          )
        );
        refetch();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {/* <button onClick={() => refetch()}>Reload</button> */}
      <Card title="회원님을 위한 추천 " style={{ border: "0.5px solid #E2E2E2" }} size="small">
        {loading && (
          <div className="loading dot">
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
        {error && <div>로딩 중에 에러가 발생했습니다.</div>}
        {userList.map((SuggestionUser) => (
          <Suggestion
            key={SuggestionUser.username}
            SuggestionUser={SuggestionUser}
            onFollowUser={onFollowUser}
            refetch={refetch}
          />
        ))}
      </Card>
    </div>
  );
};

export default SuggestionList;
