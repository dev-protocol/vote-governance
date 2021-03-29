// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.7.6;

interface IVoteEmitter {
	event Vote(
		address dispatcher,
		address voter,
		bytes32[] options,
		uint8[] percentiles
	);

	function dispatch(
		address voter,
		bytes32[] memory options,
		uint8[] memory percentiles
	) external;
}
