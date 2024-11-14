// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WaterToken is ERC20, Ownable {
    constructor() ERC20("Water Token", "WATER") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply
    }
}

contract WaterTokenAllocator is Ownable {
    WaterToken public waterToken;
    mapping(address => uint256) public monthlyAllocations;
    mapping(address => uint256) public lastAllocationTimestamp;

    event TokensAllocated(address indexed user, uint256 amount);

    constructor(address _waterTokenAddress) Ownable(msg.sender) {
        waterToken = WaterToken(_waterTokenAddress);
    }

    // Function to allocate tokens based on average water consumption
    function allocateTokens(address[] memory users, uint256[] memory averageConsumption) external onlyOwner {
        require(users.length == averageConsumption.length, "Users and consumption arrays must match");

        for (uint256 i = 0; i < users.length; i++) {
            uint256 allocation = averageConsumption[i] / 50; // 1 token = 50 liters
            monthlyAllocations[users[i]] = allocation;
            lastAllocationTimestamp[users[i]] = block.timestamp;

            // Check if allocator has enough tokens and transfer the allocation
            require(waterToken.balanceOf(address(this)) >= allocation, "Not enough tokens in the allocator contract");
            waterToken.transfer(users[i], allocation);

            emit TokensAllocated(users[i], allocation);
        }
    }

    // Function to get user's allocation
    function getUserAllocation(address user) external view returns (uint256) {
        return monthlyAllocations[user];
    }

    // Function to fund the allocator contract with tokens
    function fundAllocator(uint256 amount) external onlyOwner {
        require(waterToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }
}
