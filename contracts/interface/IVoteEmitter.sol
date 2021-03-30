// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.7.6;

interface IVoteEmitter {
	event Vote(
		address indexed dispatcher,
		address voter,
		uint8[] options,
		uint8[] percentiles
	);

	function dispatch(
		address voter,
		uint8[] memory options,
		uint8[] memory percentiles
	) external;
}
