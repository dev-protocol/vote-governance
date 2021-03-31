/* eslint-disable new-cap */
import { expect, use } from 'chai'
import { describe } from 'mocha'
import { Contract, Wallet, BigNumber } from 'ethers'
import { deployContract, MockProvider, solidity } from 'ethereum-waffle'
import { mine } from '@devprotocol/util-ts'
import Vote from '../build/Vote.json'
import VoteEmitter from '../build/VoteEmitter.json'

use(solidity)

describe('Vote', () => {
	const VOTING_BLOCK = 100
	const options0 = 'http://hogehoge/0'
	const options1 = 'http://hogehoge/1'
	const init = async (): Promise<
		[Contract, Contract, MockProvider, number, Wallet[]]
	> => {
		const provider = new MockProvider()
		const wallets = provider.getWallets()
		const voteEmitter = await deployContract(wallets[0], VoteEmitter)
		const vote = await deployContract(wallets[0], Vote, [
			'dummy-subject',
			'dummy-body',
			[options0, options1],
			'dummy-body-mime-type',
			'dummy-option-mime-type',
			voteEmitter.address,
			VOTING_BLOCK,
		])
		const blockNUmber = await provider.getBlockNumber()
		return [vote, voteEmitter, provider, blockNUmber, wallets]
	}

	describe('constructor', () => {
		it('Internal variables are recorded.', async () => {
			const [vote, voteEmitter, , blockNUmber, wallets] = await init()
			expect(await vote.proposer()).to.be.equal(wallets[0].address)
			expect(await vote.subject()).to.be.equal('dummy-subject')
			expect(await vote.body()).to.be.equal('dummy-body')
			expect(await vote.options(0)).to.be.equal(options0)
			expect(await vote.options(1)).to.be.equal(options1)
			expect(await vote.bodyMimeType()).to.be.equal('dummy-body-mime-type')
			expect(await vote.optionsMimeType()).to.be.equal('dummy-option-mime-type')
			expect(await vote.period()).to.be.equal(blockNUmber + VOTING_BLOCK)
			expect(await vote.voteEmitter()).to.be.equal(voteEmitter.address)
		})
	})
	describe('attributes', () => {
		it('Internal variables are recorded.', async () => {
			const [vote, , , blockNUmber, wallets] = await init()
			const attributes = await vote.attributes()
			expect(attributes.proposer).to.be.equal(wallets[0].address)
			expect(attributes.subject).to.be.equal('dummy-subject')
			expect(attributes.body).to.be.equal('dummy-body')
			expect((attributes.period as BigNumber).toString()).to.be.equal(
				(blockNUmber + VOTING_BLOCK).toString()
			)
			expect(attributes.options[0]).to.be.equal(options0)
			expect(attributes.options[1]).to.be.equal(options1)
			expect(attributes.bodyMimeType).to.be.equal('dummy-body-mime-type')
			expect(attributes.optionsMimeType).to.be.equal('dummy-option-mime-type')
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
			await vote.vote([40, 60])
			const filterVote = voteEmitter.filters.Vote()
			const events = await voteEmitter.queryFilter(filterVote)
			expect(events[0].args?.[0]).to.be.equal(vote.address)
			expect(events[0].args?.[1]).to.be.equal(wallets[0].address)
			expect(events[0].args?.[2][0]).to.be.equal(40)
			expect(events[0].args?.[2][1]).to.be.equal(60)
		})
	})
})
