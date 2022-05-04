<template>
	<div class="cart">
		<div class="container">
			<div class="row">
				<div class="col-12 col-xl-8 offset-xl-2">
					<div class="h1 mb-4 mt-4 mb-lg-5">Ваш заказ</div>


					<loader v-if="loading"></loader>
					<div class="cart-wrap" v-else>
						<div class="cart-row" v-for="(item, idx) in cart.products">
							<div class="row no-gutters align-items-lg-center">
								<div class="cart-row-img col">
									<div class="wrap">
										<img :src="item.img_url" class="img-responsive" alt="">
									</div>
								</div>
								<div class="cart-row-title col">
									<div class="wrap">
										{{ item.title }}
										<div v-if="item.options !== undefined && item.card_type !== 'no_mods'">
											<span v-for="(m, idx) in item.options.childs">
													<b v-for="(p, idx) in m" :key="idx">{{ p.title }} x {{ p.count }}</b>
											</span>
										</div>
										<div class="d-block d-lg-none mt-2">{{ item.price }} ₽</div>
									</div>
								</div>
								<div class="cart-row-count col">
									<div class="wrap">
										<div class="count">
											<div class="count-minus" @click="minusCount(item)"></div>
											<input type="text" v-model="item.count">
											<div class="count-plus" @click="plusCount(item)"></div>
										</div>
										<div class="cart-row-count-remove d-block d-lg-none">
											<button type="button" @click="removeProduct(item)">удалить</button>
										</div>
									</div>
								</div>
								<div class="cart-row-price col d-none d-lg-block">
									<div class="wrap">
										<span>{{ item.price }} ₽</span>
									</div>
								</div>
								<div class="cart-row-remove col d-none d-lg-block">
									<div class="wrap">
										<button type="button" @click="removeProduct(item)">удалить</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<addons @updateCart="updateCart"></addons>

					<services></services>

					<promocode
						@updateCart="updateCart"
						@showModalSignIn="$emit('showModalSignIn')"
						v-if="cart.products.length"
						:cart="cart"
						></promocode>

					<bonus
						v-if="$store.getters.getToken && cart.products.length"
						@updateCart="updateCart"
						@updateBonus="updateBonus"
						></bonus>

					<div class="cart-comment mt-3">
						<div class="cart-comment-subtitle cart-subtitle">
							Пожелания к заказу
						</div>

						<div class="cart-comment-content mt-2">
							<div class="form-group">
								<input type="text" v-model="order.comment" placeholder="Комментарий к заказу">
							</div>
						</div>
					</div>

					<div class="cart-total">
						<div class="row align-items-center">
							<div class="col cart-total-int">
								<b>Сумма заказа:</b> <span>{{ cart.total_cost }} ₽</span>
							</div>
							<div class="col cart-total-btn">
								<button class="btn btn-colored btn-medium" @click.prevent="nextStep('next')">
									<span>Оформить заказ</span> <i class="icon-right-open-big pl-3"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Services from "../Services";
	import Bonus from "../Bonus";
	import Promocode from "../Promocode";
	import Addons from "../Addons";
	export default {
		components: {Services, Bonus, Promocode, Addons},
		data: () => ({
			loading: true,
			errors: {},
			total: 0,
			order: {
				comment: '',
				bonus_points: 0
			},
			payments: [],
			cart: {
				products: {}
			},
		}),
		created() {
			this.$store.watch(
				(state) => {
					return this.$store.getters.getCity
				},
				(newValue, oldValue) => {
					this.loading = true
					this.getCart()
				},
				{
					deep:true
				}
			)
		},
		mounted() {
			if(this.$store.getters.getCity) this.getCart()
			this.getPayments()
		},
		methods: {
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
					this.total = data.total_cost
				} catch (error) {
					console.log(error)
				}
				this.loading = false
			},
			async minusCount(item) {
				try {
					if(item.count === 1) return
					item.count--
					const {data} = await this.$axios.post(`/api/site/cart/change`, {
						key: item.key,
						count: item.count,
						id_org: this.$store.getters.getCity.default_id_org
					}, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.cart = data
					this.$nuxt.$emit('updateCart', this.cart)
				} catch (error) {
					console.log(error)
				}
				this.loading = false
			},
			async plusCount(item) {
				try {
					item.count++
					const {data} = await this.$axios.post(`/api/site/cart/change`, {
						key: item.key,
						count: item.count,
						id_org: this.$store.getters.getCity.default_id_org
					}, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.cart = data
					this.$nuxt.$emit('updateCart', this.cart)
				} catch (error) {
					if(error.response.status === 404 || error.response.status === 422) {
						this.$toast.error(error.response.data.message)
					}else {
            this.$toast.error('Что то пошло не так, попробуйте позже')
          }
				}
				this.loading = false
			},
			async removeProduct(item) {
				try {
					const {data} = await this.$axios.post(`/api/site/cart/remove`, {
						key: item.key,
						id_org: this.$store.getters.getCity.default_id_org
					}, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.cart = data
					this.$nuxt.$emit('updateCart', data)
					await this.logEvent('remove_from_cart', {
						item_id: item.id,
						item_name: item.title,
						price: item.price
					})
					await this.getCart()
				} catch (error) {
					console.log(error)
				}
				this.loading = false
			},
			async getPayments() {
				try {
					const {data} = await this.$axios.get(`/api/site/payment`, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.payments = data.data
				} catch (error) {
					console.log(error)
				}
				this.loading = false
			},
			nextStep(step) {
				this.$store.commit('setOrder', this.order)
				if(this.$store.getters.getToken !== '') {
					this.$emit('nextStep', 'Step2')
					this.logEvent('begin_checkout', {
						currency: 'RUB',
						value: this.cart.total_cost
					})
				}
				else
					this.$emit('showModalSignIn', step)
			},
			updateBonus(value, action = 'activate') {
				this.order.bonus_points = value
				if(action === 'disable') {
					this.cart.total_cost = this.total
				}
				else {
					this.cart.total_cost = this.total
					this.cart.total_cost -= parseInt(value)
				}
			},
			updateCart(data) {
				this.$emit('updateCart', data)
				this.cart = data
			},
			updateOrder(form) {
				Object.assign(this.order, form)
			}
		}
	}
</script>

<style scoped>
	.form-group input[type=text],
	.form-group input[type=email],
	.form-group input[type=tel],
	.form-group textarea {
		padding: 5px 15px;
		font-size: 14px;
	}
	.border-right-none {
		border-right: 0 !important;
	}
	.border-left-none {
		border-left: 0 !important;
	}
</style>
