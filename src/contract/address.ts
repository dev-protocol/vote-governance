import { BaseProvider } from '@ethersproject/providers'

export const getAddressConfigAddress = async (
	provider: BaseProvider
): Promise<string> => {
	const network = await provider.getNetwork()
	const address =
		network.name === 'ropsten'
			? '0xD6D07f1c048bDF2B3d5d9B6c25eD1FC5348D0A70'
			: '0x1D415aa39D647834786EB9B5a333A50e9935b796'
	return address
}
