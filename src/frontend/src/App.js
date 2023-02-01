import React, { useEffect, useState } from "react";
import logo from "./logo.png";

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Table,
  Spin,
  Empty,
  Button,
  Tag,
  Badge,
  Space,
  Avatar,
  Radio,
  Popconfirm,
  Divider,
  Image,
} from "antd";

import { deleteStudent, getAllStudents } from "./client";
import "./App.css";
import StudentDrawerForm from "./StudentDrawerForm";
import { successNotification } from "./Notification";
import { errorResponse } from "./errResponse";

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const TheAvatar = ({ student }) => {
  const newName = student.name.trim();
  const split = newName.split(" ");
  let classAvatar = "";
  switch (student.gender) {
    case "MALE":
      classAvatar = "avatarBlue";
      break;
    case "FEMALE":
      classAvatar = "avatarMagenta";
      break;
    case "OTHER":
      classAvatar = "avatarOrange";
      break;
    default:
      classAvatar = "avatarBlack";
      break;
  }
  if (newName.length === 0) {
    return <Avatar className="avatarBlack" icon={<UserOutlined />} />;
  }
  if (split.length === 1) {
    return (
      <Avatar className={classAvatar}>
        {split[0].charAt(0).toUpperCase()}
      </Avatar>
    );
  }
  return (
    <Avatar className={classAvatar}>
      {split[0].charAt(0).toUpperCase()}
      {split[1].charAt(0).toUpperCase()}
    </Avatar>
  );
};

const removeStudent = (student, callback) => {
  deleteStudent(student.id)
    .then(() => {
      successNotification(
        "Student deleted",
        `Student ${student.name} was deleted`
      );
    })
    .catch((err) => {
      errorResponse(err, "topRight");
    });
  callback();
};

const columns = (fetchStudents) => [
  {
    title: "",
    dataIndex: "action",
    key: "action",
    render: (text, student) => (
      <Radio.Group>
        <Popconfirm
          title="Delete student"
          description={`Are you sure to delete student ${student.name}?`}
          onConfirm={() => removeStudent(student, fetchStudents)}
          okText="Yes"
          cancelText="No"
        >
          <Radio.Button value="delete" size="small">
            Delete
          </Radio.Button>
        </Popconfirm>
        <Radio.Button value="edit" size="small">
          Edit
        </Radio.Button>
      </Radio.Group>
    ),
  },
  {
    title: "",
    dataIndex: "avatar",
    key: "avatar",
    render: (text, student) => <TheAvatar student={student} />,
  },
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
];

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [students, setStudents] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const fetchStudents = () =>
    getAllStudents()
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setStudents(data);
      })
      .catch((err) => {
        errorResponse(err, "topRight");
      })
      .finally(() => setFetching(false));

  useEffect(() => {
    fetchStudents();
  }, []);

  const renderStudents = () => {
    if (fetching) {
      return (
        <Spin tip="Loading...">
          <div className="content" />
        </Spin>
      );
    }
    if (students.length <= 0) {
      return (
        <>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowDrawer(!showDrawer)}
            >
              Add Student
            </Button>
          </Space>
          <StudentDrawerForm
            showDrawer={showDrawer}
            setShowDrawer={setShowDrawer}
            fetchStudents={fetchStudents}
          />
          <Empty />
        </>
      );
    }
    return (
      <>
        <StudentDrawerForm
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          fetchStudents={fetchStudents}
        />
        <Table
          dataSource={students}
          columns={columns(fetchStudents)}
          bordered
          title={() => (
            <>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowDrawer(!showDrawer)}
                >
                  Add Student
                </Button>
              </Space>
            </>
          )}
          pagination={{ pageSize: 50 }}
          scroll={{ y: 400 }}
          footer={() => (
            <Space>
              <Tag color="blue">Number of students</Tag>
              <Badge count={students.length} color="#1677ff" />
            </Space>
          )}
          rowKey={(student) => student.id}
        />
      </>
    );
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
            minWidth: 400,
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {renderStudents()}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          <Image width={75} src={logo} alt={"logo"} />
          <Divider>
            Ant Design ©2023 Created by @laguz81 &nbsp;
            <a href="https://amigoscode.com/courses/full-stack-spring-boot-react" target="_blank" rel="noreferrer" >
              {" "}
              FullStack Course
            </a>
          </Divider>
        </Footer>
      </Layout>
    </Layout>
  );
}
export default App;
