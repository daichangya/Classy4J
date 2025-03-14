import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../types/Message';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export class WebSocketService {
    private client: Client;
    private messageHandlers: ((message: ChatMessage) => void)[] = [];
    private statusHandlers: ((status: ConnectionStatus) => void)[] = [];
    private activeSubscriptions = new Map<string, any>();
    private pendingSubscriptions: string[] = [];
    private isConnected = false;

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: (str) => {
                console.log('STOMP:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        this.client.onConnect = () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            this.updateConnectionStatus('connected');
            this.processPendingSubscriptions();
        };

        this.client.onDisconnect = () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
            this.updateConnectionStatus('disconnected');
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
        };

        this.connect();
    }

    public connect(): void {
        if (this.client.active) {
            console.log('WebSocket is already active');
            return;
        }

        console.log('Connecting to WebSocket...');
        this.updateConnectionStatus('connecting');
        this.client.activate();
    }

    public disconnect(): void {
        if (this.client.active) {
            this.client.deactivate();
        }
    }

    public subscribeToChat(userId: string): void {
        if (!this.isConnected) {
            console.log('WebSocket not connected, adding to pending subscriptions');
            if (!this.pendingSubscriptions.includes(userId)) {
                this.pendingSubscriptions.push(userId);
            }
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

    private processPendingSubscriptions(): void {
        console.log('Processing pending subscriptions');
        this.pendingSubscriptions.forEach((userId) => {
            this.doSubscribe(userId);
        });
        this.pendingSubscriptions = [];
    }

    private updateConnectionStatus(status: ConnectionStatus): void {
        this.statusHandlers.forEach((handler) => {
            try {
                handler(status);
            } catch (error) {
                console.error('Error in status handler:', error);
            }
        });
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

    public onConnectionStatusChange(handler: (status: ConnectionStatus) => void): void {
        this.statusHandlers.push(handler);
    }
} 