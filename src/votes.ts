import { BaseProvider } from '@ethersproject/providers'
import {
	getVoteContract,
	getRelationVoteEvent,
	getVoteAttributes,
	getDevContract,
	getPropertyGroupContract,
} from './contract'
import { formatVoteEventData } from './format'
import { filteringValidData } from './filtering'

export const getVotes = async (
	voteAddress: string,
	provider: BaseProvider
): Promise<any> => {
	const voteInstance = getVoteContract(voteAddress, provider)
	const devInstance = await getDevContract(provider)
	const propertyGroupInstance = await getPropertyGroupContract(provider)
	const voteAllLogs = await getRelationVoteEvent(voteInstance, provider)
	const voteAttributes = await getVoteAttributes(voteInstance)
	const formattedData = await formatVoteEventData(
		voteAllLogs,
		devInstance,
		propertyGroupInstance,
		voteAttributes.period
	)
	const filteredData = filteringValidData(voteAttributes.options, formattedData)
	return {}
}

// TODO
// test
// trycatch
// npm publish
