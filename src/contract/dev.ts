import { Contract, Event } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'

const getVoteEmitterContract = (
	address: string,
	provider: BaseProvider
): Contract => {
	const abi = [
		'function dispatch(address voter,bytes32[] memory options,uint8[] memory percentiles) external',
		'event Vote(address dispatcher,address voter,bytes32[] options,uint8[] percentiles)',
	]
	return new Contract(address, abi, provider)
}

export const getVoteEvent = async (
	voteAddress: string,
	emitterAddress: string,
	provider: BaseProvider
): Promise<readonly Event[]> => {
	const contract = getVoteEmitterContract(emitterAddress, provider)
	const filterVote = contract.filters.Vote(voteAddress)
	const events = await contract.queryFilter(filterVote)
	return events
}
