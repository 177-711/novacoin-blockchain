 import React from 'react';

type Props = {
  onClose: () => void;
};

function WalletModal({ onClose }: Props) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', padding: '2rem', borderRadius: '8px',
        minWidth: '300px'
      }}>
        <h2>Connect Wallet</h2>
        <button style={{ margin: '0.5rem 0' }}>MetaMask</button>
        <button style={{ margin: '0.5rem 0' }}>WalletConnect</button>
        <br />
        <button onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
      </div>
    </div>
  );
}

export default WalletModal;
