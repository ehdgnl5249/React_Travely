import React, { useState } from "react";
import Image from "react-image-resizer";
import { Avatar, Card, Rate, Tag, Tabs, Col, Modal } from "antd";
// import {
//   EditOutlined,
//   HeartFilled,
//   HeartTwoTone,
//   LikeFilled,
//   DislikeFilled,
// } from "@ant-design/icons";

import "bootstrap/dist/css/bootstrap.min.css";
import CommentList from "../../components/CommentList";
import { Carousel } from "react-bootstrap";

export default function ProfilePost({ post }) {
  const {
    author: { username, name, avatar_url },
    is_quick,
    start_date,
    end_date,
    quick_images,
    quick_locations,
    quick_caption,
    date,
    rating,
    tag_set,
    // is_like,
    like_user,
  } = post;

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Col>
      {/* {JSON.stringify(post)} */}

      {is_quick === true && (
        <>
          <Card
            hoverable
            onClick={showModal}
            cover={
              <Image
                src={quick_images[0].image}
                width={300}
                height={300}
                style={{ border: "0.5px solid #E2E2E2" }}
                alt={quick_images[0].image}
              />
            }
            style={{ width: 300 }}
          ></Card>
          <Modal
            bodyStyle={{ width: "650px" }}
            width={650}
            title={name}
            onOk={handleOk}
            onCancel={handleOk}
            destroyOnClose={true}
            footer={null}
            visible={visible}
          >
            <Card
              headStyle={{ height: "63px", marginTop: "-10px" }}
              hoverable
              title={
                <Card.Meta
                  avatar={
                    <Avatar
                      size="medium"
                      icon={<img src={"http://localhost:8000" + avatar_url} alt={username} />}
                    />
                  }
                  title={<span style={{ fontSize: "14px" }}>{name}</span>}
                  description={
                    quick_locations &&
                    quick_locations.map((quick_location, idx) => (
                      <span style={{ fontSize: "11px" }} key={idx}>
                        {quick_location.quick_location}{" "}
                      </span>
                    ))
                  }
                />
              }
              extra={<span>{start_date}</span>}
              style={{ border: "0.5px solid #E2E2E2" }}
              // style={{ background: "linear-gradient(#ffb, #9198e5)" }}
              cover={
                <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                  {quick_images.map((image, idx) => (
                    <Carousel.Item key={idx}>
                      <Image
                        src={image.image}
                        width={600}
                        height={400}
                        style={{ border: "0.5px solid #E2E2E2" }}
                        alt={image.image}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              }
            >
              <p>{quick_caption}</p>
              <br />
              {tag_set &&
                tag_set.map((tag, idx) => (
                  <Tag color="blue" key={idx}>
                    {tag.name}
                  </Tag>
                ))}
              <br />
              <br />
              <span style={{ fontSize: "14px" }}>{like_user} </span>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>명이 좋아합니다. </span>
              <br />
              <Rate
                allowHalf
                disabled
                defaultValue={Number(rating)}
                style={{ marginBottom: "0.5em" }}
              />
              <CommentList post={post} />
            </Card>
          </Modal>
        </>
      )}
      {is_quick === false && (
        <Card
          hoverable
          cover={
            <Image
              src={date[0].detail_images[0].image}
              width={300}
              height={300}
              style={{ border: "0.5px solid #E2E2E2" }}
              alt={date[0].detail_images[0].image}
            />
          }
          style={{ width: 300 }}
        ></Card>
      )}
    </Col>
  );
}
