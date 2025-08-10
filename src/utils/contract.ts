// src/utils/contract.ts
import { ethers } from 'ethers';
import ABI from '../abi/NovaCoin.json';

const CONTRACT_ADDRESS = '0xYourContractAddressHere'; // 🔁 Replace with your actual deployed address

export const getContract = async () => {
  if (!window.ethereum) throw new Error('MetaMask not found');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};