import { ethers } from 'ethers'
import { VoteData } from './../types'

export const filteringValidData = (
	options: readonly string[],
	voteData: readonly VoteData[]
): readonly VoteData[] => {
	const parsedOptions = options.map((o) => {
		return ethers.utils.parseBytes32String(o)
	})
	return voteData.filter((data) => {
		return (
			data.isValid &&
			isAccurateSumValue(data) &&
			isSameDataCount(data) &&
			isUniqueOptionNames(data) &&
			isReasonableOptions(data.options, parsedOptions)
		)
	})
}

const isAccurateSumValue = (data: VoteData): boolean => {
	return (
		data.percentiles.reduce((sum, element) => {
			return sum + element
		}, 0) === 100
	)
}

const isSameDataCount = (data: VoteData): boolean => {
	return data.percentiles.length === data.options.length
}

const isUniqueOptionNames = (data: VoteData): boolean => {
	const options = new Set(data.options)
	return options.size === data.options.length
}

const isReasonableOptions = (
	dataOptions: readonly string[],
	options: readonly string[]
): boolean => {
	const tmp = dataOptions.filter((dataOption) => {
		return options.includes(dataOption)
	})
	return tmp.length === dataOptions.length
}
