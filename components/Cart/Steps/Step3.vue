<template>
	<div class="cart">
		<div class="container">
			<div class="row">
				<div class="col-12 col-xl-8 offset-xl-2">
					<div class="h1 mb-1 mt-4 mb-5">Оформление заказа</div>

					<div class="cart-payment_delivery" v-if="!loading">
						<div class="cart-payment_delivery-block">
							<div class="cart-payment_delivery-tabs">
								<div v-if="hasDelivery"  v-for="delivery in organization.deliveries" :class="`tab ${order.delivery_id === delivery.id ? 'active' : ''} ${organization.deliveries.length === 1 || !hasDelivery ? 'w-100' : ''}`" @click="changeTab">
									{{ delivery.name }}
								</div>
							</div>
							<div class="tabs">
								<div v-if="hasDelivery" :class="`tab ${order.delivery_id === 2 ? 'active' : ''}`">
									<div class="cart-payment_delivery-address" v-if="!addressData.address">
										<div class="cart-payment_delivery-title">Адрес доставки</div>
										<button type="button" @click.prevent="nextStep('editAddress')">
											<img src="~assets/img/plus3.svg" alt="">
											<span>Добавить адрес доставки</span>
										</button>
										<span class="error" v-if="errors.address">{{ errors.address }}</span>
									</div>
									<div class="cart-payment_delivery-address" v-else>
										<div class="cart-payment_delivery-title">Адрес доставки</div>
										<button type="button" @click.prevent="nextStep('editAddress')">
											<span>{{ addressData.address }}</span>
										</button>
									</div>
									<div class="cart-payment_delivery-payments">
										<div class="cart-payment_delivery-title">Способ оплаты</div>
										<div class="items">
											<div class="item" v-for="(item, idx) in payments" :key="item.id">
												<input type="radio"
															 v-model="order.payment_id"
															 :value="item.id"
															 :id="`payment${item.id}`"
															 @click="savePaymentId(item.id, item.name)"
												>
												<label :for="`payment${item.id}`">{{ item.name }}</label>
											</div>
										</div>
									</div>
								</div>
								<div :class="`tab ${order.delivery_id === 1 ? 'active' : ''}`">
									<div class="cart-payment_delivery-organizations">
										<div class="cart-payment_delivery-title">Выберите ресторан</div>
										<div class="item" v-for="(item, idx) in organizations" :key="item.id">
											<input type="radio" :value="item.id" v-model="order.id_org" :id="`org${item.id}`">
											<label :for="`org${item.id}`">
												<strong>{{ item.title }}</strong>
												<span>Ежедневно {{ item.worktime }}</span>
											</label>
											<span class="error" v-if="errors.organization">{{ errors.organization }}</span>
										</div>
									</div>
									<div class="cart-payment_delivery-payments">
										<div class="cart-payment_delivery-title">Способ оплаты</div>
										<div class="items">
											<div class="item" v-for="(item, idx) in payments" :key="item.id">
												<input type="radio" v-model="order.payment_id" :value="item.id" :id="`payment${item.id}`">
												<label :for="`payment${item.id}`">{{ item.name }}</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="cart-payment_delivery-total">
							<table>
								<tr>
									<td>{{ cart.total_count }} товар(ов)</td>
									<td>{{ cart.total_cost }} ₽</td>
								</tr>
								<tr>
									<td>Стоимость доставки</td>
									<td>{{ cart.delivery_cost ? cart.delivery_cost + ' ₽' : 'Бесплатно' }}</td>
								</tr>
								<tr v-if="order.bonus_points">
									<td>Бонусы</td>
									<td>{{ order.bonus_points + ' ₽'}}</td>
								</tr>
							</table>
							<hr>
							<table>
								<tr>
									<th>Стоимость заказа</th>
									<th>{{ totalCost }} ₽</th>
									<!--<th>{{ cart.total_cost + cart.delivery_cost - order.bonus_points }} ₽</th>-->
								</tr>
							</table>
						</div>
						<div class="cart-payment_delivery-submit">
							<button type="button" @click.prevent="createOrder" class="btn btn-colored btn-medium"
											v-if="loading"
							>
								<span style="margin-left:0">Подождите...</span>
							</button>
							<button type="button" @click.prevent="createOrder" :disabled="loading" class="btn btn-colored btn-medium"
											v-else
							>
								<span>Продолжить</span><i class="icon-right-open-big pl-3"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Step3",
		props: [ 'address' ],
		data: () => ({
			loading: true,
      delivery_cost: 0,
      prepare_order: {},
			order: {
				payment_id: 1,
				id_org: '',
				delivery_id: 2,
				address_id: '',
				address: ''
			},
			errors: {
				id_org: '',
				address: ''
			},
			user_address: {
				street: ''
			},
			payments: [],
			cart: [],
			created_order: {},
			addresses: [],
			organizations: [],
			organization: {
				deliveries: []
			}
		}),
		computed: {
			selected_address () {
				const address = this.$store.getters.getAddressData
				delete address.coords
				delete address.cityId
				return Object.values(address).filter(Boolean).join(', ')
			},
			totalCost () {
				return this.cart.total_cost + this.cart.delivery_cost - this.order.bonus_points
			},
			hasDelivery () {
				if (typeof localStorage !== 'undefined') {
					return !localStorage.getItem('self_pickup')
				}

				return true
			},
			addressData () {
				return this.$store.getters.getAddressData
			},
			getStoreAddress () {
				const address = this.addressData
				if (address && address?.city && address?.street && address?.house_num) {
					return `${address.city ?? ''}, ${address.street ?? ''} ${address.house_num ?? ''}`
				}
			}
		},
		watch: {
			order: {
				deep: true,
				handler(value) {
					const newOrder = this.$store.getters.getOrder

					const orderReady = { ...this.order, ...newOrder }
					Object.keys(orderReady).forEach(key => {
						this.$set(this.order, key, orderReady[key])
					})
					if(this.order.id_org !== '') {
						this.errors.id_org = ''

						this.organizations.forEach(v => {
							if(v.id === this.order.id_org) this.organization = v
						})
					}
				}
			}
		},
		methods: {
			savePaymentId(value, name) {
				this.$store.dispatch('setOrder', {payment_id: value})
				this.logEvent( 'add_payment_info', {
					payment_type: name
				})
			},
			validate() {
				this.errors = []
				let hasErrors = false

				if (this.order.delivery_id === 1 && this.order.id_org === '') {
					this.errors.id_org = 'Выберите ресторан'
					hasErrors = true
				}

				if(this.order.delivery_id !== 1 && this.order.address_id === '') {
					this.errors.address = 'Добавьте адрес доставки'
					hasErrors = true
				}

				return (!hasErrors)
			},
			async getCart() {
				try {
					const options = {
						order_type: 1,
						id_org: this.$store.getters.getCity.default_id_org
					}
					const {data} = await this.$axios.post(`/api/site/cart/getCart`, options, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.cart = data
					this.loading = false
				} catch (error) {
					console.log(error)
					this.loading = false
				}
			},
			async getOrganizations() {
				try {
					const order_type = 2
					const city_id = this.$store.getters.getCity.id
					const {data} = await this.$axios.get(`/api/site/organization?order_type=${order_type}&city_id=${city_id}`)
					this.organizations = data.orgs
					this.organization = this.organizations[0]

					if(this.organization.deliveries.length === 1) this.order.delivery_id = this.organization.deliveries[0].id
					this.loading = false
				} catch (error) {
					console.log(error)
					this.loading = false
				}
			},
			async createOrder() {
				if(this.validate()) {
					this.loading = true
					if(this.order.payment_id === 2) {
						this.$store.commit('setOrder', this.order)
						this.$emit('nextStep', 'Payment')
					}else {
						try {
							this.prepareOrder()
							const {data} = await this.$axios.post(`/api/site/order`, this.prepare_order, {
								headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
							})
							this.created_order = data.data
							this.$store.commit('setOrder', this.created_order)
							this.$nuxt.$emit('cleanCart')
							this.loading = false
							if (data?.data?.bonus_writeoff) {
								this.logEvent('spend_virtual_currency', {
									value: data.data.bonus_writeoff
								})
							}
							this.$fb.track('Purchase', {
								value: this.created_order.itogo,
								currency: 'RUB'
							})

							this.$yandexMetrika.reachGoal('confirm_order')
							await this.logEvent('purchase', {
								currency: 'RUB',
								value: this.totalCost
							})
							this.$emit('nextStep', 'Step4')
						} catch (error) {
							console.log(error)
							this.loading = false
						}
					}
				}
			},
			prepareOrder() {
        Object.assign(this.prepare_order, this.order)
        Object.assign(this.prepare_order, this.$store.getters.getOrder)
			},
			nextStep(action) {
				switch (action) {
					case 'addAddress':
						this.$emit('nextStep', 'AddAddress')
						break
					case 'editAddress':
						this.$emit('nextStep', 'EditAddress')
						break
				}
			},
			async getUserAddresses() {
				try {
					const data = await this.$axios.$get(`/api/user/getUserAddress`, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					// console.log(data)
					this.addresses = [
						data[data.length - 1]
					]
					this.loading = false

					setTimeout(() => {
						this.order.address_id = this.addresses[0].id
						this.order.address = `${this.addresses[0].city}, ${this.addresses[0].street} ${this.addresses[0].house_num}`
					}, 500)

					if(this.$store.getters.getOrder.hasOwnProperty('address_id')) {
						this.order.address_id = this.$store.getters.getOrder?.address_id
					}

					if(this.$store.getters.getOrder.hasOwnProperty('address')) {
						this.order.address = this.$store.getters.getOrder?.address
					}

				} catch (error) {
					console.error(error)
				} finally {
					this.loading = false
				}
			},
			changeTab() {
				if(this.order.delivery_id === 2) {
          this.delivery_cost = this.cart.delivery_cost
          this.cart.delivery_cost = 0
					this.order.delivery_id = 1
					this.getOrganizations()

					this.logEvent('add_shipping_info', {
						shipping_tier: 'pickup'
					})
				}else {
          this.cart.delivery_cost = this.delivery_cost
					this.order.delivery_id = 2
					this.logEvent('add_shipping_info', {
						shipping_tier: 'delivery'
					})
				}

			},
		},
		mounted() {
			this.getOrganizations()
			this.getCart()
			this.getUserAddresses()
			if (!this.hasDelivery) {
				this.order.delivery_id = 1
			}
			this.order.id_org = this.$store.getters.getCity.default_id_org
			this.payments = this.$store.getters.getOrganization.payments
			this.order.payment_id = this.payments[0].id

			if(this.$store.getters.getOrder.hasOwnProperty('payment_id')) {
				this.order.payment_id = this.$store.getters.getOrder.payment_id
			}
		},
	}
</script>

<style scoped>
	span.error {
		color: red;
		font-size: 14px;
	}
	.tabs .tab {
		display: none;
	}
	.tabs .tab.active {
		display: block;
	}
</style>
