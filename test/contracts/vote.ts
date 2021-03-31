/* eslint-disable new-cap */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */

import { expect, use } from 'chai'
import { describe } from 'mocha'
import { BigNumber } from 'ethers'
import { solidity } from 'ethereum-waffle'
import { mine } from '@devprotocol/util-ts'
import { deployVoteRelationContract } from './../helper'

use(solidity)

describe('Vote', () => {
	const VOTING_BLOCK = 100
	const options0 = 'http://hogehoge/0'
	const options1 = 'http://hogehoge/1'

	describe('constructor', () => {
		it('Internal variables are recorded.', async () => {
			const [
				vote,
				voteEmitter,
				,
				blockNumber,
				wallets,
			] = await deployVoteRelationContract([options0, options1], VOTING_BLOCK)
			expect(await vote.proposer()).to.be.equal(wallets[0].address)
			expect(await vote.subject()).to.be.equal('dummy-subject')
			expect(await vote.body()).to.be.equal('dummy-body')
			expect(await vote.options(0)).to.be.equal(options0)
			expect(await vote.options(1)).to.be.equal(options1)
			expect(await vote.bodyMimeType()).to.be.equal('dummy-body-mime-type')
			expect(await vote.optionsMimeType()).to.be.equal('dummy-option-mime-type')
			expect(await vote.period()).to.be.equal(blockNumber + VOTING_BLOCK)
			expect(await vote.voteEmitter()).to.be.equal(voteEmitter.address)
		})
	})
	describe('attributes', () => {
		it('Internal variables are recorded.', async () => {
			const [vote, , , blockNumber, wallets] = await deployVoteRelationContract(
				[options0, options1],
				VOTING_BLOCK
			)
			const attributes = await vote.attributes()
			expect(attributes.proposer).to.be.equal(wallets[0].address)
			expect(attributes.subject).to.be.equal('dummy-subject')
			expect(attributes.body).to.be.equal('dummy-body')
			expect((attributes.period as BigNumber).toString()).to.be.equal(
				(blockNumber + VOTING_BLOCK).toString()
			)
			expect(attributes.options[0]).to.be.equal(options0)
			expect(attributes.options[1]).to.be.equal(options1)
			expect(attributes.bodyMimeType).to.be.equal('dummy-body-mime-type')
			expect(attributes.optionsMimeType).to.be.equal('dummy-option-mime-type')
		})
	})
	describe('vote', () => {
		it('If you miss the voting deadline, you will get an error.', async () => {
			const [vote, , provider] = await deployVoteRelationContract(
				[options0, options1],
				VOTING_BLOCK
			)
			await mine(provider, VOTING_BLOCK)

			await expect(vote.vote([], [])).to.be.revertedWith('over the period')
		})
		it('save vote infomation.', async () => {
			const [vote, voteEmitter, , , wallets] = await deployVoteRelationContract(
				[options0, options1],
				VOTING_BLOCK
			)
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
