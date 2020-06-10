import React, { useState, useEffect } from "react";
import { Select, Input, AutoComplete } from "antd";
import { useHistory, Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import Axios from "axios";
import { useAppContext } from "store";
import querystring from 'querystring';

function PostSearch() {
  const {
    store: { jwtToken },
  } = useAppContext();

  const history = useHistory();
  const [keyword, setKeyword] = useState();
  const [searchData, setSearchData] = useState([]);
  const [user, setUser] = useState([]);

  const renderTitle = title => (
    <span>
      {title}
      <a
        style={{
          float: 'right',
        }}
        href="https://www.google.com/search?q=antd"
        target="_blank"
        rel="noopener noreferrer"
      >
        more
      </a>
    </span>
  );

  const renderItem = (title, idx) => ({
    value: title,
    label: (
      <div
        key={idx}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {title}
        <span>
          <UserOutlined /> {idx}
        </span>
      </div>
    ),
  });

  const options = [
    {
      label: renderTitle('User'),
      // options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
      options : user.map((data, idx)=>renderItem(data, idx))
      
    }
    ,
    {
      label: renderTitle('Tag'),
      options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
    },
  ];

  // #FIXME: 고쳐야함... AutoComplete 어렵다..
  useEffect(() => {
    const apiUrl = `http://localhost:8000/api/posts/all/`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    Axios.get(apiUrl, { headers }).then((res) => {
      console.log("all : ",res.data);
      res.data.map((data) => {
        console.log(data.author.name)
        setUser((prevUser)=> [...prevUser, data.author.name])
      });
    });

  }, [])

  const handleChange = value => {
    setKeyword(value);
  }

  const Complete = () => (
    <>
    <AutoComplete
      style={{
        width: 200,
      }}
      dropdownMatchSelectWidth={500}
      options={options}
      onChange={handleChange}
    >
      <Input.Search size="large" placeholder="input here" />
    </AutoComplete>

    {/* {JSON.stringify(user)} */}
    </>
  );

  return (
    <Complete/>
  );
}

export default PostSearch;
