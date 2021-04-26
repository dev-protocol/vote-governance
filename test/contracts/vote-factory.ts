/* eslint-disable new-cap */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */

import { expect, use } from 'chai'
import { describe } from 'mocha'
import { Contract } from 'ethers'
import { solidity } from 'ethereum-waffle'
import { deployContract, MockProvider } from 'ethereum-waffle'
import VoteFactory from '../../build/VoteFactory.json'
import Vote from '../../build/Vote.json'

use(solidity)

describe('VoteFactory', () => {
	const VOTING_BLOCK = 100
	const options0 = 'http://hogehoge/0'
	const options1 = 'http://hogehoge/1'

	describe('create', () => {
		it('create vote contract.', async () => {
			const provider = new MockProvider()
			const wallets = provider.getWallets()
			const voteFactory = await deployContract(wallets[0], VoteFactory)
			await voteFactory.create('dummy-subject', 'dummy-body', [options0, options1], 'dummy-body-mime-type', 'dummy-option-mime-type', wallets[1].address, VOTING_BLOCK)
			const blockNumber = await provider.getBlockNumber()
			const filter = voteFactory.filters.VoteCreate(wallets[0].address)
			const events = await voteFactory.queryFilter(filter)
			expect(events[0].args?.[0]).to.be.equal(wallets[0].address)
			const voteAddress = events[0].args?.[1]	
			const voteInstance = new Contract(voteAddress, Vote.abi, provider)
			expect(await voteInstance.proposer()).to.be.equal(wallets[0].address)
			expect(await voteInstance.subject()).to.be.equal('dummy-subject')
			expect(await voteInstance.body()).to.be.equal('dummy-body')
			expect(await voteInstance.options(0)).to.be.equal(options0)
			expect(await voteInstance.options(1)).to.be.equal(options1)
			expect(await voteInstance.bodyMimeType()).to.be.equal('dummy-body-mime-type')
			expect(await voteInstance.optionsMimeType()).to.be.equal('dummy-option-mime-type')
			expect(await voteInstance.period()).to.be.equal(blockNumber + VOTING_BLOCK)
			expect(await voteInstance.voteEmitter()).to.be.equal(wallets[1].address)

		})
	})
})
