import { BaseProvider } from '@ethersproject/providers'

export const getDevAddress = async (
	provider: BaseProvider
): Promise<string> => {
	const network = await provider.getNetwork()
	const address =
		network.name === 'ropsten'
			? '0x5312f4968901Ec9d4fc43d2b0e437041614B14A2'
			: '0x5cAf454Ba92e6F2c929DF14667Ee360eD9fD5b26'
	return address
}
