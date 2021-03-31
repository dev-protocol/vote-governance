// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.7.6;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Dev is ERC20 {
	constructor() ERC20("Dev", "DEV")
	{
		_mint(msg.sender, 1000000000000000000000);
	}
}
