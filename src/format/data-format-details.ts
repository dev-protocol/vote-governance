import { Contract } from 'ethers'
import { Result } from '@ethersproject/abi'
import { VoteData } from './../types'
import { getAllStakingValue } from './../staking'

export const convertEventToVote = async (
	args: Result,
	devInstance: Contract,
	propertyGroupInstance: Contract,
	toBlock: number
): Promise<VoteData> => {
	const percentiles = args.percentiles as readonly number[]
	const stakingvalue = await getAllStakingValue(
		devInstance,
		propertyGroupInstance,
		args.voter,
		toBlock
	)
	return {
		isValid: true,
		voter: args.voter,
		percentiles: percentiles,
		value: stakingvalue,
	} as VoteData
}
