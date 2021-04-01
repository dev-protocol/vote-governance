import { Event, BigNumber, Contract } from 'ethers'
import { VoteData } from './../types'
import { convertEventToVote } from './data-format-details'

export const formatVoteEventData = async (
	events: readonly Event[],
	devInstance: Contract,
	propertyGroupInstance: Contract,
	toBlock: number
): Promise<readonly VoteData[]> => {
	const formattedData = await Promise.all(
		events.map(async (event) => {
			return typeof event.args === 'undefined'
				? ({
						isValid: false,
						voter: '',
						options: [],
						percentiles: [],
						value: BigNumber.from(0),
				  } as VoteData)
				: await convertEventToVote(event.args, devInstance, propertyGroupInstance, toBlock)
		})
	)
	return formattedData
}
