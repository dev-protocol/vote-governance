// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.7.6;

contract AddressConfig {
	address public token;
	address public propertyGroup;

	function setPropertyGroup(address _addr) external {
		propertyGroup = _addr;
	}

	function setToken(address _addr) external {
		token = _addr;
	}
}
