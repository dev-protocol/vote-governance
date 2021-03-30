import { Contract, Event } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'

const getVoteEmitterContract = (
	address: string,
	provider: BaseProvider
): Contract => {
	const abi = [
		'event Vote(address dispatcher,address voter,bytes32[] options,uint8[] percentiles)',
	]
	return new Contract(address, abi, provider)
}

export const getVoteEvent = async (
	voteInstance: Contract,
	provider: BaseProvider
): Promise<readonly Event[]> => {
	const voteEmitAddress = await voteInstance.voteEmitter()
	const contract = getVoteEmitterContract(voteEmitAddress, provider)
	const filterVote = contract.filters.Vote(voteInstance.address)
	const events = await contract.queryFilter(filterVote)
	return events
}
