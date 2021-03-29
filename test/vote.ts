/* eslint-disable new-cap */
import { expect, use } from 'chai'
import { describe } from 'mocha'
import { Contract, ethers, Wallet } from 'ethers'
import { deployContract, MockProvider, solidity } from 'ethereum-waffle'
import { mine } from '@devprotocol/util-ts'
import Vote from '../build/Vote.json'
import VoteEmitter from '../build/VoteEmitter.json'

use(solidity)

describe('Vote', () => {
	const VOTING_BLOCK = 100
	const init = async (): Promise<
		[Contract, Contract, MockProvider, number, Wallet[]]
	> => {
		const provider = new MockProvider()
		const wallets = provider.getWallets()
		const voteEmitter = await deployContract(wallets[0], VoteEmitter)
		const vote = await deployContract(wallets[0], Vote, [
			voteEmitter.address,
			VOTING_BLOCK,
		])
		const blockNUmber = await provider.getBlockNumber()
		return [vote, voteEmitter, provider, blockNUmber, wallets]
	}

	describe('constructor', () => {
		it('Internal variables are recorded.', async () => {
			const [vote, voteEmitter, , blockNUmber] = await init()
			expect(await vote.period()).to.be.equal(blockNUmber + VOTING_BLOCK)
			expect(await vote.voteEmitter()).to.be.equal(voteEmitter.address)
		})
	})
	describe('vote', () => {
		it('If you miss the voting deadline, you will get an error.', async () => {
			const [vote, , provider] = await init()
			await mine(provider, VOTING_BLOCK)

			await expect(vote.vote([], [])).to.be.revertedWith('over the period')
		})
		it('save vote infomation.', async () => {
			const [vote, voteEmitter, , , wallets] = await init()
			const options0 = ethers.utils.formatBytes32String('http://hogehoge/0')
			const options1 = ethers.utils.formatBytes32String('http://hogehoge/1')
			const arg1 = [options0, options1]
			await vote.vote(arg1, [40, 60])
			const filterVote = voteEmitter.filters.Vote()
			const events = await voteEmitter.queryFilter(filterVote)
			expect(events[0].args?.[0]).to.be.equal(vote.address)
			expect(events[0].args?.[1]).to.be.equal(wallets[0].address)
			expect(events[0].args?.[2][0]).to.be.equal(options0)
			expect(events[0].args?.[2][1]).to.be.equal(options1)
			expect(events[0].args?.[3][0]).to.be.equal(40)
			expect(events[0].args?.[3][1]).to.be.equal(60)
		})
	})
})
