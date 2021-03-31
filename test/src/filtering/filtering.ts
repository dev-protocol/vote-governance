/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { BigNumber, Contract } from 'ethers'
import { deployContract, MockProvider } from 'ethereum-waffle'
import {
	filteringValidData,
	filteringPropertyAddressTransfer,
	TRANSFER_EVENT_INDEX_FROM,
	TRANSFER_EVENT_INDEX_TO,
} from '../../../src/filtering'
import { VoteData } from '../../../src/types'
import PropertyGroup from '../../../build/PropertyGroup.json'

describe('filteringValidData', () => {
	it('Data that is not valid will be rejected.', async () => {
		const data = {
			isValid: false,
			voter: 'dummy',
			percentiles: [10, 90],
			value: BigNumber.from(100),
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('Data with zero votes will be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [10, 90],
			value: BigNumber.from(0),
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('If the sum of the percentages is not 100, it will be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [10, 80],
			value: BigNumber.from(100),
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('If the percentages have the same number, they will be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [50, 50],
			value: BigNumber.from(100),
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('If the number of options and percentages are set incorrectly, it will be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [50, 30, 20],
			value: BigNumber.from(100),
		} as VoteData
		const filteredData = filteringValidData(2, [data])
		expect(filteredData.length).to.be.equal(0)
	})
	it('If there are no deficiencies, you will not be rejected.', async () => {
		const data = {
			isValid: true,
			voter: 'dummy',
			percentiles: [10, 90],
			value: BigNumber.from(100),
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
		const data = [
			{
				isValid: true,
				voter: 'dummy',
				percentiles: [10, 90],
				value: BigNumber.from(100),
			} as VoteData,
			{
				isValid: true,
				voter: 'dummy',
				percentiles: [50, 30, 20],
				value: BigNumber.from(100),
			} as VoteData,
			{
				isValid: true,
				voter: 'dummy',
				percentiles: [50, 50],
				value: BigNumber.from(100),
			} as VoteData,
			{
				isValid: true,
				voter: 'dummy',
				percentiles: [10, 80],
				value: BigNumber.from(100),
			} as VoteData,
			{
				isValid: true,
				voter: 'dummy',
				percentiles: [10, 90],
				value: BigNumber.from(0),
			} as VoteData,
			{
				isValid: false,
				voter: 'dummy',
				percentiles: [10, 90],
				value: BigNumber.from(100),
			} as VoteData,
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

describe('filteringPropertyAddressTransfer', () => {
	const init = async (): Promise<readonly [Contract, MockProvider]> => {
		const provider = new MockProvider()
		const wallets = provider.getWallets()
		const propertyGroupInstance = await deployContract(
			wallets[0],
			PropertyGroup
		)
		return [propertyGroupInstance, provider]
	}

	it('イベントデータが存在しない場合はデータがリジェクトされる', async () => {
		const [propertyGroup] = await init()
		const data = {
			args: undefined,
		}
		const filteredData = await filteringPropertyAddressTransfer(
			[data as any],
			TRANSFER_EVENT_INDEX_FROM,
			propertyGroup
		)
		expect(filteredData.length).to.be.equal(0)
	})
	it('Propertyアドレスではない場合、リジェクトされる', async () => {
		const [propertyGroup, provider] = await init()
		const data = {
			args: { 0: provider.createEmptyWallet().address },
		}
		const filteredData = await filteringPropertyAddressTransfer(
			[data as any],
			TRANSFER_EVENT_INDEX_FROM,
			propertyGroup
		)
		expect(filteredData.length).to.be.equal(0)
	})
	it('Propertyアドレスの場合、リジェクトされない(from)', async () => {
		const [propertyGroup, provider] = await init()
		const propertyAddress = provider.createEmptyWallet().address
		const data = {
			args: { 0: propertyAddress },
		}
		await propertyGroup.addGroup(propertyAddress)
		const filteredData = await filteringPropertyAddressTransfer(
			[data as any],
			TRANSFER_EVENT_INDEX_FROM,
			propertyGroup
		)
		expect(filteredData.length).to.be.equal(1)
	})
	it('Propertyアドレスの場合、リジェクトされない(to)', async () => {
		const [propertyGroup, provider] = await init()
		const propertyAddress = provider.createEmptyWallet().address
		const data = {
			args: { 1: propertyAddress },
		}
		await propertyGroup.addGroup(propertyAddress)
		const filteredData = await filteringPropertyAddressTransfer(
			[data as any],
			TRANSFER_EVENT_INDEX_TO,
			propertyGroup
		)
		expect(filteredData.length).to.be.equal(1)
	})
	it('該当するデータのみ返却される', async () => {
		const [propertyGroup, provider] = await init()
		const propertyAddress = provider.createEmptyWallet().address
		const data1 = {
			args: { 1: propertyAddress },
		}
		const data2 = {
			args: { 0: provider.createEmptyWallet() },
		}
		const data3 = {
			args: undefined,
		}
		await propertyGroup.addGroup(propertyAddress)
		const filteredData = await filteringPropertyAddressTransfer(
			[data1 as any, data2 as any, data3 as any],
			TRANSFER_EVENT_INDEX_TO,
			propertyGroup
		)
		expect(filteredData.length).to.be.equal(1)
		expect(filteredData[0].args!['1']).to.be.equal(propertyAddress)
	})
})
