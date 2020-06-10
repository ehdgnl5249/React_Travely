import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Upload,
  notification,
  DatePicker,
  Rate,
  Tag,
  Tooltip,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, FrownOutlined } from "@ant-design/icons";
import { getBase64FromFile } from "utils/base64";
import Axios from "axios";
import { useAppContext } from "store";
import { parseErrorMessages } from "utils/forms";
import { useHistory } from "react-router-dom";

export default function PostQuickNewForm() {
  const {
    store: { jwtToken },
  } = useAppContext();

  const history = useHistory();

  const [fieldErrors, setFieldErrors] = useState({});
  const [previewPhoto, setPreviewPhoto] = useState({
    visible: false, // modal 처리, 보여줄지 말지
    base64: null, // base64으로 인코딩해서
  });
  const [fileList, setFileList] = useState([]);
  const [date, setDate] = useState([]);
  const [rate, setRate] = useState();

  const [tagList, setTagList] = useState({
    tags: [],
    inputVisible: false,
    inputValue: "",
  });

  const handleClose = (removedTag) => {
    const tags = tagList.tags.filter((tag) => tag !== removedTag);
    console.log(tags);
    setTagList({ ...tagList, tags });
  };

  const showInput = () => {
    setTagList({ ...tagList, inputVisible: true });
  };

  const handleChange = (e) => {
    setTagList({ ...tagList, inputValue: e.target.value });
  };

  const handleInputConfirm = () => {
    const { inputValue } = tagList;
    let { tags } = tagList;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    setTagList({
      ...tagList,
      tags,
      inputVisible: false,
      inputValue: "",
    });
  };

  // 사진 미리보기
  const handlePreviewPhoto = async (file) => {
    if (!file.url && !file.preview) {
      // url과 preview 가 없다면
      file.preview = await getBase64FromFile(file.originFileObj);
    }
    setPreviewPhoto({
      visible: true,
      base64: file.url || file.preview, // url이 있으면 그대로 하고 없으면 preview
    });
  };

  // 사진 업로드
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // 날짜 입력
  const onChange = (date, dateString) => {
    setDate(dateString);
  };

  // Submit
  const handleFinish = async (fieldValues) => {
    const {
      quick_caption,
      quick_location,
      image: { fileList },
    } = fieldValues;

    const formData = new FormData(); // js 기능

    formData.append("is_quick", true);
    formData.append("start_date", date);
    formData.append("quick_caption", quick_caption);
    formData.append("rating", rate);
    quick_location.forEach((location) => {
      formData.append("quick_location", location);
    });

    tagList.tags.forEach((tag) => {
      formData.append("tag", tag);
    });

    fileList.forEach((file) => {
      console.log("file : ", file.originFileObj);
      formData.append("image", file.originFileObj);
    });

    const headers = { Authorization: `Bearer ${jwtToken}` };
    try {
      const response = await Axios.post("http://127.0.0.1:8000/api/posts/", formData, { headers });
      console.log("success response :", response);
      history.push("/");
    } catch (error) {
      if (error.response) {
        const { status, data: fieldsErrorMessages } = error.response;
        if (typeof fieldsErrorMessages === "string") {
          notification.open({
            message: "서버 오류",
            description: `에러) ${status} 응답을 받았습니다.`,
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });
        } else {
          setFieldErrors(parseErrorMessages(fieldsErrorMessages));
        }
      }
    }
  };

  return (
    <Form
      {...layout}
      style={{ border: "0.5px solid #E2E2E2" }}
      onFinish={handleFinish}
      autoComplete={"false"}
    >
      <Form.Item
        label="여행 날짜"
        name="start_date"
        rules={[{ required: true, message: "날짜를 입력해주세요." }]}
      >
        <DatePicker onChange={onChange} />
      </Form.Item>

      {/* 사진 업로드 */}
      <Form.Item
        label="여행 사진을 올려주세요."
        name="image"
        // filelist={fileList}
        rules={[{ required: true, message: "사진을 입력해주세요." }]}
        hasFeedback
        {...fieldErrors.photo}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={() => {
            return false;
          }}
          onChange={handleUploadChange}
          onPreview={handlePreviewPhoto}
        >
          <div>
            <PlusOutlined />
            <div className="ant-upload-text">Upload</div>
          </div>
        </Upload>
      </Form.Item>
      {/* 사진 업로드 */}

      <Form.Item
        label="리뷰를 작성해주세요."
        name="quick_caption"
        rules={[{ required: true, message: "내용을 입력해주세요" }]}
        hasFeedback
        {...fieldErrors.caption}
        {...fieldErrors.non_field_errors}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.List name="quick_location">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <Form.Item
                  label={index >= 0 ? "어디를 다녀오셨나요?" : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    label={"여행지" + index}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "입력해주시거나 삭제해주세요.",
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="여행지" style={{ width: "60%" }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: "0 8px" }}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item label="여행지">
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: "60%" }}
                >
                  <PlusOutlined /> 여행지 추가
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>

      <Form.Item
        label="이번 여행은 어떠셨나요?"
        // name="rating"
        help="마우스를 올려보세요."
        rules={[{ required: true, message: "평점을 입력해주세요" }]}
      >
        <Rate
          style={{ background: "#F2F2F2" }}
          allowHalf
          allowClear={false}
          value={rate}
          onChange={(value) => setRate(value)}
        />
      </Form.Item>

      <Form.Item
        label="어느 곳을 다녀오셨나요?"
        // name="tag"
        help="입력 후 Enter 키를 눌러주세요."
      >
        {tagList.tags &&
          tagList.tags.map((tag, index) => {
            const isLongTag = tag.length > 15;

            const tagElem = (
              <Tag key={tag} closable onClose={() => handleClose(tag)}>
                <span>{isLongTag ? `${tag.slice(0, 15)}...` : tag}</span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
        {tagList.inputVisible && (
          <Input
            //ref={saveRef}
            value={tagList.inputValue}
            onChange={handleChange}
            onPressEnter={handleInputConfirm}
          />
        )}
        {!tagList.inputVisible && (
          <Tag onClick={showInput}>
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          등록하기
        </Button>
      </Form.Item>

      <Modal
        visible={previewPhoto.visible}
        footer={null}
        onCancel={() => setPreviewPhoto({ visible: false })}
      >
        <img src={previewPhoto.base64} style={{ width: "100%" }} alt="Preview" />
      </Modal>

      
      {/* {JSON.stringify(fileList)} */}
      {JSON.stringify(rate)}
      {/* {JSON.stringify(tagList)} */}
    </Form>
  );
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  // antd 는 하나의 행을 24칸으로 나눈 디자인
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
  // button에는 앞에 레이블이 없기에 그만큼 8칸 띄워주고 16칸 시작
};
