import React, { useState, useRef, useEffect } from 'react';
import { Mic, Image as ImageIcon, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

// Smart mock responses for demo mode (when backend is not available)
const generateMockResponse = (input) => {
    const lowerInput = input.toLowerCase();

    // Compliance related
    if (lowerInput.includes('compliance') || lowerInput.includes('kyc') || lowerInput.includes('aml')) {
        return `**Compliance Overview**

Based on your query about compliance, here's what I can help with:

📋 **KYC Requirements:**
- Valid government-issued ID
- Proof of address (utility bill, bank statement)
- Beneficial ownership declaration
- Source of funds documentation

⚠️ **Current Alerts:**
- 4 pending deliverables require attention
- 2 entities approaching deadline

Navigate to **Compliance Sentinel** for detailed tracking and automated monitoring.`;
    }

    // Loan related
    if (lowerInput.includes('loan') || lowerInput.includes('restructur') || lowerInput.includes('covenant')) {
        return `**Loan Management Insights**

Your portfolio currently shows:

💰 **Portfolio Summary:**
- Total Outstanding: $2.4B across 52 loans
- Compliant: 85% of portfolio
- Warning Status: 10% (5 loans)
- Breach Status: 5% (3 loans)

🔄 **Restructuring Workflow:**
1. Identify distressed assets
2. Conduct financial analysis
3. Propose amendment terms
4. Coordinate with legal
5. Execute documentation

Visit the **Loan Management** page for detailed covenant tracking.`;
    }

    // Reports related
    if (lowerInput.includes('report') || lowerInput.includes('pitch') || lowerInput.includes('cim')) {
        return `**Report Generation**

I can help you generate investment banking reports:

📊 **Available Report Types:**
- **Pitch Book** - Company overview & investment thesis
- **CIM** - Confidential Information Memorandum
- **Teaser** - One-page investment summary
- **Financial Model** - 3-statement Excel model

Navigate to **IB Reports** and select a company from the dropdown to generate professional documents in PDF or Excel format.`;
    }

    // Predictive model
    if (lowerInput.includes('predict') || lowerInput.includes('model') || lowerInput.includes('analytics')) {
        return `**Predictive Analytics**

OmniNexus uses machine learning for:

🔮 **Risk Prediction:**
- Covenant breach probability (85% accuracy)
- Default likelihood scoring
- Cash flow forecasting

📈 **Key Metrics Tracked:**
- Debt/EBITDA trends
- Interest coverage ratio
- Current ratio analysis

The models are trained on historical data and update in real-time with new inputs.`;
    }

    // Data ingestion
    if (lowerInput.includes('data') || lowerInput.includes('upload') || lowerInput.includes('api')) {
        return `**Data Ingestion**

OmniNexus supports multiple data sources:

📥 **File Upload:**
- Drag & drop PDF, CSV, XLSX, JSON
- Automatic parsing and validation

🔗 **API Integrations:**
- Bloomberg Terminal (Real-time)
- Reuters Eikon (Connected)
- S&P Capital IQ (Active)
- Moody's Analytics (Active)

Visit **Data Ingestion** to manage connections and uploads.`;
    }

    // Dashboard / general
    if (lowerInput.includes('dashboard') || lowerInput.includes('overview') || lowerInput.includes('command')) {
        return `**Command Center Overview**

Your dashboard provides real-time visibility:

📊 **Key Metrics:**
- Active Corporate Actions: 12
- Total Exposure: $5.6B
- Compliance Rate: 94.2%

🗓️ **Compliance Heatmap:**
Click any day to see detailed events and status.

📢 **Recent Events:**
Live feed of system alerts and actions.`;
    }

    // Default helpful response
    return `Thanks for your question! I'm your OmniNexus AI Assistant.

I can help you with:
• **Compliance** - KYC, AML, documentation requirements
• **Loans** - Portfolio tracking, covenants, restructuring
• **Reports** - Pitch Books, CIMs, Financial Models
• **Analytics** - Predictive insights, risk scoring
• **Data** - File uploads, API integrations

What would you like to explore?`;
};

export default function SupportInterface() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: '👋 Hello! I am your OmniNexus AI Assistant. I can help you with corporate finance, compliance, data analytics, and platform navigation. How can I assist you today?'
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
        const userInput = input;
        setInput('');
        setIsLoading(true);

        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const assistantMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: generateMockResponse(userInput)
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
    };

    const quickActions = [
        "Explain loan restructuring workflow",
        "Check compliance requirements",
        "How do I generate reports?",
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
                            <p className="text-white/80 text-sm">Powered by OmniNexus Intelligence</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm">Online</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 p-6 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-primary-600' : 'bg-slate-700'}`}>
                                {message.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
                            </div>
                            <div className={`p-4 rounded-xl ${message.role === 'user'
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-800 text-slate-200'
                                }`}>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {message.content.split('\n').map((line, i) => {
                                        if (line.startsWith('**') && line.endsWith('**')) {
                                            return <p key={i} className="font-bold text-white mt-2 mb-1">{line.replace(/\*\*/g, '')}</p>;
                                        }
                                        if (line.startsWith('•') || line.startsWith('-')) {
                                            return <p key={i} className="ml-2">{line}</p>;
                                        }
                                        return <p key={i}>{line}</p>;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-slate-700">
                                <Bot size={18} className="text-white" />
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl">
                                <Loader2 className="animate-spin text-primary-400" size={20} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="bg-slate-850 border-t border-slate-800 p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => setInput(action)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors border border-slate-700"
                        >
                            {action}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask anything about OmniNexus..."
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 rounded-xl transition-colors"
                    >
                        <Send size={20} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
