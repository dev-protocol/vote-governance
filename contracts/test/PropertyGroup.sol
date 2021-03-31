// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.7.6;

contract PropertyGroup {
	mapping(address => bool) public map;

	function addGroup(address _addr) external {
		map[_addr] = true;
	}

	function isGroup(address _addr) external view returns (bool) {
		return map[_addr];
	}
}
