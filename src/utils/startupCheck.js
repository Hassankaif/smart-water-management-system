import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x6FD969E40232A2Bf3cf32B89Fe073795F5942f8E';

export const verifyConnections = async () => {
    try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            throw new Error('MetaMask not installed');
        }

        // Check Ganache connection
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        console.log('Connected to network:', network.chainId);

        // Check if connected to Ganache (chainId 1337)
        if (network.chainId !== 1337n) {
            throw new Error('Please connect to Ganache network');
        }

        // Check Flask Backend
        try {
            const response = await fetch('http://localhost:5000/api/health');
            if (!response.ok) {
                throw new Error('Flask backend not responding');
            }
        } catch (error) {
            throw new Error('Flask backend not running');
        }

        return {
            success: true,
            message: 'All services are running correctly'
        };
    } catch (error) {
        console.error('Startup check failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const checkMetaMaskConnection = async () => {
    try {
        if (!window.ethereum) {
            throw new Error('MetaMask not installed');
        }

        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });

        if (accounts.length === 0) {
            throw new Error('No accounts found. Please connect MetaMask');
        }

        return {
            success: true,
            account: accounts[0]
        };
    } catch (error) {
        console.error('MetaMask connection check failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const checkGanacheConnection = async () => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        
        if (network.chainId !== 1337n) {
            throw new Error('Please connect to Ganache network (Chain ID: 1337)');
        }

        return {
            success: true,
            chainId: network.chainId
        };
    } catch (error) {
        console.error('Ganache connection check failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const checkContractDeployment = async () => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const code = await provider.getCode(CONTRACT_ADDRESS);
        
        if (code === '0x') {
            throw new Error('Smart contract not deployed');
        }

        return {
            success: true,
            address: CONTRACT_ADDRESS
        };
    } catch (error) {
        console.error('Contract deployment check failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const checkFlaskBackend = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/health');
        if (!response.ok) {
            throw new Error('Flask backend not responding');
        }

        return {
            success: true,
            status: response.status
        };
    } catch (error) {
        console.error('Flask backend check failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
