import { ethers } from 'ethers';
import WaterToken from '../artifacts/contracts/WaterToken.sol/WaterToken.json'; // Adjust the path as necessary

const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address

export const allocateTokens = async (flatAddress, residents, historicalWaterConsumption) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const waterTokenContract = new ethers.Contract(CONTRACT_ADDRESS, WaterToken.abi, signer);

    const tx = await waterTokenContract.allocateTokens(flatAddress, residents, historicalWaterConsumption);
    await tx.wait();
    console.log('Tokens allocated successfully');
};

export const recordActualTokensUsed = async (flatAddress, tokensUsed) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const waterTokenContract = new ethers.Contract(CONTRACT_ADDRESS, WaterToken.abi, signer);

    const tx = await waterTokenContract.recordActualTokensUsed(flatAddress, tokensUsed);
    await tx.wait();
    console.log('Actual tokens used recorded successfully');
};
