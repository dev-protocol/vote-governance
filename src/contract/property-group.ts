import { Contract } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'

export const getPropertyGroupContract = async (
	provider: BaseProvider,
	propertyGroupAddress: string
): Promise<Contract> => {
	const abi = ['function isGroup(address _addr) external view returns (bool)']
	return new Contract(propertyGroupAddress, abi, provider)
}
