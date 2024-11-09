import React, { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

const WalletConnect = ({ onBalanceChange }) => {
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                // Request account access
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                
                setAccount(accounts[0]);
                
                // Get provider
                const provider = new BrowserProvider(window.ethereum);
                
                // Get balance
                const balance = await provider.getBalance(accounts[0]);
                const etherBalance = formatEther(balance);
                setBalance(etherBalance);
                onBalanceChange(etherBalance);
            } else {
                alert('Please install MetaMask!');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    const updateBalance = useCallback(async (account) => {
        if (account) {
            const provider = new BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(account);
            setBalance(formatEther(balance));
        }
    }, []);

    useEffect(() => {
        if (account) {
            updateBalance(account);
        }
    }, [account, updateBalance]);

    const disconnectWallet = () => {
        setAccount('');
        setBalance('');
        onBalanceChange('');
    };

    return (
        <div>
            {!account ? (
                <button 
                    onClick={connectWallet}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Connect MetaMask
                </button>
            ) : (
                <div className="text-sm space-y-2">
                    <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
                    <button 
                        onClick={disconnectWallet}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
};

export default WalletConnect; 