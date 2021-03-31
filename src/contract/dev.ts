import { Contract, Event } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'

export const getDevContract = (
	provider: BaseProvider,
	devAddress: string
): Contract => {
	const abi = [
		'event Transfer(address indexed from, address indexed to, uint256 value)',
	]
	return new Contract(devAddress, abi, provider)
}

export const getDevTransferEvent = async (
	devInstance: Contract,
	fromAddress: string | null,
	toAddress: string | null,
	toBlock: number
): Promise<readonly Event[]> => {
	const filterVote = devInstance.filters.Transfer(fromAddress, toAddress)
	const events = await devInstance.queryFilter(filterVote, undefined, toBlock)
	return events
}
