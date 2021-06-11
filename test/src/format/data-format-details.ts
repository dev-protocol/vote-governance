/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/prefer-readonly-type */

import { expect } from 'chai'
import sinon from 'sinon'
import { BigNumber, Contract } from 'ethers'
import { convertEventToVote } from '../../../src/format/data-format-details'
import * as staking_modules from '../../../src/staking/staking'

describe('convertEventToVote', () => {
	let getAllStakingValue: sinon.SinonStub<
		[
			devInstance: Contract,
			propertyGroupInstance: Contract,
			user: string,
			toBlock: number
		],
		Promise<BigNumber>
	>
	before(() => {
		getAllStakingValue = sinon.stub(staking_modules, 'getAllStakingValue')
		getAllStakingValue.onCall(0).resolves(BigNumber.from(100))
	})
	it('Event data will be converted to voting data.', async () => {
		const args = {
			percentiles: [10, 90],
			voter: '0x.............',
		}
		const voteData = await convertEventToVote(
			args as any,
			{} as any,
			{} as any,
			100
		)
		expect(voteData.isValid).to.be.equal(true)
		expect(voteData.voter).to.be.equal('0x.............')
		expect(voteData.percentiles[0]).to.be.equal(10)
		expect(voteData.percentiles[1]).to.be.equal(90)
		expect(voteData.value.toString()).to.be.equal('100')
	})
	after(() => {
		getAllStakingValue.restore()
	})
})
