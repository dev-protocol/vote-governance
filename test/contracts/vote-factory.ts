/* eslint-disable new-cap */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */

import { expect, use } from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers } from 'hardhat'

use(solidity)

describe('VoteFactory', () => {
	const VOTING_BLOCK = 100
	const options0 = 'http://hogehoge/0'
	const options1 = 'http://hogehoge/1'

	describe('create', () => {
		it('create vote contract.', async () => {
			const wallets = await ethers.getSigners()
			const factory = await ethers.getContractFactory('VoteFactory')
			const voteFactory = await factory
				.connect(wallets[0])
				.deploy(wallets[1].address)
			await voteFactory.deployTransaction.wait()

			await voteFactory.create(
				'dummy-subject',
				'dummy-body',
				[options0, options1],
				'dummy-body-mime-type',
				'dummy-option-mime-type',
				VOTING_BLOCK
			)
			const blockNumber = await wallets[0].provider!.getBlockNumber()
			const filter = voteFactory.filters.VoteCreate(wallets[0].address)
			const events = await voteFactory.queryFilter(filter)
			expect(events[0].args?.[0]).to.be.equal(wallets[0].address)
			const voteAddress = events[0].args?.[1]
			const voteInstance = await ethers.getContractAt('Vote', voteAddress)
			expect(await voteInstance.proposer()).to.be.equal(wallets[0].address)
			expect(await voteInstance.subject()).to.be.equal('dummy-subject')
			expect(await voteInstance.body()).to.be.equal('dummy-body')
			expect(await voteInstance.options(0)).to.be.equal(options0)
			expect(await voteInstance.options(1)).to.be.equal(options1)
			expect(await voteInstance.bodyMimeType()).to.be.equal(
				'dummy-body-mime-type'
			)
			expect(await voteInstance.optionsMimeType()).to.be.equal(
				'dummy-option-mime-type'
			)
			expect(await voteInstance.period()).to.be.equal(
				blockNumber + VOTING_BLOCK
			)
			expect(await voteInstance.voteEmitter()).to.be.equal(wallets[1].address)
		})
	})
})
