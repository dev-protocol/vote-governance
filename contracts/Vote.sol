// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import {IVoteEmitter} from "contracts/interface/IVoteEmitter.sol";

contract Vote {
	struct Attributes {
		string subject;
		bytes32 body;
		uint256 period;
		bytes32[] options;
		string bodyMimeType;
		string optionsMimeType;
	}
	address public voteEmitter;
	string public subject;
	bytes32 public body;
	uint256 public period;
	bytes32[] public options;
	string public bodyMimeType;
	string public optionsMimeType;

	constructor(
		string memory _subject,
		bytes32 _body,
		bytes32[] memory _options,
		string memory _bodyMimeType,
		string memory _optionsMimeType,
		address _voteEmitter,
		uint256 _votingBlock
	) {
		voteEmitter = _voteEmitter;
		period = _votingBlock + block.number;
		subject = _subject;
		body = _body;
		options = _options;
		bodyMimeType = _bodyMimeType;
		optionsMimeType = _optionsMimeType;
	}

	function attributes() external view returns (Attributes memory) {
		return
			Attributes(
				subject,
				body,
				period,
				options,
				bodyMimeType,
				optionsMimeType
			);
	}

	function vote(bytes32[] memory _options, uint8[] memory percentiles)
		external
	{
		require(block.number < period, "over the period");
		IVoteEmitter(voteEmitter).dispatch(msg.sender, _options, percentiles);
	}
}
