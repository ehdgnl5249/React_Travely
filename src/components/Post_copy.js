import React, { useState } from "react";
import Image from "react-image-resizer";
import { Avatar, Card, Rate, Tag, Tabs } from "antd";
import { EditOutlined, HeartFilled, HeartTwoTone } from "@ant-design/icons";
import "./Post.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import CommentList from "./CommentList";
import { Carousel } from "react-bootstrap";

function Post({ post, handleLike }) {
  const {
    author,
    is_quick,
    start_date,
    end_date,
    quick_images,
    quick_locations,
    quick_caption,
    date,
    rating,
    tag_set,
    is_like,
    like_user,
  } = post;

  const { username, name, avatar_url } = author;
  const [index, setIndex] = useState(0);
  const [CommentVisible, setCommentVisible] = useState(false);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div style={{ marginBottom: "2em", width: "600px", MaxHeight: "1000px" }}>
      {/* 간편 리뷰 게시물 */}
      {is_quick === true && (
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
          actions={[
            is_like ? (
              <HeartFilled
                style={{ color: "#FF0000" }}
                onClick={() => handleLike({ post, isLike: false, likeUser: like_user - 1 })}
              />
            ) : (
              <HeartTwoTone
                twoToneColor="#FF0000"
                onClick={() => handleLike({ post, isLike: true, likeUser: like_user + 1 })}
              />
            ),
            <EditOutlined key="edit" onClick={() => setCommentVisible(!CommentVisible)} />,
          ]}
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
          <CommentList post={post} visible={CommentVisible} />
        </Card>
      )}

      {/* 상세 리뷰 게시물 */}
      {is_quick === false && (
        <Tabs defaultActiveKey="0">
          {date.map((date, idx) => (
            <Tabs.TabPane tab={date.day} key={idx}>
              {/* Tab 창 없애고 함수로 만들어보자 */}
              <Card
                headStyle={{ height: "63px", marginTop: "-10px" }}
                title={
                  <Card.Meta
                    avatar={
                      <Avatar
                        size="medium"
                        icon={<img src={"http://localhost:8000" + avatar_url} alt={username} />}
                      />
                    }
                    title={<span style={{ fontSize: "14px" }}>{name}</span>}
                    description={date.detail_locations.map((locations, idx) => (
                      <span style={{ fontSize: "11px" }} key={idx}>
                        {locations.location}{" "}
                      </span>
                    ))}
                  />
                }
                extra={
                  <span>
                    {start_date} ~ {end_date}{" "}
                  </span>
                }
                hoverable={true}
                style={{ border: "0.5px solid #E2E2E2" }}
                // style={{ background: "linear-gradient(#fff, #3f87a6, #fff)" }}
                cover={
                  date.detail_images.length > 1 ? (
                    <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                      {date.detail_images.map((images, idx) => (
                        <Carousel.Item key={idx}>
                          <Image
                            src={images.image}
                            width={600}
                            height={400}
                            style={{ border: "0.5px solid #E2E2E2" }}
                            alt={images.image}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <div>
                      {date.detail_images.map((images, idx) => (
                        <Image
                          src={images.image}
                          key={idx}
                          width={600}
                          height={400}
                          alt={images.image}
                        />
                      ))}
                    </div>
                  )
                }
                actions={[
                  is_like ? (
                    <HeartFilled
                      style={{ color: "#FF0000" }}
                      onClick={() => handleLike({ post, isLike: false, likeUser: like_user - 1 })}
                    />
                  ) : (
                    <HeartTwoTone
                      twoToneColor="#FF0000"
                      onClick={() => handleLike({ post, isLike: true, likeUser: like_user + 1 })}
                    />
                  ),
                  <EditOutlined key="edit" onClick={() => setCommentVisible(!CommentVisible)} />,
                ]}
              >
                <p>{date.caption}</p>
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
                <Rate allowHalf disabled defaultValue={Number(date.rating)} />
                <CommentList post={post} visible={CommentVisible} />
              </Card>
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </div>
  );
}

export default Post;
