# SWMS Application Startup Guide

## Prerequisites
- Node.js and npm
- Python 3.x
- Ganache
- MetaMask
- Truffle

## Quick Start
1. Run the startup script:
   - Windows: `start_app.bat`
   - Linux/Mac: `./start_app.sh`

2. Connect MetaMask:
   - Network: Ganache (http://127.0.0.1:7545)
   - Chain ID: 1337
   - Import accounts from Ganache if needed

3. Verify:
   - Ganache: Running on port 7545
   - Flask: Running on port 5000
   - React: Running on port 3000
   - MetaMask: Connected to Ganache

## Manual Startup
[Include manual startup steps here]

## Troubleshooting
- Check if all ports are available
- Verify contract deployment
- Check MetaMask connection
- Verify environment variables