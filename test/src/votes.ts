/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/prefer-readonly-type */

import { expect } from 'chai'
import sinon from 'sinon'
import { Contract, Event } from 'ethers'
import { MockProvider } from 'ethereum-waffle'
import * as address_modules from '../../src/contract/address'
import * as address_config_modules from '../../src/contract/address-config'
import * as dev_modules from '../../src/contract/dev'
import * as property_group_modules from '../../src/contract/property-group'
import * as vote_modules from '../../src/contract/vote'
import * as vote_emitter_modules from '../../src/contract/vote-emitter'
import * as format_modules from '../../src/format/data-format'
import * as filtering_modules from '../../src/filtering/filtering'
import * as calculate_modules from '../../src/data-process/calculate'
import { getVotes } from '../../src/votes'
import { BaseProvider } from '@ethersproject/providers'
import { VoteAttributes, VoteData, VoteInfo } from '../../src/types'

describe('getVotes', () => {
	const provier = new MockProvider()
	const addressConfigAddressStr = '0x...address-config-address'
	const devAddress = '0x...dev'
	const propertyGroupAddress = '0x...property-group'
	const voteAddress = '0x...vote'
	const tokenFunc = async (): Promise<string> => {
		return devAddress
	}
	const propertyGroupFunc = async (): Promise<string> => {
		return propertyGroupAddress
	}
	const addressConfigInstance = {
		token: tokenFunc,
		propertyGroup: propertyGroupFunc,
	}
	const devInstance = {
		name: 'Dev',
	}
	const propertyGroupInstance = {
		name: 'propertyGroup',
	}
	const voteInstance = {
		name: 'vote',
	}
	const events = [
		{
			args: {
				from: '0x....from',
				to: '0x....to',
				value: 10,
			},
		},
	]
	const voteAttr = {
		period: 100000000,
		options: ['option0', 'option1'],
	}
	const voteData = [
		{
			isValid: true,
		},
	]
	const voteInfo = [
		{
			id: 'hoge',
		},
	]

	let addressConfigAddress:
		| sinon.SinonStub<any[], any>
		| sinon.SinonStub<unknown[], unknown>
	let getAddressConfigContract: sinon.SinonStub<
		[provider: BaseProvider, address: string],
		Contract
	>
	let getDevContract: sinon.SinonStub<
		[provider: BaseProvider, devAddress: string],
		Contract
	>
	let getPropertyGroupContract: sinon.SinonStub<
		[provider: BaseProvider, propertyGroupAddress: string],
		Promise<Contract>
	>
	let getVoteContract: sinon.SinonStub<
		[address: string, provider: BaseProvider],
		Contract
	>
	let getVoteEvent: sinon.SinonStub<
		[voteInstance: Contract, provider: BaseProvider],
		Promise<readonly Event[]>
	>
	let getVoteAttributes: sinon.SinonStub<
		[voteInstance: Contract],
		Promise<VoteAttributes>
	>
	let formatVoteEventData: sinon.SinonStub<
		[
			events: readonly Event[],
			devInstance: Contract,
			propertyGroupInstance: Contract,
			toBlock: number
		],
		Promise<readonly VoteData[]>
	>
	let filteringValidData: sinon.SinonStub<
		[optionsLength: number, voteData: readonly VoteData[]],
		readonly VoteData[]
	>
	let calculateVote: sinon.SinonStub<
		[options: readonly string[], voteData: readonly VoteData[]],
		readonly VoteInfo[]
	>

	before(() => {
		addressConfigAddress = sinon.stub(
			address_modules,
			'getAddressConfigAddress'
		)
		getAddressConfigContract = sinon.stub(
			address_config_modules,
			'getAddressConfigContract'
		)
		getDevContract = sinon.stub(dev_modules, 'getDevContract')
		getPropertyGroupContract = sinon.stub(
			property_group_modules,
			'getPropertyGroupContract'
		)
		getVoteContract = sinon.stub(vote_modules, 'getVoteContract')
		getVoteEvent = sinon.stub(vote_emitter_modules, 'getVoteEvent')
		getVoteAttributes = sinon.stub(vote_modules, 'getVoteAttributes')
		formatVoteEventData = sinon.stub(format_modules, 'formatVoteEventData')
		filteringValidData = sinon.stub(filtering_modules, 'filteringValidData')
		calculateVote = sinon.stub(calculate_modules, 'calculateVote')

		addressConfigAddress.withArgs(provier).resolves(addressConfigAddressStr)
		getAddressConfigContract
			.withArgs(provier as any, addressConfigAddressStr)
			.returns(addressConfigInstance as any)
		getDevContract
			.withArgs(provier as any, devAddress)
			.returns(devInstance as any)
		getPropertyGroupContract
			.withArgs(provier as any, propertyGroupAddress)
			.resolves(propertyGroupInstance as any)
		getVoteContract
			.withArgs(voteAddress, provier as any)
			.returns(voteInstance as any)
		getVoteEvent
			.withArgs(voteInstance as any, provier as any)
			.resolves(events as any)
		getVoteAttributes.withArgs(voteInstance as any).resolves(voteAttr as any)
		formatVoteEventData
			.withArgs(
				events as any,
				devInstance as any,
				propertyGroupInstance as any,
				voteAttr.period
			)
			.resolves(voteData as any)
		filteringValidData
			.withArgs(voteAttr.options.length, voteData as any)
			.returns(voteData as any)
		calculateVote
			.withArgs(voteAttr.options, voteData as any)
			.returns(voteInfo as any)
	})
	it('get vote info.', async () => {
		const result = await getVotes(voteAddress, provier as any)
		expect(result[0].id).to.be.equal('hoge')
		expect(result.length).to.be.equal(1)
	})
	after(() => {
		addressConfigAddress.restore()
		getAddressConfigContract.restore()
		getDevContract.restore()
		getPropertyGroupContract.restore()
		getVoteContract.restore()
		getVoteEvent.restore()
		getVoteAttributes.restore()
		formatVoteEventData.restore()
		filteringValidData.restore()
		calculateVote.restore()
	})
})
