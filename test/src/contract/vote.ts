/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { BigNumber } from 'ethers'
import { getVoteContract } from '../../../src/contract/vote'
import { deployVoteRelationContract } from './../../helper'


const VOTING_BLOCK = 100
const options0 = 'http://hogehoge/0'
const options1 = 'http://hogehoge/1'

describe('getVoteContract', () => {
	it.only('Get the AddressConfig instance of the mock environment.', async () => {
		const [vote, voteEmitter, provider, blockNumber] = await deployVoteRelationContract([options0, options1], VOTING_BLOCK)
		const instance = await getVoteContract(vote.address, provider)
		expect(instance.address).to.be.equal(vote.address)
		expect(await instance.voteEmitter()).to.be.equal(voteEmitter.address)
		const attr = await instance.attributes()
		expect(attr.subject).to.be.equal('dummy-subject')
		expect(attr.body).to.be.equal('dummy-body')
		expect((attr.period as BigNumber).toNumber()).to.be.equal(blockNumber + VOTING_BLOCK)
		expect(attr.options[0]).to.be.equal(options0)
		expect(attr.options[1]).to.be.equal(options1)
		expect(attr.bodyMimeType).to.be.equal('dummy-body-mime-type')
		expect(attr.optionsMimeType).to.be.equal('dummy-option-mime-type')
	})
})
