import { Event, Contract, constants, BigNumber } from 'ethers'
import { VoteData } from './../types'

export const filteringValidData = (
	optionsLength: number,
	voteData: readonly VoteData[]
): readonly VoteData[] => {
	return voteData.filter((data) => {
		return (
			data.isValid &&
			isAccurateSumValue(data.percentiles) &&
			isSameDataCount(data) &&
			isDifferentNumbers(data.options) &&
			isMaxOptionValueUnderThenOptionLength(data.options, optionsLength) &&
			hasStakingValue(data.value) &&
			isDifferentNumbers(data.percentiles) &&
			isAppropriateNumberOfDatacount(data.options.length, optionsLength) &&
			isAppropriateNumberOfDatacount(data.percentiles.length, optionsLength)
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

const isAppropriateNumberOfDatacount = (
	valuesLength: number,
	optionLength: number
): boolean => {
	return 0 < valuesLength && valuesLength <= optionLength
}

const isMaxOptionValueUnderThenOptionLength = (
	options: readonly number[],
	optionLength: number
): boolean => {
	const aryMax = (a: number, b: number): number => {
		return Math.max(a, b)
	}
	const tmp = options.reduce(aryMax)
	return tmp < optionLength
}

const isDifferentNumbers = (values: readonly number[]): boolean => {
	const setValues = new Set(values)
	return setValues.size === values.length
}

const hasStakingValue = (value: BigNumber): boolean => {
	return value.gt(BigNumber.from(0))
}

export const TRANSFER_EVENT_INDEX_FROM = 0
export const TRANSFER_EVENT_INDEX_TO = 1

export type TransferEventIndex = 0 | 1

export const filteringPropertyAddressTransfer = async (
	events: readonly Event[],
	index: TransferEventIndex,
	propertyGroupInstance: Contract
): Promise<readonly Event[]> => {
	return Promise.all(
		events.filter(async (event) => {
			const address =
				typeof event.args === 'undefined'
					? constants.AddressZero
					: event.args[index]
			return await propertyGroupInstance.isGroup(address)
		})
	)
}
