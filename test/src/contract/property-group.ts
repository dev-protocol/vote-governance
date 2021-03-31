/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { describe } from 'mocha'
import { ethers } from 'ethers'
import { getPropertyGroupContract } from '../../../src/contract/property-group'
import { getAddressConfigContract } from '../../../src/contract/address-config'

describe('getPropertyGroupContract', () => {
	it('Get the PropetyGroup instance of the production environment.', async () => {
		const provider = ethers.getDefaultProvider('homestead')
		const propertyGroupInstance = await getPropertyGroupContract(provider)
		const addressConfig = await getAddressConfigContract(provider)
		const propertyGroupAddress: string = await addressConfig.propertyGroup()
		expect(propertyGroupInstance.address).to.be.equal(propertyGroupAddress)
	})
	it('Get the PropetyGroup instance of the ropsten environment.', async () => {
		const provider = ethers.getDefaultProvider('ropsten')
		const propertyGroupInstance = await getPropertyGroupContract(provider)
		const addressConfig = await getAddressConfigContract(provider)
		const propertyGroupAddress: string = await addressConfig.propertyGroup()
		expect(propertyGroupInstance.address).to.be.equal(propertyGroupAddress)
	})
})
