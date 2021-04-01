import { Event, Contract, BigNumber } from 'ethers'
import pRetry from 'p-retry'
import { VoteData } from './../types'

export const filteringValidData = (
	optionsLength: number,
	voteData: readonly VoteData[]
): readonly VoteData[] => {
	return voteData.filter((data) => {
		return (
			data.isValid &&
			hasStakingValue(data.value) &&
			isAccurateSumValue(data.percentiles) &&
			isDifferentNumbers(data.percentiles) &&
			isSameDataCount(data.percentiles.length, optionsLength)
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

const isSameDataCount = (
	valuesLength: number,
	optionLength: number
): boolean => {
	return valuesLength === optionLength
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

const cache = new Map<string, boolean>()

export const filteringPropertyAddressTransfer = async (
	events: readonly Event[],
	index: TransferEventIndex,
	propertyGroupInstance: Contract
): Promise<readonly Event[]> => {
	const tmp = await Promise.all(
		events.map(async (event) => {
			const address =
				typeof event.args === 'undefined' ? undefined : event.args[index]
			return typeof address === 'undefined'
				? false
				: // eslint-disable-next-line functional/functional-parameters
				  await pRetry(() => {
						const fromCache = cache.get(address)
						return typeof fromCache === 'boolean'
							? fromCache
							: propertyGroupInstance.isGroup(address).then((res: boolean) => {
									// eslint-disable-next-line functional/no-expression-statement
									cache.set(address, res)
									return res
							  })
				  })
		})
	)
	return events.filter((_, i) => tmp[i])
}
