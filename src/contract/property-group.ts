import { Contract } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'
import { getAddressConfigContract } from './address-config'


export const getPropertyGroupContract = async (
	provider: BaseProvider
): Promise<Contract> => {
	const addressConfigInstance = await getAddressConfigContract(provider)
	const propertyGroupAddress: string = await addressConfigInstance.propertyGroup()
	const abi = [
		'function isGroup(address _addr) external view returns (bool)',
	]
	return new Contract(propertyGroupAddress, abi, provider)
}
