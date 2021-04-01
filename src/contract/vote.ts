import { Contract, BigNumber } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'
import { VoteAttributes } from './../types'
import pRetry from 'p-retry'

export const getVoteContract = (
	address: string,
	provider: BaseProvider
): Contract => {
	const abi = [
		{
			inputs: [],
			name: 'attributes',
			outputs: [
				{
					components: [
						{
							internalType: 'address',
							name: 'proposer',
							type: 'address',
						},
						{
							internalType: 'string',
							name: 'subject',
							type: 'string',
						},
						{
							internalType: 'string',
							name: 'body',
							type: 'string',
						},
						{
							internalType: 'uint256',
							name: 'period',
							type: 'uint256',
						},
						{
							internalType: 'string[]',
							name: 'options',
							type: 'string[]',
						},
						{
							internalType: 'string',
							name: 'bodyMimeType',
							type: 'string',
						},
						{
							internalType: 'string',
							name: 'optionsMimeType',
							type: 'string',
						},
					],
					internalType: 'struct Vote.Attributes',
					name: '',
					type: 'tuple',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'voteEmitter',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
	]
	return new Contract(address, abi, provider)
}

export const getVoteAttributes = async (
	voteInstance: Contract
): Promise<VoteAttributes> => {
	// eslint-disable-next-line functional/functional-parameters
	const tmp = await pRetry(() => voteInstance.attributes())
	return {
		proposer: tmp.proposer,
		subject: tmp.subject,
		body: tmp.body,
		period: (tmp.period as BigNumber).toNumber(),
		options: tmp.options,
		bodyMimeType: tmp.bodyMimeType,
		optionsMimeType: tmp.optionsMimeType,
	} as VoteAttributes
}
