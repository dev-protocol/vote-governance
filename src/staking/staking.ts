import { Contract, BigNumber } from 'ethers'
import { getDevTransferEvent } from './../contract'
import { sumTransferEventValue } from './../data-process'
import {
	filteringPropertyAddressTransfer,
	TRANSFER_EVENT_INDEX_FROM,
	TRANSFER_EVENT_INDEX_TO,
} from './../filtering'

export const getAllStakingValue = async (
	devInstance: Contract,
	propertyGroupInstance: Contract,
	user: string,
	toBlock: number
): Promise<BigNumber> => {
	const fromUserEvents = await getDevTransferEvent(
		devInstance,
		user,
		null,
		toBlock
	)
	const toUserEvents = await getDevTransferEvent(
		devInstance,
		null,
		user,
		toBlock
	)
	const filteringFromUserEvent = await filteringPropertyAddressTransfer(
		fromUserEvents,
		TRANSFER_EVENT_INDEX_TO,
		propertyGroupInstance
	)
	const filteringToUserEvent = await filteringPropertyAddressTransfer(
		toUserEvents,
		TRANSFER_EVENT_INDEX_FROM,
		propertyGroupInstance
	)
	const stakingvalue = sumTransferEventValue(filteringFromUserEvent)
	const stakingReleasevalue = sumTransferEventValue(filteringToUserEvent)
	return stakingvalue.sub(stakingReleasevalue)
}
