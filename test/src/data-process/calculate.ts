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
