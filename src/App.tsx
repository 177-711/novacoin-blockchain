// src/App.tsx
import React, { useState, useEffect } from 'react';
import TokenStats from './components/TokenStats';
import TransferForm from './components/TransferForm';
import MintForm from './components/MintForm';
import UserExplorer from './components/UserExplorer';
import { getContract } from './utils/contract';
import { ethers } from 'ethers';

interface EthereumProvider {
  request: (args: { method: string }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const App: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState<number>(0);

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
    const fetchTokenData = async () => {
      try {
        const contract = await getContract();
        const name = await contract.name();
        const symbol = await contract.symbol();
        const supply = await contract.totalSupply();
        setName(name);
        setSymbol(symbol);
        setTotalSupply(Number(ethers.formatUnits(supply, 18)));
      } catch (err) {
        console.error('Failed to fetch token data:', err);
      }
    };

    fetchTokenData();
  }, []);

  const handleTransfer = async (to: string, amount: number): Promise<boolean> => {
    try {
      const contract = await getContract();
      const tx = await contract.transfer(to, ethers.parseUnits(amount.toString(), 18));
      await tx.wait();
      console.log(`Transferred ${amount} ${symbol} to ${to}`);
      return true;
    } catch (err) {
      console.error('Transfer failed:', err);
      return false;
    }
  };

  const handleMint = async (to: string, amount: number): Promise<boolean> => {
    if (address !== '0xYourCreatorAddress') {
      alert('Only the creator can mint tokens.');
      return false;
    }
    try {
      const contract = await getContract();
      const tx = await contract.mint(to, ethers.parseUnits(amount.toString(), 18));
      await tx.wait();
      console.log(`Minted ${amount} ${symbol} to ${to}`);
      return true;
    } catch (err) {
      console.error('Mint failed:', err);
      return false;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>NovaCoin Dashboard</h1>

      <div style={styles.section}>
        {address ? (
          <p style={styles.connected}>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
        ) : (
          <button style={styles.button} onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>

      <div style={styles.section}>
        <TokenStats name={name} symbol={symbol} total={totalSupply} />
      </div>

      <div style={styles.section}>
        <TransferForm onTransfer={handleTransfer} sender={address} />
      </div>

      <div style={styles.section}>
        <MintForm onMint={handleMint} isCreator={address === '0xYourCreatorAddress'} />
      </div>

      <div style={styles.section}>
        <UserExplorer currentUser={address} />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '2rem',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    minHeight: '100vh',
  },
  header: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#00ffc3',
  },
  section: {
    marginBottom: '2rem',
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#2e2e3f',
    boxShadow: '0 0 10px rgba(0, 255, 195, 0.2)',
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
    textAlign: 'center',
  },
};

export default App;