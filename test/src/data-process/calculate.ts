/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { BigNumber } from 'ethers'
import { sumTransferEventValue, calculateVote } from '../../../src/data-process'

describe('sumTransferEventValue', () => {
	it('The total transfer amount will be returned.', async () => {
		const data = [
			{
				args: {
					value: 10,
				},
			},
			{
				args: {
					value: 20,
				},
			},
			{
				args: {
					value: 30,
				},
			},
		]
		const sumValue: BigNumber = sumTransferEventValue(data as any)
		expect(sumValue.toString()).to.be.equal('60')
	})
	it('Ignored if the transfer information does not exist.', async () => {
		const data = [
			{
				args: {
					value: 10,
				},
			},
			{
				args: undefined,
			},
			{
				args: {
					value: 30,
				},
			},
		]
		const sumValue: BigNumber = sumTransferEventValue(data as any)
		expect(sumValue.toString()).to.be.equal('40')
	})
})

describe('calculateVote', () => {
	it('Calculate the voting results(ver1).', async () => {
		const data = [
			{
				percentiles: [10, 90], // 1000, 9000
				value: BigNumber.from(10000),
			},
			{
				percentiles: [0, 100], // 0, 20000
				value: BigNumber.from(20000),
			},
			{
				percentiles: [40, 60], // 12000, 18000
				value: BigNumber.from(30000),
			},
		]
		const voteInfo = calculateVote(['option0', 'option1'], data as any)
		expect(voteInfo.length).to.be.equal(2)

		expect(voteInfo[0].id).to.be.equal('option0')
		expect(voteInfo[0].counts[0]).to.be.equal('0')
		expect(voteInfo[0].counts[1]).to.be.equal('13000')
		expect(voteInfo[0].count).to.be.equal('13000')

		expect(voteInfo[1].id).to.be.equal('option1')
		expect(voteInfo[1].counts[0]).to.be.equal('47000')
		expect(voteInfo[1].counts[1]).to.be.equal('0')
		expect(voteInfo[1].count).to.be.equal('94000')
	})
	it('Calculate the voting results(ver2).', async () => {
		const data = [
			{
				percentiles: [10, 60, 30], // 1000, 6000, 3000
				value: BigNumber.from(10000),
			},
			{
				percentiles: [0, 90, 10], // 0, 18000, 2000
				value: BigNumber.from(20000),
			},
			{
				percentiles: [70, 20, 10], // 21000, 6000, 3000
				value: BigNumber.from(30000),
			},
		]
		const voteInfo = calculateVote(
			['option0', 'option1', 'option2'],
			data as any
		)
		expect(voteInfo.length).to.be.equal(3)

		expect(voteInfo[0].id).to.be.equal('option0')
		expect(voteInfo[0].counts[0]).to.be.equal('21000')
		expect(voteInfo[0].counts[1]).to.be.equal('0')
		expect(voteInfo[0].counts[2]).to.be.equal('1000')
		expect(voteInfo[0].count).to.be.equal('64000')

		expect(voteInfo[1].id).to.be.equal('option1')
		expect(voteInfo[1].counts[0]).to.be.equal('24000')
		expect(voteInfo[1].counts[1]).to.be.equal('6000')
		expect(voteInfo[1].counts[2]).to.be.equal('0')
		expect(voteInfo[1].count).to.be.equal('84000')

		expect(voteInfo[2].id).to.be.equal('option2')
		expect(voteInfo[2].counts[0]).to.be.equal('0')
		expect(voteInfo[2].counts[1]).to.be.equal('5000')
		expect(voteInfo[2].counts[2]).to.be.equal('3000')
		expect(voteInfo[2].count).to.be.equal('13000')
	})
})
