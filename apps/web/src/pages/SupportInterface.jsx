import React, { useState, useRef, useEffect } from 'react';
import { Mic, Image as ImageIcon, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function SupportInterface() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: '👋 Hello! I am your OmniNexus AI Assistant powered by advanced AI. I can help you with corporate finance, compliance, data analytics, and platform navigation. How can I assist you today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Build conversation history
            const history = messages.slice(1).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await fetch(`${API_URL}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    conversation_history: history
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            const assistantMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.response
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('AI Error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: '⚠️ I apologize, but I encountered an error. Please ensure the backend is running and API keys are configured.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        "Explain loan restructuring workflow",
        "Check compliance requirements",
        "How does the predictive model work?",
        "What are the KYC documentation standards?"
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-xl">AI Support Assistant</h2>
                            <p className="text-white/80 text-sm">Powered by OpenAI & Anthropic</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm">Live</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`p-2 rounded-lg shrink-0 ${msg.role === 'user'
                                    ? 'bg-primary-600'
                                    : 'bg-gradient-to-br from-purple-600 to-primary-600'
                                }`}>
                                {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
                            </div>
                            <div className={`p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-primary-600 text-white rounded-br-none'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-purple-600 to-primary-600 rounded-lg">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div className="p-4 bg-slate-800 rounded-2xl rounded-bl-none border border-slate-700">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="animate-spin text-primary-500" size={16} />
                                    <span className="text-slate-400 text-sm">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
                <div className="px-6 py-4 bg-slate-850 border-t border-slate-800">
                    <p className="text-xs text-slate-500 mb-3">Quick Actions:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => setInput(action)}
                                className="text-left text-sm px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 hover:border-primary-500"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 bg-slate-850 rounded-b-xl border-t border-slate-800">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder="Ask anything about OmniNexus platform, policies, or workflows..."
                        disabled={isLoading}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-6 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full hover:from-primary-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
