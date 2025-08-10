// src/components/UserExplorer.tsx
import React from 'react';

interface Props {
  currentUser: string | null;
}

const UserExplorer: React.FC<Props> = ({ currentUser }) => {
  return (
    <div>
      <h2>User Explorer</h2>
      {currentUser ? (
        <p>Current User: {currentUser}</p>
      ) : (
        <p>Connect your wallet to explore user data.</p>
      )}
    </div>
  );
};

export default UserExplorer;