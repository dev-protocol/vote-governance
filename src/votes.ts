import {
	BaseProvider,
	JsonRpcProvider,
	Web3Provider,
	WebSocketProvider,
} from '@ethersproject/providers'
import {
	getVoteContract,
	getVoteEvent,
	getVoteAttributes,
	getDevContract,
	getPropertyGroupContract,
	getAddressConfigAddress,
	getAddressConfigContract,
} from './contract'
import { formatVoteEventData } from './format'
import { filteringValidData } from './filtering'
import { calculateVote } from './data-process'
import { VoteInfo } from './types'

export const getVotes = async (
	voteAddress: string,
	provider: BaseProvider | JsonRpcProvider | Web3Provider | WebSocketProvider
): Promise<readonly VoteInfo[]> => {
	const addressConfigAddress = await getAddressConfigAddress(provider)
	const addressConfigInstance = getAddressConfigContract(
		provider,
		addressConfigAddress
	)
	const devAddress = await addressConfigInstance.token()
	const devInstance = getDevContract(provider, devAddress)
	const propertyGroupAddress = await addressConfigInstance.token()
	const propertyGroupInstance = await getPropertyGroupContract(
		provider,
		propertyGroupAddress
	)

	const voteInstance = getVoteContract(voteAddress, provider)
	const voteAllLogs = await getVoteEvent(voteInstance, provider)
	const voteAttributes = await getVoteAttributes(voteInstance)
	const formattedData = await formatVoteEventData(
		voteAllLogs,
		devInstance,
		propertyGroupInstance,
		voteAttributes.period
	)
	const filteredData = filteringValidData(
		voteAttributes.options.length,
		formattedData
	)
	return calculateVote(voteAttributes.options, filteredData)
}

// TODO
// test
// trycatch
// npm publish
