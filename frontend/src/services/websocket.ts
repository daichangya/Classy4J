import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../types/Message';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export class WebSocketService {
    private client: Client;
    private messageHandlers: ((message: ChatMessage) => void)[] = [];
    private statusHandlers: ((status: ConnectionStatus) => void)[] = [];
    private pendingSubscriptions: string[] = [];
    private activeSubscriptions: Map<string, any> = new Map();
    private isConnected: boolean = false;

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            console.log('Connected to WebSocket');
            this.isConnected = true;
            this.notifyStatusChange('connected');
            this.processPendingSubscriptions();
        };

        this.client.onDisconnect = () => {
            console.log('Disconnected from WebSocket');
            this.isConnected = false;
            this.activeSubscriptions.clear();
            this.notifyStatusChange('disconnected');
        };

        this.client.onStompError = (frame) => {
            console.error('WebSocket Error:', frame);
            this.notifyStatusChange('disconnected');
        };
    }

    public connect(): void {
        if (!this.isConnected) {
            this.notifyStatusChange('connecting');
            this.client.activate();
        }
    }

    public disconnect(): void {
        if (this.isConnected) {
            this.client.deactivate();
        }
    }

    public onConnectionStatusChange(handler: (status: ConnectionStatus) => void): void {
        this.statusHandlers.push(handler);
    }

    private notifyStatusChange(status: ConnectionStatus): void {
        this.statusHandlers.forEach(handler => handler(status));
    }

    public subscribeToChat(userId: string): void {
        if (!this.isConnected) {
            this.pendingSubscriptions.push(userId);
            this.connect();
            return;
        }

        this.doSubscribe(userId);
    }

    private doSubscribe(userId: string): void {
        if (this.activeSubscriptions.has(userId)) {
            console.log(`Already subscribed to chat for user: ${userId}`);
            return;
        }

        try {
            console.log(`Attempting to subscribe to /topic/chat/${userId}`);
            const subscription = this.client.subscribe(`/topic/chat/${userId}`, (message) => {
                console.log('Received WebSocket message:', {
                    body: message.body,
                    destination: message.headers?.destination
                });
                
                try {
                    const chatMessage: ChatMessage = JSON.parse(message.body);
                    console.log('Parsed chat message:', chatMessage);
                    this.messageHandlers.forEach((handler) => {
                        try {
                            handler(chatMessage);
                        } catch (error) {
                            console.error('Error in message handler:', error);
                        }
                    });
                } catch (error) {
                    console.error('Failed to parse message:', error);
                }
            });
            
            this.activeSubscriptions.set(userId, subscription);
            console.log(`Successfully subscribed to chat for user: ${userId}`);
        } catch (error) {
            console.error('Failed to subscribe:', error);
            this.pendingSubscriptions.push(userId);
        }
    }

    public unsubscribeFromChat(userId: string): void {
        const subscription = this.activeSubscriptions.get(userId);
        if (subscription) {
            subscription.unsubscribe();
            this.activeSubscriptions.delete(userId);
            console.log(`Unsubscribed from chat for user: ${userId}`);
        }
    }

    private processPendingSubscriptions(): void {
        while (this.pendingSubscriptions.length > 0) {
            const userId = this.pendingSubscriptions.shift();
            if (userId) {
                this.doSubscribe(userId);
            }
        }
    }

    public sendMessage(message: ChatMessage): void {
        if (!this.isConnected) {
            console.error('Cannot send message: WebSocket is not connected');
            return;
        }

        try {
            console.log('Sending WebSocket message:', message);
            this.client.publish({
                destination: '/app/websocket/send',
                body: JSON.stringify(message)
            });
            console.log('Message sent successfully');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    public onMessage(handler: (message: ChatMessage) => void): void {
        this.messageHandlers.push(handler);
    }

    public removeMessageHandler(handler: (message: ChatMessage) => void): void {
        const index = this.messageHandlers.indexOf(handler);
        if (index > -1) {
            this.messageHandlers.splice(index, 1);
        }
    }
} 