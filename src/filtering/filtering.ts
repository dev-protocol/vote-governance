import { ethers, Event, Contract, constants, BigNumber } from 'ethers'
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
			isAccurateSumValue(data.percentiles) &&
			isSameDataCount(data) &&
			isUniqueOptionNames(data.options) &&
			isReasonableOptions(data.options, parsedOptions) &&
			hasStakingValue(data.value) &&
			isDifferentNumbers(data.percentiles)
		)
	})
}

const isAccurateSumValue = (percentiles: readonly number[]): boolean => {
	return (
		percentiles.reduce((sum, element) => {
			return sum + element
		}, 0) === 100
	)
}

const isSameDataCount = (data: VoteData): boolean => {
	return data.percentiles.length === data.options.length
}

const isUniqueOptionNames = (options: readonly string[]): boolean => {
	const setOptions = new Set(options)
	return setOptions.size === options.length
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

const isDifferentNumbers = (percentiles: readonly number[]): boolean => {
	const setPercentiles = new Set(percentiles)
	return setPercentiles.size === percentiles.length
}

const hasStakingValue = (value: BigNumber): boolean => {
	return value.gt(BigNumber.from(0))
}

export const TRANSFER_EVENT_INDEX_FROM = 0
export const TRANSFER_EVENT_INDEX_TO = 1

export type TransferEventIndex = 0 | 1

export const filteringPropertyAddressTransfer = async (events: readonly Event[], index: TransferEventIndex, propertyGroupInstance: Contract): Promise<readonly Event[]> => {
	return Promise.all(events.filter(async (event)=>{
		const address = typeof(event.args) === 'undefined' ? constants.AddressZero: event.args[index]
		return await propertyGroupInstance.isGroup(address)
	}))
}
