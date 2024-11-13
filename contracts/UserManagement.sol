// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserManagement {
    struct User {
        string name;
        string flatNo;
        string phoneNumber;
        string email;
        string password;
        bool isActive;
        uint256 registrationDate;
    }
    
    mapping(address => User[]) public users;
    mapping(string => bool) public flatOccupied;
    address[] public userAddresses;
    
    event UserRegistered(
        address indexed userAddress,
        string name,
        string flatNo,
        uint256 timestamp
    );
    
    event FlatStatusChanged(
        string flatNo,
        bool isOccupied,
        uint256 timestamp
    );
    
    function registerUser(
        string memory _name,
        string memory _flatNo,
        string memory _phoneNumber,
        string memory _email,
        string memory _password
    ) public {
        require(!flatOccupied[_flatNo], "Flat is already occupied");
        
        users[msg.sender].push(User(
            _name,
            _flatNo,
            _phoneNumber,
            _email,
            _password,
            true,
            block.timestamp
        ));
        
        flatOccupied[_flatNo] = true;
        userAddresses.push(msg.sender);
        
        emit UserRegistered(msg.sender, _name, _flatNo, block.timestamp);
        emit FlatStatusChanged(_flatNo, true, block.timestamp);
    }
    
    function getAllUsers() public view returns (address[] memory) {
        return userAddresses;
    }
    
    function getUserDetails(address _userAddress, uint256 index) public view returns (
        string memory name,
        string memory flatNo,
        string memory phoneNumber,
        string memory email
    ) {
        User memory user = users[_userAddress][index];
        require(user.isActive, "User not found or inactive");
        
        return (
            user.name,
            user.flatNo,
            user.phoneNumber,
            user.email
        );
    }
    
    function getUserCount(address _userAddress) public view returns (uint256) {
        return users[_userAddress].length;
    }
} 