// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.7.6;

import {IVoteEmitter} from "contracts/interface/IVoteEmitter.sol";

contract Vote {
	address public voteEmitter;
	uint256 public period;

	constructor(address _voteEmitter, uint256 _votingBlock) {
		voteEmitter = _voteEmitter;
		period = _votingBlock + block.number;
	}

	function vote(bytes32[] memory options, uint8[] memory percentiles)
		external
	{
		require(block.number < period, "over the period");
		IVoteEmitter(voteEmitter).dispatch(msg.sender, options, percentiles);
	}
}
