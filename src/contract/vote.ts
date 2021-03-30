import { Contract, Event } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'
import { getVoteEvent } from './vote-emitter'

const getVoteContract = (address: string, provider: BaseProvider): Contract => {
	const abi = [
		'function vote(bytes32[] memory options, uint8[] memory percentiles) external',
		'function voteEmitter() public view returns (address)',
		'function period() public view returns (uint256)',
	]
	return new Contract(address, abi, provider)
}

export const getRelationVoteEvent = async (
	address: string,
	provider: BaseProvider
): Promise<readonly Event[]> => {
	const voteInstance = getVoteContract(address, provider)
	const voteEmitAddress = await voteInstance.voteEmitter()
	const voteAllLogs = await getVoteEvent(address, voteEmitAddress, provider)
	return voteAllLogs
}
