/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { expect } from 'chai'
import { ethers } from 'ethers'
import { getAddressConfigAddress } from '../../../src/contract/address'

describe('getAddressConfigAddress', () => {
	it('Get the AddressConfig address of the production environment.', async () => {
		const provider = ethers.getDefaultProvider('homestead', {
			alchemy: 'apikey',
		})
		const address = await getAddressConfigAddress(provider)
		expect(address).to.be.equal('0x1D415aa39D647834786EB9B5a333A50e9935b796')
	})
	it('Get the AddressConfig address of the ropsten environment.', async () => {
		const provider = ethers.getDefaultProvider('ropsten', {
			alchemy: 'apikey',
		})
		const address = await getAddressConfigAddress(provider)
		expect(address).to.be.equal('0xD6D07f1c048bDF2B3d5d9B6c25eD1FC5348D0A70')
	})
})
