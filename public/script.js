let threadId = null;
const messagesDiv = document.getElementById('messages');
const traceDiv = document.getElementById('trace');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = 'msg';
  div.textContent = `${role}: ${text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const value = input.value.trim();
  if (!value) return;
  appendMessage('You', value);
  input.value = '';
  const endpoint = threadId ? `/chat/${threadId}` : '/chat';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: value })
  });
  const data = await res.json();
  if (res.ok) {
    if (!threadId) threadId = data.threadId;
    appendMessage('Agent', data.response);
    traceDiv.textContent = JSON.stringify(data.trace, null, 2);
  } else {
    appendMessage('Agent', data.error || 'Error');
  }
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
