import { Contract } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'

export const getAddressConfigContract = (
	provider: BaseProvider,
	address: string
): Contract => {
	const abi = [
		'function propertyGroup() external view returns (address)',
		'function token() external view returns (address)',
	]
	return new Contract(address, abi, provider)
}
