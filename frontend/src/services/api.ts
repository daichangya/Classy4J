import axios from 'axios';
import { Agent, Tool, Workflow } from '../types';
import { message } from 'antd';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
});

// 添加请求拦截器
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 添加响应拦截器
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('响应错误:', error);
        if (error.response) {
            // 服务器返回错误
            message.error(error.response.data?.message || '请求失败');
        } else if (error.request) {
            // 请求发送失败
            message.error('网络连接失败，请检查网络设置');
        } else {
            // 其他错误
            message.error('请求失败，请稍后重试');
        }
        return Promise.reject(error);
    }
);


// 代理相关API
export const agentApi = {
    create: (agent: Agent) =>
        api.post<Agent>('/api/agent', agent),
    get: (id: number) =>
        api.get<Agent>(`/api/agent/${id}`),
    getAll: () =>
        api.get<Agent[]>('/api/agent'),
    update: (id: number, agent: Agent) =>
        api.put<Agent>(`/api/agent/${id}`, agent),
    delete: (id: number) =>
        api.delete(`/api/agent/${id}`),
    execute: (id: number, task: string, parameters: Record<string, any>) =>
        api.post(`/api/agent/${id}/execute`, { task, parameters }),
    getByStatus: (status: Agent['status']) =>
        api.get<Agent[]>(`/api/agent/status/${status}`),
    getByTool: (tool: string) =>
        api.get<Agent[]>(`/api/agent/tool/${tool}`),
};

// 工具相关API
export const toolApi = {
    register: (tool: Tool) =>
        api.post<Tool>('/api/tools', tool),
    get: (id: number) =>
        api.get<Tool>(`/api/tools/${id}`),
    getAll: () =>
        api.get<Tool[]>('/api/tools'),
    update: (id: number, tool: Tool) =>
        api.put<Tool>(`/api/tools/${id}`, tool),
    delete: (id: number) =>
        api.delete(`/api/tools/${id}`),
    execute: (id: number, parameters: Record<string, any>) =>
        api.post(`/api/tools/${id}/execute`, parameters),
    getByStatus: (status: Tool['status']) =>
        api.get<Tool[]>(`/api/tools/status/${status}`),
    getByName: (name: string) =>
        api.get<Tool>(`/api/tools/name/${name}`),
};

// 工作流相关API
export const workflowApi = {
    create: (workflow: Workflow) =>
        api.post<Workflow>('/api/workflows', workflow),
    get: (id: number) =>
        api.get<Workflow>(`/api/workflows/${id}`),
    getAll: () =>
        api.get<Workflow[]>('/api/workflows'),
    update: (id: number, workflow: Workflow) =>
        api.put<Workflow>(`/api/workflows/${id}`, workflow),
    delete: (id: number) =>
        api.delete(`/api/workflows/${id}`),
    execute: (id: number, parameters: Record<string, any>) =>
        api.post(`/api/workflows/${id}/execute`, parameters),
    getByStatus: (status: Workflow['status']) =>
        api.get<Workflow[]>(`/api/workflows/status/${status}`),
    getByName: (name: string) =>
        api.get<Workflow>(`/api/workflows/name/${name}`),
};