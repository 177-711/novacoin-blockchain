// src/components/TransferForm.tsx
import React, { useState } from 'react';

export interface Props {
  onTransfer: (to: string, amount: number) => Promise<boolean>;
  sender: string | null;
}

const TransferForm: React.FC<Props> = ({ onTransfer, sender }) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender) {
      alert('Connect your wallet first.');
      return;
    }
    const success = await onTransfer(to, amount);
    if (success) {
      setTo('');
      setAmount(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Transfer Tokens</h2>
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
      <button type="submit">Send</button>
    </form>
  );
};

export default TransferForm;