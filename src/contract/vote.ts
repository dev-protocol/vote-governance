import { Contract, Event, BigNumber } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'
import { getVoteEvent } from './vote-emitter'
import { VoteAttributes } from './../types'

export const getVoteContract = (
	address: string,
	provider: BaseProvider
): Contract => {
	const abi = [
		'function vote(bytes32[] memory options, uint8[] memory percentiles) external',
		'function voteEmitter() public view returns (address)',
		'function period() public view returns (uint256)',
	]
	return new Contract(address, abi, provider)
}

export const getRelationVoteEvent = async (
	voteInstance: Contract,
	provider: BaseProvider
): Promise<readonly Event[]> => {
	const voteAllLogs = await getVoteEvent(voteInstance, provider)
	return voteAllLogs
}

export const getAttributes = async (
	voteInstance: Contract
): Promise<VoteAttributes> => {
	const tmp = await voteInstance.attributes()
	return {
		subject: tmp[0],
		body: tmp[1],
		period: (tmp[2] as BigNumber).toNumber(),
		options: tmp[3],
		bodyMimeType: tmp[4],
		optionsMimeType: tmp[5],
	} as VoteAttributes
}
