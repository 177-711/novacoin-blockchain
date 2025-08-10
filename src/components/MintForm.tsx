// src/components/MintForm.tsx
import React, { useState } from 'react';

export interface Props {
  onMint: (to: string, amount: number) => Promise<boolean>;
  isCreator: boolean;
}

const MintForm: React.FC<Props> = ({ onMint, isCreator }) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCreator) {
      alert('Only the creator can mint tokens.');
      return;
    }
    const success = await onMint(to, amount);
    if (success) {
      setTo('');
      setAmount(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Mint Tokens</h2>
      <input
        type="text"
        placeholder="Recipient address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
      />
      <button type="submit">Mint</button>
    </form>
  );
};

export default MintForm;