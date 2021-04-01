import { Event, BigNumber, constants } from 'ethers'
import { VoteData, VoteInfo } from './../types'
import {
	getCount,
	getCounts,
	getAnalyzedDataByOptionIndex,
	analysisVoteData,
} from './calculate-details'

const { Zero } = constants

export const sumTransferEventValue = (events: readonly Event[]): BigNumber => {
	const values = events.map((event) => {
		return typeof event.args === 'undefined'
			? BigNumber.from(0)
			: BigNumber.from(event.args.value)
	})
	return values.reduce((val1, val2) => {
		return val1.add(val2)
	}, Zero)
}

export const calculateVote = (
	options: readonly string[],
	voteData: readonly VoteData[]
): readonly VoteInfo[] => {
	const analyzedData = voteData
		.map(analysisVoteData(options.length))
		.reduce((val1, val2) => {
			return val1.concat(val2)
		}, [])

	const optionIndexes = [...Array(options.length)].fill(0).map((_, i) => i)
	const tmp = optionIndexes.map((optionIndex) => {
		const targetVoteData = getAnalyzedDataByOptionIndex(
			analyzedData,
			optionIndex
		)
		const tmp = getCounts(targetVoteData, options.length)
		const count = getCount(tmp, options.length)
		const counts = tmp.map((d) => {
			return d.toString()
		})
		return {
			id: options[optionIndex],
			counts: counts,
			count: count,
		} as VoteInfo
	})
	return tmp
}
