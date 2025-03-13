import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Modal, Form, Input, Select, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Agent } from '../types';
import { agentApi } from '../services/api';

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await agentApi.getAll();
      setAgents(response.data);
    } catch (error) {
      message.error('加载AI代理失败');
    }
  };

  const handleCreate = () => {
    setEditingAgent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    form.setFieldsValue(agent);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await agentApi.delete(id);
      message.success('删除成功');
      loadAgents();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingAgent) {
        await agentApi.update(editingAgent.id!, values);
        message.success('更新成功');
      } else {
        await agentApi.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadAgents();
    } catch (error) {
      message.error(editingAgent ? '更新失败' : '创建失败');
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
          IDLE: '空闲',
          RUNNING: '运行中',
          ERROR: '错误',
        };
        return statusMap[status as keyof typeof statusMap];
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Agent) => (
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
            新建代理
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={agents}
          rowKey="id"
        />
        <Modal
          title={editingAgent ? '编辑代理' : '新建代理'}
          open={modalVisible}
          onOk={() => form.submit()}
          onCancel={() => setModalVisible(false)}
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
              name="tools"
              label="工具"
              rules={[{ required: true, message: '请选择工具' }]}
            >
              <Select mode="multiple" placeholder="选择工具">
                {/* TODO: 从API获取可用工具列表 */}
                <Option value="tool1">工具1</Option>
                <Option value="tool2">工具2</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="workflow"
              label="工作流"
              rules={[{ required: true, message: '请输入工作流配置' }]}
            >
              <TextArea rows={6} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Agents; 