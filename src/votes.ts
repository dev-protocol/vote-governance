import { BaseProvider } from '@ethersproject/providers'
import {
	getVoteContract,
	getRelationVoteEvent,
	getAttributes,
} from './contract'
import { formatVoteEventData } from './format'
import { filteringValidData } from './filtering'

export const getVotes = async (
	voteAddress: string,
	provider: BaseProvider
): Promise<any> => {
	const voteInstance = getVoteContract(voteAddress, provider)
	const voteAllLogs = await getRelationVoteEvent(voteInstance, provider)
	const formattedData = formatVoteEventData(voteAllLogs)
	const voteAttributes = await getAttributes(voteInstance)
	const filteredData = filteringValidData(voteAttributes.options, formattedData)
	// const toBlock = await vote.callStatic.period()
	// const voteAllLogs = await emitter.queryFilter(createVoteFilter('0X_VOTE_ADDRESS'))
	// const decodedVoteLogs = voteAllLogs.map(decodeVoteLog).map(
	// log => ({...log, options: DECODE_ARRAY_OF_STRUCT_BYTES32(log.args.votes)})
	// )
	// const options = Array.from(new Set(
	// decodedVoteLogs.map(log => log.options.optionId)
	// ))
	// const optionsCount = options.length

	// const sort = sortBy(prop('percentile'))
	// const sortedLogs = decodedVoteLogs.map(({options, ...x}) => ({...x, options: sort(options)}))
	// const sortedLogsWithGovernancePower = await Promise.all(
	// sortedOptions.map(async opt => {
	// 	const {options, args} = opt
	// 	const deposited = await getTotalDeposited(args.voter, toBlock)
	// 	const optionsWithConut = options.map(opt => ({
	// 	...opt,
	// 	count: deposited.mul(opt.percentile).div(100)
	// 	}))
	// 	return {...opt, optionsWithConut}
	// })
	// )
	// const counter = createCounter(optionsCount, sortedLogsWithGovernancePower)
	// const optionsWithCounts = options.map(id => {
	// const counts = counter(id)
	// return {
	// 	id,
	// 	counts,
	// 	count: sumOfBigNumnersWithBorda(counts)
	// }
	// })
	// /*
	// [
	// 	{
	// 	id: '0x000...', // Option ID
	// 	counts: ['60...', '20...', '10...'] // 60e18の1位票、20e18の2位票、10e18の3位票
	// 	count: 230... // 230e18 の得票 // (60*3)+(20*2)+(10*1)
	// 	}
	// ]
	// */
	// return optionsWithCounts
	return {}
}
