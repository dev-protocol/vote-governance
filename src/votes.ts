import { BaseProvider } from '@ethersproject/providers'
import {
	getVoteContract,
	getRelationVoteEvent,
	getVoteAttributes,
	getDevContract,
	getPropertyGroupContract,
	getDevAddress,
} from './contract'
import { formatVoteEventData } from './format'
import { filteringValidData } from './filtering'
import { calculateVote } from './data-process'
import { VoteInfo } from './types'

export const getVotes = async (
	voteAddress: string,
	provider: BaseProvider
): Promise<VoteInfo> => {
	const voteInstance = getVoteContract(voteAddress, provider)
	const devAddress = await getDevAddress(provider)
	const devInstance = getDevContract(provider, devAddress)
	const propertyGroupInstance = await getPropertyGroupContract(provider)
	const voteAllLogs = await getRelationVoteEvent(voteInstance, provider)
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
