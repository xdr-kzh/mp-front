<template>
  <div>
		<Header
			:modals="modals"
			:cities="cities"
			:cart="cart"
			@openModalAddress="isShowModalAddress = true"
		/>

    <Nuxt
			@updateCart="updateCart"
			@showModalSignIn="showModalSignIn"
			@cleanCart="cleanCart"
      :cart="cart"
			:cities="cities"
		/>

		<Footer
			:is-loading="loading"
		/>

		<modal-address
			v-if="isShowModalAddress"
			v-model="isShowModalAddress"
			:address-data="addressData"
			@submit="selectAddress"
		/>

		<auth-modal
			:show="modals.login.show"
			:step="modals.login.step"
			@closeModals="closeModals"
			:cities="cities"
			@showSelfPickup="isShowSelfPickup = true"
		/>

		<self-pickup
			v-if="isShowSelfPickup"
			@close="isShowSelfPickup = false"
		/>

  </div>
</template>

<script>
  import Modal from "../components/Modal";
	import AuthModal from "../components/AuthModal";
	import Header from "~/components/General/Header";
	import Footer from "~/components/General/Footer";
	import ModalAddress from "../components/ModalAddress";
	import SelfPickup from "../components/SelfPickup";

  export default {
    components: {
			SelfPickup,
			ModalAddress,
    	Footer,
			Header,
			AuthModal,
			Modal
		},
    data: () => ({
			loading: true,
      cities: [],
			cart: {
				products: []
			},
			addressData: {
				coords: null,
				city: '',
				street: '',
				house_num: ''
			},
			isShowModalAddress: false,
			changeCity: false,
      modals: {
				login: {
					show: false,
					step: ''
				}
      },
			isShowSelfPickup: false
    }),
		computed: {
			isLoggedIn () {
				return !!this.$store.getters.getUserData
			}
		},
    methods: {
    	async initUser() {
				try {
					const {data} = await this.$axios.get('/api/site/user/init')
					if (data?.id) {
						this.$fire.analytics.setUserId(data.id)
					}
					this.$store.commit('setUserData', data)
				} catch (e) {
          if (e.response.status !== 200) {
						await this.$store.dispatch('removeUserData')
					}
				}
			},
      async getCities() {
        try {
          const {data} = await this.$axios.get(`/api/site/town`)
          this.cities = data.towns
        } catch (e) {
					console.error(e)
        } finally {
					this.loading = false
				}
      },
			async getCart() {
				if (!this.$store.getters.getCity.default_id_org) return
				try {
					const options = {
						order_type: 1,
						id_org: this.$store.getters.getCity.default_id_org
					}
					const {data} = await this.$axios.post(`/api/site/cart/getCart`, options)
					this.cart = data
				} catch (e) {
					console.error(e)
				} finally {
					this.loading = false
				}
			},
			cleanCart() {
				this.cart.total_count = 0
				this.cart.products = []
			},
			closeModals() {
				this.modals.login.show = false
			},
			showModalSignIn(step) {
				this.modals.login.show = true
				this.modals.login.step = step
			},
			updateCart(cart) {
				this.cart = cart
			},
			async getUserAddress () {
				try {
					const data = await this.$axios.$get(`/api/user/getUserAddress`, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})

					if (Array.isArray(data) && data.length > 0) {
						this.$store.commit('setAddressData', data[data.length - 1])
						return
					}

					this.isShowModalAddress = true
				} catch (e) {
					if (e?.response?.status === 401) {
						this.isShowModalAddress = true
					}
					console.error(e)
				}
			},
			async selectAddress (address) {
				try {
					if (!this.addressData.city || !this.addressData.street || !this.addressData.house_num) {
						this.$toast.error('Введите адрес')
						return
					}
					const addressData = {...this.addressData}
					const foundCity = this.cities.find(city => city.title.toLowerCase() === addressData.city.toLowerCase())
					if (foundCity?.id) {
						addressData.cityId = foundCity.id
						addressData.city_id = foundCity.id
						if (process.env.NODE_ENV === 'production') {
							location.href = foundCity.organization.base_url
						}
						delete foundCity.privacy_policy
						delete foundCity.organization.privacy_policy
						delete foundCity.organization.rights_delivery
						this.$store.commit('setCity', foundCity)
						localStorage.removeItem('self_pickup')

						Object.assign(addressData, {address: address})

						if (this.isLoggedIn) {
							try {
								const {data} = await this.$axios.$post(`/api/site/user/address`, addressData)
								addressData.id = data.id
							} catch (e) {
								if (e?.response?.status === 404) {
									this.isShowSelfPickup = true
								}
							}
						}
					} else {
						addressData.cityId = 0
						this.isShowSelfPickup = true
					}

					this.$store.commit('setAddressData', addressData)

					this.isShowModalAddress = true
				} catch (e) {
					if (e?.response?.status === 404) {
						this.isShowSelfPickup = true
					}
					console.error(e)
				}
			}
    },
		async created() {
			await this.getCities()
			await this.getCart()

			this.$store.dispatch('removeAddressData')

			if (!this.$store.getters.getAddressData) {
				await this.getUserAddress()
			}

			this.$nuxt.$on('updateCart', this.updateCart)
			this.$nuxt.$on('showModalSignIn', this.showModalSignIn)
			this.$nuxt.$on('closeModals', this.closeModals)
			this.$nuxt.$on('cleanCart', this.cleanCart)
		},
		async mounted() {
			await this.initUser()
			await this.$store.dispatch('getToken')
			await this.$store.dispatch('getCity')
			await this.$store.dispatch('getAddressData')
		}
  }
</script>
