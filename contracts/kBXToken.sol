// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC20} from "./ERC20.sol";

contract KoinBX is ERC20 {
    uint256 INITIAL_SUPPLY = 10 ^ 10 * 1 ether; //10^28
    uint256 public constant faucetLimit = 500000 * 1 ether;
    address public owner;
    mapping(address => uint256) private _faucets;

    modifier onlyOwner() {
        require(msg.sender == owner, "KoinBX: Caller must be owner of token");
        _;
    }

    constructor(address _owner, string memory _name, string memory _symbol, uint8 _decimals)
        ERC20(_name, _symbol, _decimals)
    {
        owner = _owner;
        _mint(_owner, INITIAL_SUPPLY);
    }

    function mintToken(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function faucetTokens(uint256 _amount) external {
        require(_faucets[msg.sender] + _amount <= faucetLimit, "KoinBX: Faucet amount limitation");
        _mint(msg.sender, _amount);
    }
}
