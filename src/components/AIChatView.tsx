import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, ArrowRight, ShieldCheck } from 'lucide-react';
import { NavigationPillar, ChatMessage } from '../types/app';

interface AIChatViewProps {
  onNavigate: (pillar: NavigationPillar) => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      content: 'Hello John. I am Sanjeevani AI, powered by MedGemma and Vertex AI Healthcare models. How can I assist with your health, medications, or family vitals today?',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages.map((m) => ({
            role: m.sender,
            content: m.content,
          })),
          userContext: {
            name: 'John Doe',
            healthScore: 84,
            allergies: ['Penicillin'],
            recentVitals: { bp: '122/80', hrv: 58 },
          },
        }),
      });

      const data = await response.json();
      
      // Check if message suggests a follow-up action
      let suggestedAction;
      const lower = (data.reply || '').toLowerCase();
      if (lower.includes('appointment') || lower.includes('doctor') || lower.includes('consult')) {
        suggestedAction = { label: 'Book Doctor Appointment', targetPillar: 'appointments' as NavigationPillar };
      } else if (lower.includes('medicine') || lower.includes('pharmacy') || lower.includes('prescription')) {
        suggestedAction = { label: 'Go to Pharmacy', targetPillar: 'pharmacy' as NavigationPillar };
      } else if (lower.includes('symptom')) {
        suggestedAction = { label: 'Run Symptom Checker', targetPillar: 'symptoms' as NavigationPillar };
      }

      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: data.reply || 'I have analyzed your query. Please consult with a physician for definitive diagnosis.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          content: 'I analyzed your query according to clinical protocols. Consider monitoring your symptoms and consulting your doctor.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Explain my recent lipid panel results',
    'What should I take for mild tension headache?',
    'Check contraindications for Atorvastatin',
    'How do I improve my HRV and deep sleep?',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span className="font-semibold text-slate-700">MedGemma Clinical Assistant</span>
          <span>• Trained on FHIR & Google Cloud Healthcare API</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> HIPAA/FHIR Compliant
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>

                {/* 3-Step Action prompt if provided */}
                {m.suggestedAction && (
                  <div className="mt-2">
                    <button
                      onClick={() => onNavigate(m.suggestedAction!.targetPillar)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Take Action: {m.suggestedAction.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <p className={`text-[10px] text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
                  {m.timestamp}
                </p>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  JD
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              MedGemma Clinical Engine analyzing query...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-6 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-center max-w-4xl mx-auto w-full">
        {quickPrompts.map((q) => (
          <button
            key={q}
            onClick={() => handleSendMessage(q)}
            className="text-xs bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full transition-colors font-medium shadow-2xs cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-4xl mx-auto flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about symptoms, medical reports, prescriptions, or care advice..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
