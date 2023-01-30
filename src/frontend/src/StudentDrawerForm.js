import { Button, Col, Drawer, Form, Input, Row, Select, Spin } from "antd";
import { addNewStudent } from "./client";
import { successNotification } from "./Notification";
import { useState } from "react";
import { errorResponse } from "./errResponse";

const { Option } = Select;
 

function StudentDrawerForm({ showDrawer, setShowDrawer, fetchStudents}) {  
  const[submitting, SetSubmitting]   = useState(false);
  const onLoad = (form) =>{    
    form.resetFields();
  }
  const onFinish  = (student) => {     
    SetSubmitting(true)   ;    
    addNewStudent(student)
    .then(()=>{        
        onClose();
        successNotification(
            "Student success added",
            `${student.name} was added to the system`
        )
        fetchStudents();
    })
    .catch( err => {
        errorResponse(err, "bottomLeft");
    })
    .finally(()=>{
        SetSubmitting(false);
    });    
  };
 
  const onClose = () => {
    setShowDrawer(false);
  };
  

  return (
    <>     
      <Drawer
        title="Create a new student"
        width={720}
        open={showDrawer}        
        onCancel={onClose}
        onClose={onClose}
        onLoad={onLoad}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <Form
          layout="vertical"
          hideRequiredMark          
          onFinish={onFinish}
          onLoad={onLoad}      
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter student name",
                  },
                ]}
              >
                <Input placeholder="Please enter student name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter student email",
                  },
                ]}
              >
                <Input placeholder="Please enter student email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  {
                    required: true,
                    message: "Please select gender!",
                  },
                ]}
              >
                <Select placeholder="Please select gender">
                  <Option value="MALE">MALE</Option>
                  <Option value="FEMALE">FEMALE</Option>
                  <Option value="OTHER">OTHER</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
                <Button
                  htmlType="button"
                  type="default"
                  onClick={onClose}
                  style={{
                    margin: "0 8px",                    
                  }}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item></Form.Item>
            </Col>
          </Row>
          <Row>
            {submitting && <Spin/>}
          </Row>

        </Form>
      </Drawer>
    </>
  );
}
export default StudentDrawerForm;
