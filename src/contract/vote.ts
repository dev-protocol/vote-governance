import { Contract, Event, BigNumber } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'
import { getVoteEvent } from './vote-emitter'
import { VoteAttributes } from './../types'

export const getVoteContract = (
	address: string,
	provider: BaseProvider
): Contract => {
	const abi = [
		{
		  "inputs": [],
		  "name": "attributes",
		  "outputs": [
			{
			  "components": [
				{
				  "internalType": "string",
				  "name": "subject",
				  "type": "string"
				},
				{
				  "internalType": "string",
				  "name": "body",
				  "type": "string"
				},
				{
				  "internalType": "uint256",
				  "name": "period",
				  "type": "uint256"
				},
				{
				  "internalType": "string[]",
				  "name": "options",
				  "type": "string[]"
				},
				{
				  "internalType": "string",
				  "name": "bodyMimeType",
				  "type": "string"
				},
				{
				  "internalType": "string",
				  "name": "optionsMimeType",
				  "type": "string"
				}
			  ],
			  "internalType": "struct Vote.Attributes",
			  "name": "",
			  "type": "tuple"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "inputs": [],
		  "name": "voteEmitter",
		  "outputs": [
			{
			  "internalType": "address",
			  "name": "",
			  "type": "address"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function"
		}
	  ]
	return new Contract(address, abi, provider)
}

export const getRelationVoteEvent = async (
	voteInstance: Contract,
	provider: BaseProvider
): Promise<readonly Event[]> => {
	const voteAllLogs = await getVoteEvent(voteInstance, provider)
	return voteAllLogs
}

export const getVoteAttributes = async (
	voteInstance: Contract
): Promise<VoteAttributes> => {
	const tmp = await voteInstance.attributes()
	return {
		subject: tmp[0],
		body: tmp[1],
		period: (tmp[2] as BigNumber).toNumber(),
		options: tmp[3],
		bodyMimeType: tmp[4],
		optionsMimeType: tmp[5],
	} as VoteAttributes
}
//struct Attributes {string subject;string body;uint256 period;string[] options;string bodyMimeType;string optionsMimeType;}
