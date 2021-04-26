import { deployContract, MockProvider } from 'ethereum-waffle'
import Vote from '../build/Vote.json'
import VoteEmitter from '../build/VoteEmitter.json'
import { PromiseValue } from 'type-fest'

export const deployVoteRelationContract = async (
	options: readonly string[],
	votingBlock: number
): Promise<
	readonly [
		PromiseValue<ReturnType<typeof deployContract>>,
		PromiseValue<ReturnType<typeof deployContract>>,
		MockProvider,
		number,
		ReturnType<MockProvider['getWallets']>
	]
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
		wallets[0].address,
	])
	const blockNumber = await provider.getBlockNumber()
	return [vote, voteEmitter, provider, blockNumber, wallets]
}
