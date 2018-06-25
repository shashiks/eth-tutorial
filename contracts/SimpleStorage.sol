pragma solidity ^0.4.18;

contract SimpleStorage {
  uint storedData;

  uint32 version = 0;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
