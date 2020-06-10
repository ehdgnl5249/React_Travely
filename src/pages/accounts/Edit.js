import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { Form, Input, Button, notification, Card, Upload, message, Modal } from "antd";
import { SmileOutlined, FrownOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppContext, deleteToken } from "store";
import moment from "moment";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function Edit() {
  const history = useHistory();
  const {
    store: { jwtToken },
    dispatch,
  } = useAppContext();

  const headers = { Authorization: `Bearer ${jwtToken}` };
  const [userImage, setUserImage] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [form] = Form.useForm();
  const [modal, setModal] = useState({ visible: false });

  useEffect(() => {
    async function fetchUserInfo() {
      const apiUrl = "http://localhost:8000/accounts/profile/";
      try {
        const { data } = await Axios.get(apiUrl, { headers });
        setUserImage(data.avatar);
        form.setFieldsValue({
          avatar: data.avatar,
          name: data.name,
          birthday: moment(data.birthday),
        });
      } catch (error) {
        console.error(error);
      }
    }
    fetchUserInfo();
  }, []); // mount시 읽어옴

  // 탈퇴 Modal
  const showModal = () => {
    setModal({
      visible: true,
    });
  };

  const handleUserDelete = async (e) => {
    setModal({
      visible: false,
    });
    try {
      await Axios.delete("http://localhost:8000/accounts/delete/", { headers });
      dispatch(deleteToken());
      notification.open({
        message: "회원탈퇴 완료",
        description: "이용해주셔서 감사합니다.",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      history.push("/");
    } catch (error) {
      if (error.response) {
        notification.open({
          message: "회원탈퇴 실패",
          // description: "아이디/암호를 확인해주세요",
          icon: <FrownOutlined style={{ color: "#ff3333" }} />,
        });
      }
    }
  };

  const handleCancel = () => {
    setModal({
      visible: false,
    });
  };

  // 프로필 이미지 처리
  const [imageLoading, setImageLoading] = useState({ loading: false });
  const [fileList, setFileList] = useState([]);

  const beforeUpload = (file) => {
    // 이미지 validation
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("jpg, png 형식이 아닙니다. 확인해주세요.");
    }

    return isJpgOrPng;
  };

  const handleUploadChange = (info) => {
    // 이미지 업로드
    if (info.file.status === "uploading") {
      setImageLoading({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      getBase64(
        info.file.originFileObj,
        (imageUrl) =>
          setImageLoading({
            imageUrl,
            loading: false,
          }),
        setFileList(info)
      );
    }
  };

  // 수정 버튼 클릭 후
  const onFinish = (values) => {
    // 수정 제출
    async function fn() {
      const {
        name,
        avatar: { fileList },
      } = values;
      setFieldErrors({});

      console.log("filelist : ", fileList);

      const formData = new FormData(); // js 기능
      formData.append("name", name);

      if (fileList !== undefined) {
        fileList.forEach((file) => {
          formData.append("avatar", file.originFileObj);
        });
      } else {
        formData.append("avatar", []);
      }

      try {
        await Axios.patch("http://localhost:8000/accounts/profile/", formData, { headers });
        notification.open({
          message: "회원정보 수정 완료",
          description: "메인페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        history.push("/");
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "회원정보 수정 실패",
            // description: "아이디/암호를 확인해주세요",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });
        }
      }
    }
    fn();
  };

  return (
    <Card title="회원정보 수정 페이지">
      <Form
        form={form}
        {...layout}
        onFinish={onFinish}
        //className="login-form"
        // username과 password값이 둘다 있을 때 values값으로 가짐
      >
        <Form.Item
          label="프로필 이미지"
          name="avatar"
          filelist={fileList}
          // rules={[{ required: true, message: "프로필 사진을 넣어주세요." }]}
          hasFeedback
          {...fieldErrors.avatar}
        >
          <Upload
            listType="picture-card"
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          >
            {imageLoading.imageUrl ? (
              <img src={imageLoading.imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              <div>
                {imageLoading.loading ? (
                  <LoadingOutlined />
                ) : userImage && userImage ? (
                  <img src={userImage} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  <PlusOutlined />
                )}
                <div className="ant-upload-text">업로드</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          label="이름"
          name="name"
          rules={[{ required: true, message: "이름을 입력해주세요." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" style={{ margin: "0 15px" }} htmlType="submit">
            수정
          </Button>
          <Button type="danger" style={{ margin: "15px" }} onClick={showModal}>
            탈퇴
          </Button>
          <Modal
            title="회원 탈퇴"
            visible={modal.visible}
            onOk={handleUserDelete}
            onCancel={handleCancel}
          >
            <p> 탈퇴 하시겠습니까? </p>
          </Modal>
        </Form.Item>
      </Form>
    </Card>
  );
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  // antd 는 하나의 행을 24칸으로 나눈 디자인
};

const tailLayout = {
  wrapperCol: { offset: 15, span: 16 },

  // button에는 앞에 레이블이 없음. 21칸 띄워주고 16칸 시작
};

export default Edit;
