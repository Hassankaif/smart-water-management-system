// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WaterToken is ERC20, Ownable {
    constructor(address initialOwner) 
        ERC20("WaterToken", "WTR") 
        Ownable(initialOwner)  // Pass initialOwner to Ownable constructor
    {
        // Initial token minting if needed
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}

contract WaterTokenAllocator is Ownable {
    WaterToken public waterToken;
    
    // Mapping to track allocations
    mapping(address => uint256) public allocations;
    
    constructor(address initialOwner, address _waterTokenAddress) 
        Ownable(initialOwner)  // Pass initialOwner to Ownable constructor
    {
        waterToken = WaterToken(_waterTokenAddress);
    }
    
    // Function to allocate tokens
    function allocateTokens(address recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Update allocation
        allocations[recipient] += amount;
        
        // Transfer tokens
        require(waterToken.transfer(recipient, amount), "Token transfer failed");
        
        emit TokensAllocated(recipient, amount);
    }
    
    // Function to get allocation for an address
    function getAllocation(address account) external view returns (uint256) {
        return allocations[account];
    }
    
    // Event to emit when tokens are allocated
    event TokensAllocated(address indexed recipient, uint256 amount);
}