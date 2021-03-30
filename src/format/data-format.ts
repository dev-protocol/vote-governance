import { Event, ethers, BigNumber, Contract } from 'ethers'
import { Result } from '@ethersproject/abi'
import { VoteData } from './../types'
import { getAllStakingValue } from './../staking'

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
						optionsRaw: [],
						percentiles: [],
						value: BigNumber.from(0),
				  } as VoteData)
				: await format(event.args, devInstance, propertyGroupInstance, toBlock)
		})
	)
	return formattedData
}

const format = async (
	args: Result,
	devInstance: Contract,
	propertyGroupInstance: Contract,
	toBlock: number
): Promise<VoteData> => {
	const byte32Options = args[2] as readonly string[]
	const parsedOptions = byte32Options.map((option) => {
		return ethers.utils.parseBytes32String(option)
	})
	const percentiles = args[3] as readonly number[]
	const stakingvalue = await getAllStakingValue(
		devInstance,
		propertyGroupInstance,
		args[1],
		toBlock
	)
	return {
		isValid: true,
		voter: args[1],
		options: parsedOptions,
		optionsRaw: byte32Options,
		percentiles: percentiles,
		value: stakingvalue,
	} as VoteData
}
