export default {
	setAddressData (state, data) {
		state.addressData = data
		this.$cookies.set('address_data', data, {
			'domain': process.env.NODE_ENV === 'production' ? '.morepoke.ru' : ''
		})
	},
	setCity(state, city) {
		state.city = city
		this.$cookies.set('city', city)
		console.log(city)
	},
	setSelectedCity(state) {
		state.selectedCity = true
		this.$cookies.set('selectedCity', true, {
			'domain': process.env.NODE_ENV === 'production' ? 'morepoke.ru' : ''
		})
	},
	setToken(state, token) {
		state.token = token
		this.$cookies.set('token', token)
	},
	setUserData(state, user) {
		state.user = user
		this.$cookies.set('user', user)
	},
	setCartStep(state, step) {
		state.cartStep = step
	},
	removeUserData(state) {
		state.user = ''
		state.token = ''
		this.$cookies.remove('user')
		this.$cookies.remove('token')
	},
	setOrder(state, order) {
		Object.assign(state.order, order)
	},
	setProduct(state, product) {
		Object.assign(state.product, product)
	},
	openConstructModal(state) {
		state.openConstructModal = true
	},
	closeConstructModal(state) {
		state.openConstructModal = false
	},
	setOrganization(state, org) {
		state.organization = org
	}
}
