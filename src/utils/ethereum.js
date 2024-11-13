import { ethers } from 'ethers';

let provider;
let signer;

export const initEthers = async () => {
    if (window.ethereum) {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Create provider and signer
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            
            return { provider, signer };
        } catch (error) {
            throw new Error("User denied account access");
        }
    } else {
        throw new Error("Ethereum object not found, install MetaMask.");
    }
};

export const getContract = async (contractAddress, contractABI) => {
    if (!provider || !signer) {
        await initEthers();
    }
    return new ethers.Contract(contractAddress, contractABI, signer);
}; 