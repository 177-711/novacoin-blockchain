interface EthereumProvider {
  request: (args: { method: string }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};