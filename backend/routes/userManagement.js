const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const UserManagement = require('../contracts/UserManagement.json');

const web3 = new Web3(process.env.BLOCKCHAIN_URL);
const userManagement = new web3.eth.Contract(
    UserManagement.abi,
    process.env.USER_MANAGEMENT_ADDRESS
);

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, flatNo, phoneNumber, email, password, userAddress } = req.body;
        
        const tx = await userManagement.methods.registerUser(
            name,
            flatNo,
            phoneNumber,
            email,
            password
        ).send({ from: userAddress });
        
        res.json({
            success: true,
            transactionHash: tx.transactionHash
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = [];
        const addresses = await userManagement.methods.getAllUsers().call();
        
        for (const address of addresses) {
            const userData = await userManagement.methods.getUserDetails(address).call();
            users.push({
                address,
                ...userData
            });
        }
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;