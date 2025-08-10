// src/components/TokenStats.tsx
import React from 'react';

interface Props {
  name: string;
  symbol: string;
  total: number;
}

const TokenStats: React.FC<Props> = ({ name, symbol, total }) => {
  return (
    <div>
      <h2>Token Stats</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Symbol:</strong> {symbol}</p>
      <p><strong>Total Supply:</strong> {total}</p>
    </div>
  );
};

export default TokenStats;