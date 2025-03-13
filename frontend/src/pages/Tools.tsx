import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Tool, ToolParameter } from '../types';
import { toolApi } from '../services/api';

const { Content } = Layout;
const { TextArea } = Input;

const Tools: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const response = await toolApi.getAll();
      setTools(response.data);
    } catch (error) {
      message.error('加载工具失败');
    }
  };

  const handleCreate = () => {
    setEditingTool(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    form.setFieldsValue(tool);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await toolApi.delete(id);
      message.success('删除成功');
      loadTools();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTool) {
        await toolApi.update(editingTool.id!, values);
        message.success('更新成功');
      } else {
        await toolApi.register(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadTools();
    } catch (error) {
      message.error(editingTool ? '更新失败' : '创建失败');
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
          ACTIVE: '活跃',
          INACTIVE: '未激活',
          ERROR: '错误',
        };
        return statusMap[status as keyof typeof statusMap];
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Tool) => (
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
            disabled={record.status !== 'ACTIVE'}
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
            新建工具
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={tools}
          rowKey="id"
        />
        <Modal
          title={editingTool ? '编辑工具' : '新建工具'}
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
              name="implementation"
              label="实现类"
              rules={[{ required: true, message: '请输入实现类全限定名' }]}
            >
              <Input />
            </Form.Item>
            <Form.List name="parameters">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: '请输入参数名' }]}
                      >
                        <Input placeholder="参数名" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        rules={[{ required: true, message: '请输入参数类型' }]}
                      >
                        <Input placeholder="参数类型" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        rules={[{ required: true, message: '请输入参数描述' }]}
                      >
                        <Input placeholder="参数描述" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'required']}
                        valuePropName="checked"
                      >
                        <Input type="checkbox" /> 必填
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'defaultValue']}>
                        <Input placeholder="默认值" />
                      </Form.Item>
                      <Button type="link" danger onClick={() => remove(name)}>
                        删除
                      </Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      添加参数
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Tools;