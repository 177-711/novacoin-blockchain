let currentUser = 'creator';
const API_BASE = 'http://localhost:3030/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
});

async function loadUserData() {
  currentUser = document.getElementById('currentUser').value.trim() || 'creator';
  await Promise.all([loadBalance(), loadTotalSupply()]);
  toggleMintSection();
  showMessage(`Logged in as: ${currentUser}`, 'success');
}

function toggleMintSection() {
  const mintSection = document.getElementById('mintSection');
  if (currentUser === 'creator') {
    mintSection.classList.remove('hidden');
  } else {
    mintSection.classList.add('hidden');
  }
}

async function loadBalance() {
  try {
    const response = await fetch(`${API_BASE}/balance/${encodeURIComponent(currentUser)}`);
    const data = await response.json();
    if (data.success) {
      document.getElementById('userBalance').textContent = `${Number(data.data).toLocaleString()} NOVA`;
    } else { throw new Error(data.error || 'Failed to load balance'); }
  } catch (e) {
    document.getElementById('userBalance').textContent = 'Error';
    showMessage('Failed to load balance', 'error');
  }
}

async function loadTotalSupply() {
  try {
    const response = await fetch(`${API_BASE}/supply`);
    const data = await response.json();
    if (data.success) {
      document.getElementById('totalSupply').textContent = `${Number(data.data).toLocaleString()} NOVA`;
    } else { throw new Error(data.error || 'Failed to load total supply'); }
  } catch (e) {
    document.getElementById('totalSupply').textContent = 'Error';
    showMessage('Failed to load total supply', 'error');
  }
}

async function transferTokens() {
  const to = document.getElementById('transferTo').value.trim();
  const amount = parseInt(document.getElementById('transferAmount').value, 10);

  if (!to || !amount || amount <= 0) {
    showMessage('Please enter valid recipient and amount', 'error');
    return;
  }
  if (to === currentUser) {
    showMessage('Cannot transfer to yourself', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: currentUser, to, amount })
    });
    const data = await response.json();
    if (data.success) {
      showMessage(`Successfully transferred ${amount} NOVA to ${to}`, 'success');
      document.getElementById('transferTo').value = '';
      document.getElementById('transferAmount').value = '';
      await loadBalance();
      await loadTotalSupply();
      await loadBlockchain();
    } else { throw new Error(data.error || 'Transfer failed'); }
  } catch (e) {
    showMessage(`Transfer failed: ${e.message}`, 'error');
  }
}

async function mintTokens() {
  if (currentUser !== 'creator') {
    showMessage('Only the creator can mint tokens', 'error');
    return;
  }
  const to = document.getElementById('mintTo').value.trim();
  const amount = parseInt(document.getElementById('mintAmount').value, 10);

  if (!to || !amount || amount <= 0) {
    showMessage('Please enter valid recipient and amount', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, amount, minter: currentUser })
    });
    const data = await response.json();
    if (data.success) {
      showMessage(`Successfully minted ${amount} NOVA to ${to}`, 'success');
      document.getElementById('mintTo').value = '';
      document.getElementById('mintAmount').value = '';
      await loadBalance();
      await loadTotalSupply();
      await loadBlockchain();
    } else { throw new Error(data.error || 'Mint failed'); }
  } catch (e) {
    showMessage(`Mint failed: ${e.message}`, 'error');
  }
}

async function exploreBalance() {
  const userId = document.getElementById('exploreUser').value.trim();
  if (!userId) { showMessage('Please enter a user ID', 'error'); return; }

  try {
    const response = await fetch(`${API_BASE}/balance/${encodeURIComponent(userId)}`);
    const data = await response.json();
    if (data.success) {
      document.getElementById('explorerResult').innerHTML = `
        <strong>User:</strong> ${userId}<br />
        <strong>Balance:</strong> ${Number(data.data).toLocaleString()} NOVA
      `;
    } else { throw new Error(data.error || 'Failed to load balance'); }
  } catch (e) {
    document.getElementById('explorerResult').innerHTML = `<span style="color: #fca5a5;">Error: ${e.message}</span>`;
  }
}

async function loadBlockchain() {
  try {
    const response = await fetch(`${API_BASE}/blockchain`);
    const wrapper = await response.json();
    if (!wrapper.success) throw new Error(wrapper.error || 'Failed to load blockchain');
    const blockchain = wrapper.data;
    let html = `
      <h4>Token Info</h4>
      <p><strong>Name:</strong> ${escapeHtml(blockchain.token.name)}</p>
      <p><strong>Symbol:</strong> ${escapeHtml(blockchain.token.symbol)}</p>
      <p><strong>Total Supply:</strong> ${Number(blockchain.token.total_supply).toLocaleString()}</p>
      <p><strong>Creator:</strong> ${escapeHtml(blockchain.token.creator)}</p>
      <h4 style="margin-top:10px;">Holders (${Object.keys(blockchain.token.balances || {}).length})</h4>
      ${(() => {
        const entries = Object.entries(blockchain.token.balances || {});
        entries.sort((a,b) => Number(b[1]) - Number(a[1]));
        return `<div style=\"margin:8px 0;\">${entries.map(([user, bal]) => `
          <div style=\"display:flex;justify-content:space-between;gap:10px;\">
            <span>${escapeHtml(user)}</span>
            <span>${Number(bal).toLocaleString()} NOVA</span>
          </div>
        `).join('')}</div>`;
      })()}
      <h4 style="margin-top:10px;">Blocks (${blockchain.chain.length})</h4>
    `;
    blockchain.chain.forEach((block) => {
      const ts = new Date(block.timestamp).toLocaleString();
      html += `
        <div class="block">
          <div><strong>Block #</strong>${block.index}</div>
          <div><strong>Hash:</strong> ${escapeHtml(String(block.hash)).slice(0, 16)}...</div>
          <div><strong>Previous:</strong> ${escapeHtml(String(block.previous_hash)).slice(0, 16)}...</div>
          <div><strong>Timestamp:</strong> ${ts}</div>
          <div><strong>Transactions:</strong> ${block.transactions.length}</div>
          ${block.transactions.map(tx => `
            <div class="tx">
              <div><strong>Type:</strong> ${escapeHtml(String(tx.tx_type))}</div>
              <div><strong>From:</strong> ${escapeHtml(tx.from)}</div>
              <div><strong>To:</strong> ${escapeHtml(tx.to)}</div>
              <div><strong>Amount:</strong> ${Number(tx.amount).toLocaleString()} NOVA</div>
            </div>
          `).join('')}
        </div>
      `;
    });
    document.getElementById('blockchainData').innerHTML = html;
  } catch (e) {
    showMessage(`Failed to load blockchain: ${e.message}`, 'error');
  }
}

function showMessage(text, type = 'success') {
  const el = document.createElement('div');
  el.className = `message ${type === 'error' ? 'error' : ''}`;
  el.textContent = text;
  document.getElementById('messages').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}