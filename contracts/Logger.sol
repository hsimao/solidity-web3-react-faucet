// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// abstract 合約可以創建 virtual 方法
abstract contract Logger {
  uint256 public testNum;

  constructor() {
    testNum = 1000;
  }

  // 任何繼承此合約的都需要實現 vitrual 以下方法
  function emitLog() public pure virtual returns (bytes32);

  function test3() public view returns (uint256) {
    return testNum;
  }
}
