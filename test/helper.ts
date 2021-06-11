import { deployContract } from 'ethereum-waffle'
import { PromiseValue } from 'type-fest'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

export const deployVoteRelationContract = async (
	options: readonly string[],
	votingBlock: number
): Promise<
	readonly [
		PromiseValue<ReturnType<typeof deployContract>>,
		PromiseValue<ReturnType<typeof deployContract>>,
		SignerWithAddress['provider'],
		number,
		readonly SignerWithAddress[]
	]
> => {
	const wallets = await ethers.getSigners()
	const factory__VoteEmitter = await ethers.getContractFactory('VoteEmitter')
	const voteEmitter = await factory__VoteEmitter.connect(wallets[0]).deploy()
	await voteEmitter.deployTransaction.wait()
	const factory__Vote = await ethers.getContractFactory('Vote')
	const vote = await factory__Vote
		.connect(wallets[0])
		.deploy(
			'dummy-subject',
			'dummy-body',
			options,
			'dummy-body-mime-type',
			'dummy-option-mime-type',
			voteEmitter.address,
			votingBlock,
			wallets[0].address
		)
	await vote.deployTransaction.wait()

	const blockNumber = await wallets[0].provider!.getBlockNumber()
	return [vote, voteEmitter, wallets[0].provider, blockNumber, wallets]
}
