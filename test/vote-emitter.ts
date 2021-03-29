/* eslint-disable new-cap */
import { expect, use } from 'chai'
import { describe } from 'mocha'
import { Contract, ethers, Wallet } from 'ethers'
import { deployContract, MockProvider, solidity } from 'ethereum-waffle'
import VoteEmitter from '../build/VoteEmitter.json'

use(solidity)

describe('VoteEmitter', () => {
	const init = async (): Promise<[Contract, Wallet[]]> => {
		const provider = new MockProvider()
		const wallets = provider.getWallets()
		const voteEmitter = await deployContract(wallets[0], VoteEmitter)
		return [voteEmitter, wallets]
	}

	describe('dispatch', () => {
		it('save vote infomation.', async () => {
			const [voteEmitter, wallets] = await init()
			const options0 = ethers.utils.formatBytes32String('http://hogehoge/0')
			const options1 = ethers.utils.formatBytes32String('http://hogehoge/1')
			const arg1 = [options0, options1]
			await voteEmitter.dispatch(wallets[1].address, arg1, [40, 60])
			const filterVote = voteEmitter.filters.Vote()
			const events = await voteEmitter.queryFilter(filterVote)
			expect(events[0].args?.[0]).to.be.equal(wallets[0].address)
			expect(events[0].args?.[1]).to.be.equal(wallets[1].address)
			expect(events[0].args?.[2][0]).to.be.equal(options0)
			expect(events[0].args?.[2][1]).to.be.equal(options1)
			expect(events[0].args?.[3][0]).to.be.equal(40)
			expect(events[0].args?.[3][1]).to.be.equal(60)
		})
	})
})
