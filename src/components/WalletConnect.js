import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ onBalanceChange }) => {
    const [account, setAccount] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert('Please install MetaMask!');
                return;
            }

            setConnectionStatus('Connecting...');

            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });

            // Get the first account
            const account = accounts[0];
            setAccount(account);
            setConnectionStatus('Connected');

            // Get account balance
            const provider = new ethers.BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(account);
            const formattedBalance = ethers.formatEther(balance);
            onBalanceChange(formattedBalance);

            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

        } catch (error) {
            console.error('Connection error:', error);
            setConnectionStatus('Error connecting');
        }
    };

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            setAccount('');
            setConnectionStatus('Disconnected');
            onBalanceChange('0');
        } else {
            const newAccount = accounts[0];
            setAccount(newAccount);
            setConnectionStatus('Connected');
            
            // Update balance for new account
            const provider = new ethers.BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(newAccount);
            onBalanceChange(ethers.formatEther(balance));
        }
    };

    const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
    };

    // Check initial connection status
    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts'
                    });
                    if (accounts.length > 0) {
                        await handleAccountsChanged(accounts);
                    }
                } catch (error) {
                    console.error('Error checking connection:', error);
                }
            }
        };

        checkConnection();

        // Cleanup listeners
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={connectWallet}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                disabled={connectionStatus === 'Connected'}
            >
                {connectionStatus === 'Connected' ? 'Connected' : 'Connect Wallet'}
            </button>
            {account && (
                <span className="text-sm">
                    {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </span>
            )}
        </div>
    );
};

export default WalletConnect; 