import { Contract, Wallet } from 'ethers'
import { deployContract, MockProvider } from 'ethereum-waffle'
import Vote from '../build/Vote.json'
import VoteEmitter from '../build/VoteEmitter.json'

export const deployVoteRelationContract = async (
	options: readonly string[],
	votingBlock: number
): Promise<
	readonly [Contract, Contract, MockProvider, number, readonly Wallet[]]
> => {
	const provider = new MockProvider()
	const wallets = provider.getWallets()
	const voteEmitter = await deployContract(wallets[0], VoteEmitter)
	const vote = await deployContract(wallets[0], Vote, [
		'dummy-subject',
		'dummy-body',
		options,
		'dummy-body-mime-type',
		'dummy-option-mime-type',
		voteEmitter.address,
		votingBlock,
	])
	const blockNumber = await provider.getBlockNumber()
	return [vote, voteEmitter, provider, blockNumber, wallets]
}
