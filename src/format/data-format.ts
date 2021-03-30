import { Event, ethers } from 'ethers'
import { Result } from '@ethersproject/abi'

export const formatVoteEventData = (
	events: readonly Event[]
): readonly VoteData[] => {
	const formattedData = events.map((event) => {
		return typeof event.args === 'undefined'
			? ({
					isValid: false,
					voter: '',
					options: [],
					percentiles: [],
			  } as VoteData)
			: format(event.args)
	})
	return formattedData
}

const format = (args: Result): VoteData => {
	const byte32Options = args[2] as readonly string[]
	const parsedOptions = byte32Options.map((option) => {
		return ethers.utils.parseBytes32String(option)
	})
	const percentiles = args[3] as readonly number[]
	return {
		isValid: true,
		voter: args[1],
		options: parsedOptions,
		percentiles: percentiles,
	} as VoteData
}
