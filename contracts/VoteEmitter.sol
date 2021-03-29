// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.7.6;

import {IVoteEmitter} from "contracts/interface/IVoteEmitter.sol";

contract VoteEmitter is IVoteEmitter {
	function dispatch(
		address voter,
		bytes32[] memory options,
		uint8[] memory percentiles
	) external override {
		emit Vote(msg.sender, voter, options, percentiles);
	}
}
