// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
  address public owner;
  uint256 public numOfFunders;
  mapping(address => bool) private funders;
  mapping(uint256 => address) private lutFunders;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

  modifier limitWithdraw(uint256 withdrawAmount) {
    require(withdrawAmount <= 1 ether, "Cannot withdraw more than 1 ether");
    _;
  }

  function addFunds() external payable {
    address funder = msg.sender;

    if (!funders[funder]) {
      uint256 index = numOfFunders++;
      funders[funder] = true;
      lutFunders[index] = funder;
    }
  }

  function withdraw(uint256 withdrawAmount)
    external
    limitWithdraw(withdrawAmount)
  {
    payable(msg.sender).transfer(withdrawAmount);
  }

  function getAllFunders() external view returns (address[] memory) {
    address[] memory _funders = new address[](numOfFunders);

    for (uint256 i = 0; i < numOfFunders; i++) {
      _funders[i] = lutFunders[i];
    }

    return _funders;
  }

  function getFunderAtIndex(uint8 index) external view returns (address) {
    return lutFunders[index];
  }
}
