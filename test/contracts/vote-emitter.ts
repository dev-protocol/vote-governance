/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable new-cap */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */

import { expect, use } from 'chai'
import { deployContract, solidity } from 'ethereum-waffle'
import { PromiseValue } from 'type-fest'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

use(solidity)

describe('VoteEmitter', () => {
	const init = async (): Promise<
		readonly [
			PromiseValue<ReturnType<typeof deployContract>>,
			readonly SignerWithAddress[]
		]
	> => {
		const wallets = await ethers.getSigners()
		const factory = await ethers.getContractFactory('VoteEmitter')
		const voteEmitter = await factory.connect(wallets[0]).deploy()
		await voteEmitter.deployTransaction.wait()
		return [voteEmitter, wallets]
	}

	describe('dispatch', () => {
		it('save vote infomation.', async () => {
			const [voteEmitter, wallets] = await init()
			await voteEmitter.dispatch(wallets[1].address, [40, 60])
			const filterVote = voteEmitter.filters.Vote(wallets[0].address)
			const events = await voteEmitter.queryFilter(filterVote)
			expect(events[0].args?.[0]).to.be.equal(wallets[0].address)
			expect(events[0].args?.[1]).to.be.equal(wallets[1].address)
			expect(events[0].args?.[2][0]).to.be.equal(40)
			expect(events[0].args?.[2][1]).to.be.equal(60)
		})
		it('save vote infomation.(vote 0)', async () => {
			const [voteEmitter, wallets] = await init()
			await voteEmitter.dispatch(wallets[1].address, [0, 100])
			const filterVote = voteEmitter.filters.Vote(wallets[0].address)
			const events = await voteEmitter.queryFilter(filterVote)
			expect(events[0].args?.[0]).to.be.equal(wallets[0].address)
			expect(events[0].args?.[1]).to.be.equal(wallets[1].address)
			expect(events[0].args?.[2][0]).to.be.equal(0)
			expect(events[0].args?.[2][1]).to.be.equal(100)
		})
		it('get use index.', async () => {
			const [voteEmitter, wallets] = await init()
			await voteEmitter.dispatch(wallets[1].address, [40, 60])
			await voteEmitter.dispatch(wallets[2].address, [30, 70])
			const otherVoteEmitter = voteEmitter.connect(wallets[3])
			await otherVoteEmitter.dispatch(wallets[4].address, [20, 80])

			const filterVote = voteEmitter.filters.Vote(wallets[0].address)
			const events = await voteEmitter.queryFilter(filterVote)
			expect(events[0].args?.[0]).to.be.equal(wallets[0].address)
			expect(events[0].args?.[1]).to.be.equal(wallets[1].address)
			expect(events[0].args?.[2][0]).to.be.equal(40)
			expect(events[0].args?.[2][1]).to.be.equal(60)
			expect(events[1].args?.[0]).to.be.equal(wallets[0].address)
			expect(events[1].args?.[1]).to.be.equal(wallets[2].address)
			expect(events[1].args?.[2][0]).to.be.equal(30)
			expect(events[1].args?.[2][1]).to.be.equal(70)
			expect(events.length).to.be.equal(2)

			const filterVote2 = voteEmitter.filters.Vote(wallets[3].address)
			const events2 = await voteEmitter.queryFilter(filterVote2)

			expect(events2[0].args?.[0]).to.be.equal(wallets[3].address)
			expect(events2[0].args?.[1]).to.be.equal(wallets[4].address)
			expect(events2[0].args?.[2][0]).to.be.equal(20)
			expect(events2[0].args?.[2][1]).to.be.equal(80)
			expect(events2.length).to.be.equal(1)
		})
	})
})
