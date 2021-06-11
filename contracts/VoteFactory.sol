// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import {Vote} from "contracts/Vote.sol";

contract VoteFactory {
	address public voteEmitter;

	event VoteCreate(address indexed sender, address vote);

	constructor(address _voteEmitter) {
		voteEmitter = _voteEmitter;
	}

	function create(
		string memory _subject,
		string memory _body,
		string[] memory _options,
		string memory _bodyMimeType,
		string memory _optionsMimeType,
		uint256 _votingBlock
	) external {
		Vote vote = new Vote(
			_subject,
			_body,
			_options,
			_bodyMimeType,
			_optionsMimeType,
			voteEmitter,
			_votingBlock,
			msg.sender
		);
		emit VoteCreate(msg.sender, address(vote));
	}
}
