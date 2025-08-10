// src/components/MintForm.tsx
import React, { useState } from 'react';

export interface Props {
  onMint: (to: string, amount: number) => Promise<boolean>;
  isCreator: boolean;
}

const MintForm: React.FC<Props> = ({ onMint, isCreator }) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCreator) {
      alert('Only the creator can mint tokens.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const success = await onMint(to, amount);
      if (success) {
        setTo('');
        setAmount(0);
      }
    } catch (err) {
      setError('Mint failed.');
    } finally {
      setLoading(false);
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
      <button type="submit" disabled={loading}>Mint</button>
      {loading && <p>Minting transaction...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default MintForm;