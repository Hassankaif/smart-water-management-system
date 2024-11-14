// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WaterToken is ERC20, Ownable {
    struct FlatInfo {
        uint256 residents;
        uint256 historicalWaterConsumption;
        uint256 allocatedTokens;
        uint256 actualTokensUsed;
        uint256 penalty;
    }

    mapping(address => FlatInfo) public flats;

    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(address(this), initialSupply);
    }

    function allocateTokens(address flatAddress, uint256 residents, uint256 historicalWaterConsumption) public onlyOwner {
        uint256 allocatedTokens = residents * historicalWaterConsumption;
        flats[flatAddress] = FlatInfo(residents, historicalWaterConsumption, allocatedTokens, 0, 0);
        _transfer(address(this), flatAddress, allocatedTokens);
    }

    function recordActualTokensUsed(address flatAddress, uint256 tokensUsed) public onlyOwner {
        FlatInfo storage flat = flats[flatAddress];
        flat.actualTokensUsed = tokensUsed;

        if (tokensUsed > flat.allocatedTokens) {
            uint256 penalty = (tokensUsed - flat.allocatedTokens) * 2;
            flat.penalty = penalty;
            _burn(flatAddress, penalty);
        }
    }

    function exchangeTokens(uint256 amount) public {
        require(amount <= balanceOf(msg.sender), "Insufficient tokens");
        _burn(msg.sender, amount);
        _transfer(address(this), msg.sender, amount);
    }
}