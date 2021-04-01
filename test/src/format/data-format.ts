/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/prefer-readonly-type */

import { expect } from 'chai'
import { describe } from 'mocha'
import sinon from 'sinon'
import { BigNumber, Contract } from 'ethers'
import {
	formatVoteEventData
} from '../../../src/format'
import * as format_details_modules from '../../../src/format/data-format-details'
import { Result } from '@ethersproject/abi'
import { VoteData } from '../../../src/types'

describe('convertEventToVote', () => {
	let convertEventToVote: sinon.SinonStub<[args: Result, devInstance: Contract, propertyGroupInstance: Contract, toBlock: number], Promise<VoteData>>
	before(() => {
		convertEventToVote = sinon.stub(format_details_modules, 'convertEventToVote')
		convertEventToVote.onCall(0).resolves({
			isValid: true,
			voter: '0x.............',
			percentiles: [10, 90],
			value: BigNumber.from(100)
		} as VoteData)
		convertEventToVote.onCall(1).resolves({
			isValid: true,
			voter: '0xa.............',
			percentiles: [20, 80],
			value: BigNumber.from(200)
		} as VoteData)
		convertEventToVote.onCall(2).resolves({
			isValid: true,
			voter: '0xb.............',
			percentiles: [30, 70],
			value: BigNumber.from(300)
		} as VoteData)
	})
	it('Event data will be converted to voting data.', async () => {
		const events = [
			{
				args: {
					test: ''
				}
			},
			{
				args: undefined
			},
			{
				args: {
					test: ''
				}
			},
			{
				args: undefined
			},
			{
				args: {
					test: ''
				}
			},
		]
		const voteData = await formatVoteEventData(events as any, {} as any, {} as any, 100)
		expect(voteData.length).to.be.equal(5)

		expect(voteData[0].isValid).to.be.equal(true)
		expect(voteData[0].voter).to.be.equal('0x.............')
		expect(voteData[0].percentiles[0]).to.be.equal(10)
		expect(voteData[0].percentiles[1]).to.be.equal(90)
		expect(voteData[0].value.toString()).to.be.equal('100')

		expect(voteData[2].isValid).to.be.equal(true)
		expect(voteData[2].voter).to.be.equal('0xa.............')
		expect(voteData[2].percentiles[0]).to.be.equal(20)
		expect(voteData[2].percentiles[1]).to.be.equal(80)
		expect(voteData[2].value.toString()).to.be.equal('200')

		expect(voteData[4].isValid).to.be.equal(true)
		expect(voteData[4].voter).to.be.equal('0xb.............')
		expect(voteData[4].percentiles[0]).to.be.equal(30)
		expect(voteData[4].percentiles[1]).to.be.equal(70)
		expect(voteData[4].value.toString()).to.be.equal('300')

		expect(voteData[1].isValid).to.be.equal(false)
		expect(voteData[1].voter).to.be.equal('')
		expect(voteData[1].percentiles.length).to.be.equal(0)
		expect(voteData[1].value.toString()).to.be.equal('0')

		expect(voteData[3].isValid).to.be.equal(false)
		expect(voteData[3].voter).to.be.equal('')
		expect(voteData[3].percentiles.length).to.be.equal(0)
		expect(voteData[3].value.toString()).to.be.equal('0')
	})
	after(() => {
		convertEventToVote.restore()
	})
})

