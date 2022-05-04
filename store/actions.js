export default {
	async nuxtServerInit ({ commit }, { req } ) {
		try {
			let organizations = {}
			if (req.headers.host.includes('localhost')) {
				organizations = require('@/components/helpers/organizations.json')
			} else {
				const {data} = await this.$axios.post(`${process.env.API_HOST}/api/site/organization/by_url`, {
					base_url: `//${req.headers.host}`
				})
				organizations = data
			}

			commit('setOrganization', organizations.data)
			commit('setCity', organizations.data.town)
		} catch (e) {
			console.error(e)
		}
	},
	setCity({commit},  city) {
		commit('setCity', city)
	},
	setUserData({commit},  user) {
		commit('setUserData', user)
	},
	setToken({commit},  token) {
		commit('setToken', token)
	},
	setOrder({commit}, order) {
		commit('setOrder', order)
	},
	getCity({commit}) {
		if(this.$cookies.get('city') && this.$cookies.get('city').hasOwnProperty('organization')) {
			commit('setCity', this.$cookies.get('city'))
		}
	},
	getSelectedCity({commit}) {
		if(this.$cookies.get('selectedCity')) commit('setSelectedCity', this.$cookies.get('selectedCity'))
	},
	getAddressData({commit}) {

		if(this.$cookies.get('address_data')) {
			commit('setAddressData', this.$cookies.get('address_data'))
		}

		if(this.$cookies.get('address_data') && this.$cookies.get('address_data').hasOwnProperty('city') &&
			!this.$cookies.get('address_data').hasOwnProperty('address')) {
			this.$cookies.remove('address_data');
		}
	},
	getToken({commit}) {
		if(this.$cookies.get('token')) commit('setToken', this.$cookies.get('token'))
	},
	getUserData({commit}) {
		if(this.$cookies.get('user')) commit('setUserData', this.$cookies.get('user'))
	},
	removeUserData({commit}) {
		commit('removeUserData')
	},
	removeAddressData({commit}) {
		if(this.$cookies.get('reset_flag') === undefined) {
			this.$cookies.set('address_data', null, {
				'domain': ''
			})
			this.$cookies.set('user', null, {
				'domain': ''
			})
			this.$cookies.set('token', null, {
				'domain': ''
			})
			this.$cookies.set('city', null, {
				'domain': ''
			})
			this.$cookies.set('reset_flag', 1, {
				'domain': ''
			})
			commit('setAddressData', this.$cookies.get('address_data'))
		}
	}
}
