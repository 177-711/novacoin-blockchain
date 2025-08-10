// src/components/UserExplorer.tsx
import React, { useEffect, useState } from 'react';
import { getContract } from '../utils/contract';
import { ethers } from 'ethers';

interface Props {
  currentUser: string | null;
}

const UserExplorer: React.FC<Props> = ({ currentUser }) => {
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    const fetchBalance = async () => {
      if (!currentUser) return;
      try {
        const contract = await getContract();
        const rawBalance = await contract.balanceOf(currentUser);
        setBalance(ethers.formatUnits(rawBalance, 18));
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      }
    };

    fetchBalance();
  }, [currentUser]);

  return (
    <div>
      <h2>User Explorer</h2>
      {currentUser ? (
        <>
          <p><strong>Address:</strong> {currentUser}</p>
          <p><strong>Balance:</strong> {balance} NOVA</p>
        </>
      ) : (
        <p>Connect your wallet to explore user data.</p>
      )}
    </div>
  );
};

export default UserExplorer;