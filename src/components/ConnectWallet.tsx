import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ConnectWallet: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
      } catch (err) {
        console.error('Wallet connection failed:', err);
      }
    } else {
      alert('MetaMask not detected. Please install it to use NovaCoin.');
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <div style={styles.container}>
      {address ? (
        <p style={styles.connected}>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
      ) : (
        <button style={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: '1rem',
    textAlign: 'center',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#00ffc3',
    color: '#1e1e2f',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  connected: {
    fontSize: '1rem',
    color: '#00ffc3',
  },
};

export default ConnectWallet;