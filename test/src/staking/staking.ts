/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/prefer-readonly-type */

import { expect } from 'chai'
import sinon from 'sinon'
import { Contract, Event } from 'ethers'
import * as dev_contract_modules from '../../../src/contract/dev'
import * as filtering_modules from '../../../src/filtering/filtering'
import { getAllStakingValue } from '../../../src/staking'
import {
	TransferEventIndex,
	TRANSFER_EVENT_INDEX_FROM,
	TRANSFER_EVENT_INDEX_TO,
} from '../../../src/filtering/filtering'

describe('getAllStakingValue', () => {
	let getDevTransferEvent: sinon.SinonStub<
		[
			devInstance: Contract,
			fromAddress: string | null,
			toAddress: string | null,
			toBlock: number
		],
		Promise<readonly Event[]>
	>
	let filteringPropertyAddressTransfer: sinon.SinonStub<
		[
			events: readonly Event[],
			index: TransferEventIndex,
			propertyGroupInstance: Contract
		],
		Promise<readonly Event[]>
	>
	const fromUserEvents = [
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
	] as any
	const toUserEvents = [
		{
			args: {
				value: 10,
			},
		},
		{
			args: {
				value: 5,
			},
		},
	] as any
	const user = '0x...user'
	const toBlock = 100
	before(() => {
		getDevTransferEvent = sinon.stub(
			dev_contract_modules,
			'getDevTransferEvent'
		)

		filteringPropertyAddressTransfer = sinon.stub(
			filtering_modules,
			'filteringPropertyAddressTransfer'
		)
		getDevTransferEvent
			.withArgs({} as any, user, null, toBlock)
			.resolves(fromUserEvents)
		getDevTransferEvent
			.withArgs({} as any, null, user, toBlock)
			.resolves(toUserEvents)
		filteringPropertyAddressTransfer
			.withArgs(fromUserEvents, TRANSFER_EVENT_INDEX_TO, {} as any)
			.resolves(fromUserEvents)
		filteringPropertyAddressTransfer
			.withArgs(toUserEvents, TRANSFER_EVENT_INDEX_FROM, {} as any)
			.resolves(toUserEvents)
	})
	it('get staking value.', async () => {
		const result = await getAllStakingValue({} as any, {} as any, user, toBlock)
		expect(result.toString()).to.be.equal('15')
	})
	after(() => {
		getDevTransferEvent.restore()
		filteringPropertyAddressTransfer.restore()
	})
})
