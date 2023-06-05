// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract Faucet is ERC20 {
    uint256 constant MAX_TOTAL_MINT = 50e18;
    uint256 constant SIX_HOURS = 6 hours;
    uint256 minted;
    mapping(address => uint256) public lastTransferTime;
    address public owner;

    event TransferCompleted(address indexed recipient, uint256 amount);
    event EtherWithdrawn(address indexed owner, uint256 amount);

    constructor() ERC20("MonToken", "MTK") {
        owner = msg.sender;
     }

    modifier onlyOwner() {
        require(msg.sender == owner, "Seul le proprietaire peut effectuer cette operation");
        _;
    }

    function mint() external payable {
        require(msg.value == 0.5 ether, "Vous devez envoyer 0.5 Ether");
        require(
            lastTransferTime[msg.sender] + SIX_HOURS <= block.timestamp,
            "Vous ne pouvez effectuer qu'une seule operation de transfert toutes les 6 heures"
        );
        require(minted < MAX_TOTAL_MINT, "La limite maximale de la monnaie est atteinte.");

        _mint(msg.sender, 1e18);
        minted += 1e18;
        lastTransferTime[msg.sender] = block.timestamp;

        payable(msg.sender).transfer(0.4999999 ether);
        emit TransferCompleted(msg.sender, 0.4999999 ether);
    }

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "Le solde du contrat est nul");

        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
        emit EtherWithdrawn(owner, balance);
    }
}
