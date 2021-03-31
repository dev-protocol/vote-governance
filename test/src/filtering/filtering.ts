/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { BigNumber } from 'ethers'
import { filteringValidData } from '../../../src/filtering'
import { VoteData } from '../../../src/types'

describe('filteringValidData', () => {
	it('Data that is not valid will be rejected.', async () => {
		const data = {
			isValid: false,
			voter: 'dummy',
			percentiles: [10, 90],
			value: BigNumber.from(100)
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('Data with zero votes will be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [10, 90],
			value: BigNumber.from(0)
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('If the sum of the percentages is not 100, it will be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [10, 80],
			value: BigNumber.from(100)
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('If the percentages have the same number, they will be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [50, 50],
			value: BigNumber.from(100)
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('If the number of options and percentages are set incorrectly, it will be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [50, 30, 20],
			value: BigNumber.from(100)
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('If there are no deficiencies, you will not be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [10, 90],
			value: BigNumber.from(100)
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(1)
		expect(filteredData[0].isValid).to.be.equal(true)
		expect(filteredData[0].voter).to.be.equal('dummy')
		expect(filteredData[0].percentiles[0]).to.be.equal(10)
		expect(filteredData[0].percentiles[1]).to.be.equal(90)
		expect(filteredData[0].value.toString()).to.be.equal('100')
	})
	it('Only complete data will be returned.', async () => {
		const data = [{
			isValid: true,
			voter: 'dummy',
			percentiles: [10, 90],
			value: BigNumber.from(100)
		} as VoteData,
		{
			isValid: true,
			voter: 'dummy',
			percentiles: [50, 30, 20],
			value: BigNumber.from(100)
		} as VoteData,
		{
			isValid: true,
			voter: 'dummy',
			percentiles: [50, 50],
			value: BigNumber.from(100)
		} as VoteData,
		{
			isValid: true,
			voter: 'dummy',
			percentiles: [10, 80],
			value: BigNumber.from(100)
		} as VoteData,
		{
			isValid: true,
			voter: 'dummy',
			percentiles: [10, 90],
			value: BigNumber.from(0)
		} as VoteData,
		{
			isValid: false,
			voter: 'dummy',
			percentiles: [10, 90],
			value: BigNumber.from(100)
		} as VoteData
	]
		const filteredData = filteringValidData(2, data)
		expect(filteredData.length).to.be.equal(1)
		expect(filteredData[0].isValid).to.be.equal(true)
		expect(filteredData[0].voter).to.be.equal('dummy')
		expect(filteredData[0].percentiles[0]).to.be.equal(10)
		expect(filteredData[0].percentiles[1]).to.be.equal(90)
		expect(filteredData[0].value.toString()).to.be.equal('100')
	})
})


