// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is IFaucet, Owned, Logger {
  uint256 public numOfFunders;
  mapping(address => bool) private funders;
  mapping(uint256 => address) private lutFunders;

  modifier limitWithdraw(uint256 withdrawAmount) {
    require(withdrawAmount <= 1 ether, "Cannot withdraw more than 1 ether");
    _;
  }

  function emitLog() public pure override returns (bytes32) {
    return "Hello World";
  }

  function addFunds() external payable override {
    address funder = msg.sender;

    if (!funders[funder]) {
      uint256 index = numOfFunders++;
      funders[funder] = true;
      lutFunders[index] = funder;
    }
  }

  function withdraw(uint256 withdrawAmount)
    external
    payable
    override
    onlyOwner
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
