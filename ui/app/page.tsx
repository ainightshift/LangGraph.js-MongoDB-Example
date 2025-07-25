'use client';

import { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'agent';
  text: string;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: input }]);
    setLoading(true);
    const endpoint = threadId ? `/chat/${threadId}` : '/chat';
    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      if (!threadId) setThreadId(data.threadId);
      const text = threadId ? data.response : data.response;
      setMessages((m) => [...m, { role: 'agent', text }]);
    } catch (err: any) {
      setMessages((m) => [...m, { role: 'agent', text: err.message }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>LangGraph Chat UI</h1>
      <div style={{ height: 400, overflowY: 'auto', background: '#fff', padding: '1rem', border: '1px solid #ccc' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            <strong>{m.role === 'user' ? 'You' : 'Agent'}:</strong> {m.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: '1rem' }}>
        <input
          style={{ flexGrow: 1, marginRight: '0.5rem' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message" />
        <button onClick={sendMessage} disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
      </div>
    </main>
  );
}
