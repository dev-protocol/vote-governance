/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { getVoteEvent } from '../../../src/contract/vote-emitter'
import { deployVoteRelationContract } from './../../helper'

const VOTING_BLOCK = 100
const options0 = 'http://hogehoge/0'
const options1 = 'http://hogehoge/1'

describe('getVoteEvent', () => {
	it('If the event does not exist, cannot get anything.', async () => {
		const [vote, , provider, ,] = await deployVoteRelationContract(
			[options0, options1],
			VOTING_BLOCK
		)
		const events = await getVoteEvent(vote as any, provider as any)
		expect(events.length).to.be.equal(0)
	})
	it('can get event info.', async () => {
		const [vote, , provider, , wallets] = await deployVoteRelationContract(
			[options0, options1],
			VOTING_BLOCK
		)
		await vote.vote([10, 90])
		await vote.vote([20, 80])
		const events = await getVoteEvent(vote as any, provider as any)
		expect(events.length).to.be.equal(2)
		expect(events[0].args!.dispatcher).to.be.equal(vote.address)
		expect(events[0].args!.voter).to.be.equal(wallets[0].address)
		expect(events[0].args!.percentiles[0]).to.be.equal(10)
		expect(events[0].args!.percentiles[1]).to.be.equal(90)
		expect(events[1].args!.dispatcher).to.be.equal(vote.address)
		expect(events[1].args!.voter).to.be.equal(wallets[0].address)
		expect(events[1].args!.percentiles[0]).to.be.equal(20)
		expect(events[1].args!.percentiles[1]).to.be.equal(80)
	})
	it('Only relevant events can be retrieved..', async () => {
		const [
			vote,
			voteEmitter,
			provider,
			,
			wallets,
		] = await deployVoteRelationContract([options0, options1], VOTING_BLOCK)
		await vote.vote([10, 90])
		await vote.vote([20, 80])
		await voteEmitter.dispatch(wallets[1].address, [0, 0])
		await voteEmitter.dispatch(wallets[2].address, [0, 0])
		const events = await getVoteEvent(vote as any, provider as any)
		expect(events.length).to.be.equal(2)
		expect(events[0].args!.dispatcher).to.be.equal(vote.address)
		expect(events[0].args!.voter).to.be.equal(wallets[0].address)
		expect(events[0].args!.percentiles[0]).to.be.equal(10)
		expect(events[0].args!.percentiles[1]).to.be.equal(90)
		expect(events[1].args!.dispatcher).to.be.equal(vote.address)
		expect(events[1].args!.voter).to.be.equal(wallets[0].address)
		expect(events[1].args!.percentiles[0]).to.be.equal(20)
		expect(events[1].args!.percentiles[1]).to.be.equal(80)
	})
})
