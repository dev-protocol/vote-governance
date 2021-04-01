/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { BigNumber } from 'ethers'
import {
	getAnalyzedDataByOptionIndex,
	getCount,
	getCounts,
	analysisVoteData,
} from '../../../src/data-process/calculate-details'

describe('getAnalyzedDataByOptionIndex', () => {
	it('Only data with the same index as the specified index will be returned.', async () => {
		const data = [
			{
				index: 0,
			},
			{
				index: 1,
			},
			{
				index: 2,
			},
			{
				index: 3,
			},
			{
				index: 2,
			},
			{
				index: 1,
			},
			{
				index: 3,
			},
			{
				index: 2,
			},
		]
		let voteData = getAnalyzedDataByOptionIndex(data as any, 0)
		expect(voteData.length).to.be.equal(1)
		voteData = getAnalyzedDataByOptionIndex(data as any, 1)
		expect(voteData.length).to.be.equal(2)
		voteData = getAnalyzedDataByOptionIndex(data as any, 2)
		expect(voteData.length).to.be.equal(3)
		voteData = getAnalyzedDataByOptionIndex(data as any, 3)
		expect(voteData.length).to.be.equal(2)
		voteData = getAnalyzedDataByOptionIndex(data as any, 10)
		expect(voteData.length).to.be.equal(0)
	})
})

describe('getCount', () => {
	it('Calculated with the specified multiplier(ver1).', async () => {
		const counts = [BigNumber.from(300), BigNumber.from(200)]
		const voteData = getCount(counts, 2)
		expect(voteData).to.be.equal('800')
	})
	it('Calculated with the specified multiplier(ver2).', async () => {
		const counts = [
			BigNumber.from(200),
			BigNumber.from(100),
			BigNumber.from(300),
		]
		const voteData = getCount(counts, 3)
		expect(voteData).to.be.equal('1100')
	})
})

describe('getCounts', () => {
	const data = [
		{
			rank: 0,
			voteCount: BigNumber.from(100),
		},
		{
			rank: 1,
			voteCount: BigNumber.from(200),
		},
		{
			rank: 2,
			voteCount: BigNumber.from(50),
		},
		{
			rank: 3,
			voteCount: BigNumber.from(1500),
		},
		{
			rank: 2,
			voteCount: BigNumber.from(300),
		},
		{
			rank: 1,
			voteCount: BigNumber.from(10),
		},
		{
			rank: 3,
			voteCount: BigNumber.from(270),
		},
		{
			rank: 2,
			voteCount: BigNumber.from(5),
		},
	]
	it('Grouping and summing.', async () => {
		const result = getCounts(data as any, 4)
		expect(result.length).to.be.equal(4)
		expect(result[0].toString()).to.be.equal('100')
		expect(result[1].toString()).to.be.equal('210')
		expect(result[2].toString()).to.be.equal('355')
		expect(result[3].toString()).to.be.equal('1770')
	})
})

describe('analysisVoteData', () => {
	it('Calculate voting data(ver1).', async () => {
		const data = {
			percentiles: [10, 70, 20],
			value: BigNumber.from(1200),
		}
		const func = analysisVoteData(3)
		const analyzedData = func(data as any)
		expect(analyzedData.length).to.be.equal(3)

		expect(analyzedData[0].index).to.be.equal(0)
		expect(analyzedData[0].rank).to.be.equal(2)
		expect(analyzedData[0].voteCount.toString()).to.be.equal('120')

		expect(analyzedData[1].index).to.be.equal(1)
		expect(analyzedData[1].rank).to.be.equal(0)
		expect(analyzedData[1].voteCount.toString()).to.be.equal('840')

		expect(analyzedData[2].index).to.be.equal(2)
		expect(analyzedData[2].rank).to.be.equal(1)
		expect(analyzedData[2].voteCount.toString()).to.be.equal('240')
	})
	it('Calculate voting data(ver2).', async () => {
		const data = {
			percentiles: [60, 40],
			value: BigNumber.from(3000),
		}
		const func = analysisVoteData(2)
		const analyzedData = func(data as any)
		expect(analyzedData.length).to.be.equal(2)

		expect(analyzedData[0].index).to.be.equal(0)
		expect(analyzedData[0].rank).to.be.equal(0)
		expect(analyzedData[0].voteCount.toString()).to.be.equal('1800')

		expect(analyzedData[1].index).to.be.equal(1)
		expect(analyzedData[1].rank).to.be.equal(1)
		expect(analyzedData[1].voteCount.toString()).to.be.equal('1200')
	})
})
