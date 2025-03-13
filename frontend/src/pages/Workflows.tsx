import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Workflow } from '../types';
import { workflowApi } from '../services/api';

const { Content } = Layout;
const { TextArea } = Input;

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await workflowApi.getAll();
      setWorkflows(response.data);
    } catch (error) {
      message.error('加载工作流失败');
    }
  };

  const handleCreate = () => {
    setEditingWorkflow(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    form.setFieldsValue(workflow);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await workflowApi.delete(id);
      message.success('删除成功');
      loadWorkflows();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingWorkflow) {
        await workflowApi.update(editingWorkflow.id!, values);
        message.success('更新成功');
      } else {
        await workflowApi.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadWorkflows();
    } catch (error) {
      message.error(editingWorkflow ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          DRAFT: '草稿',
          ACTIVE: '活跃',
          RUNNING: '运行中',
          COMPLETED: '已完成',
          ERROR: '错误',
        };
        return statusMap[status as keyof typeof statusMap];
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Workflow) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id!)}
          />
          <Button
            type="text"
            icon={<PlayCircleOutlined />}
            disabled={record.status === 'RUNNING'}
            onClick={() => {/* TODO: 实现执行逻辑 */}}
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Content>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建工作流
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={workflows}
          rowKey="id"
        />
        <Modal
          title={editingWorkflow ? '编辑工作流' : '新建工作流'}
          open={modalVisible}
          onOk={() => form.submit()}
          onCancel={() => setModalVisible(false)}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="名称"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
              rules={[{ required: true, message: '请输入描述' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="steps"
              label="步骤"
              rules={[{ required: true, message: '请添加工作流步骤' }]}
            >
              <TextArea rows={10} placeholder="请以JSON格式输入工作流步骤" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Workflows; 