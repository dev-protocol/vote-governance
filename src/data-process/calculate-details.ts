import { fromPairs, zip } from 'ramda'
import { BigNumber, constants } from 'ethers'
import { VoteData } from './../types'

const { Zero } = constants

export const getCount = (
	counts: readonly BigNumber[],
	optionsCount: number
): string => {
	const magnification = [...Array(optionsCount)]
		.fill(0)
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
		}, Zero)
		.toString()
}

export const getCounts = (
	analyzedVoteData: readonly AnalyzedVoteData[],
	optionsCount: number
): readonly BigNumber[] => {
	const rankList = [...Array(optionsCount)].fill(0).map((_, i) => i)
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
		}, Zero)
	})
}

export const getAnalyzedDataByOptionIndex = (
	analyzedVoteData: readonly AnalyzedVoteData[],
	optionIdx: number
): readonly AnalyzedVoteData[] => {
	return analyzedVoteData.filter((analyzedData) => {
		return analyzedData.index === optionIdx
	})
}

export const analysisVoteData =
	(optionsCount: number) =>
	(voteData: VoteData): readonly AnalyzedVoteData[] => {
		const optionIndexes = [...Array(optionsCount)].fill(0).map((_, i) => i)
		return optionIndexes.map((optionIndex) => {
			const percentile = voteData.percentiles[optionIndex]
			return {
				index: optionIndex,
				rank: getRank(voteData.percentiles, percentile),
				voteCount: voteData.value
					.mul(BigNumber.from(percentile))
					.div(BigNumber.from(100)),
			} as AnalyzedVoteData
		})
	}

const getRank = (
	percentiles: readonly number[],
	percentile: number
): number => {
	const compare = (a: number, b: number): number => {
		return b - a
	}
	const descOrder = percentiles.slice().sort(compare)
	return descOrder.indexOf(percentile)
}

type AnalyzedVoteData = {
	readonly index: number
	readonly rank: number
	readonly voteCount: BigNumber
}
