import { Contract, Event } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'

export const getDevContract = async (
	provider: BaseProvider
): Promise<Contract> => {
	const network = await provider.getNetwork()
	const address = network.name === 'ropsten' ? '0x5312f4968901Ec9d4fc43d2b0e437041614B14A2' : '0x5cAf454Ba92e6F2c929DF14667Ee360eD9fD5b26'
	const abi = [
		'event Transfer(address indexed from, address indexed to, uint256 value)',
	]
	return new Contract(address, abi, provider)
}

export const getDevTransferEvent = async (
	devInstance: Contract,
	fromAddress: string | null,
	toAddress: string | null,
	toBlock: number
): Promise<readonly Event[]> => {
	const filterVote = devInstance.filters.Transfer(fromAddress, toAddress)
	const events = await devInstance.queryFilter(filterVote, undefined,  toBlock)
	return events
}
