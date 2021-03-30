import { fromPairs, zip } from 'ramda'
import { Event, BigNumber } from 'ethers'
import { VoteData, VoteDetail, VoteInfo } from './../types'

export const sumTransferEventValue = (events: readonly Event[]): BigNumber => {
	const values = events.map((event) => {
		return typeof event.args === 'undefined'
			? BigNumber.from(0)
			: BigNumber.from(event.args[2])
	})
	return values.reduce((val1, val2) => {
		return val1.add(val2)
	})
}

export const calculateVote = (
	options: readonly string[],
	voteData: readonly VoteData[]
): VoteInfo => {
	const analyzedData = voteData
		.map(analysisVoteData(options.length))
		.reduce((val1, val2) => {
			return val1.concat(val2)
		})

	const optionIndexes = [...Array(options.length)].map((_, i) => i)
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
		} as VoteDetail
	})
	return {
		detail: tmp,
	} as VoteInfo
}

const getCount = (
	counts: readonly BigNumber[],
	optionsCount: number
): string => {
	const magnification = [...Array(optionsCount)]
		.map((_, i) => i)
		.reverse()
		.map((d) => {
			return d + 1
		})
	const tmp = fromPairs(zip(magnification, counts))
	return magnification
		.map((mag) => {
			return tmp[mag].mul(mag)
		})
		.reduce((val1, val2) => {
			return val1.add(val2)
		})
		.toString()
}

const getCounts = (
	analyzedVoteData: readonly AnalyzedVoteData[],
	optionsCount: number
): readonly BigNumber[] => {
	const rankList = [...Array(optionsCount)].map((_, i) => i)
	return rankList.map((rank) => {
		const voteCounts = analyzedVoteData
			.filter((data) => {
				return data.rank === rank
			})
			.map((data) => {
				return data.voteCount
			})

		return voteCounts.reduce((val1, val2) => {
			return val1.add(val2)
		})
	})
}

const getAnalyzedDataByOptionIndex = (
	analyzedVoteData: readonly AnalyzedVoteData[],
	optionIdx: number
): readonly AnalyzedVoteData[] => {
	return analyzedVoteData.filter((analyzedData) => {
		return analyzedData.index === optionIdx && analyzedData.isvalid
	})
}

const analysisVoteData = (optionsCount: number) => (
	voteData: VoteData
): readonly AnalyzedVoteData[] => {
	const optionIndexes = [...Array(optionsCount)].map((_, i) => i)
	return optionIndexes.map((optionIndex) => {
		const optionIdx = voteData.options.indexOf(optionIndex)
		const percentile =
			optionIdx === -1 ? undefined : voteData.percentiles[optionIdx]
		return {
			index: optionIndex,
			isvalid: optionIdx !== -1,
			rank: getRank(optionIdx),
			voteCount: getVoteCount(percentile, voteData.value),
		} as AnalyzedVoteData
	})
}

const getRank = (optionIdx: number): number => {
	return optionIdx === -1 ? -1 : optionIdx
}

const getVoteCount = (
	percentile: number | undefined,
	allVoteCount: BigNumber
): BigNumber => {
	return typeof percentile === 'undefined'
		? BigNumber.from(-1)
		: allVoteCount.mul(BigNumber.from(percentile)).div(BigNumber.from(100))
}

type AnalyzedVoteData = {
	readonly index: number
	readonly isvalid: boolean
	readonly rank: number
	readonly voteCount: BigNumber
}
