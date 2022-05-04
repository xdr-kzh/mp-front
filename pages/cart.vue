<template>
	<div>
		<div class="mt-0 mt-lg-5"></div>

		<loader v-if="loading"></loader>

		<div class="cart" v-if="loading === false && Object.keys(cart.products).length === 0">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="cart-empty">
							<div class="cart-empty-title">
								Ваш заказ
							</div>
							<div class="cart-empty-text">
								<p>Здесь пока пусто :(</p>
								<p>Откройте меню, там вы обязательно найдете <br>
									то, что вам понравится</p>
							</div>
							<div class="cart-empty-home">
								<nuxt-link :to="`/`" class="btn btn-colored btn-large">Вернуться на главную</nuxt-link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-else-if="loading === false && Object.keys(cart.products).length !== 0">
			<transition name="fade-left">
				<component
					:is="currentStep"
					@cleanCart="cleanCart"
					@nextStep="nextStep"
					@updateOrder="updateOrder"
					@updateCart="updateCart"
					@showModalSignIn="showModalSignIn"
					:address="address"
					:cart="cart"
				></component>
			</transition>
		</div>

	</div>
</template>

<script>
	import Step1 from "../components/Cart/Steps/Step1";
	import Step2 from "../components/Cart/Steps/Step2";
	import Step3 from "../components/Cart/Steps/Step3";
	import Step4 from "../components/Cart/Steps/Step4";
	import AddAddress from "../components/Cart/Steps/AddAddress";
	import EditAddress from "../components/Cart/Steps/EditAddress";
	import Payment from "../components/Cart/Steps/Payment";
	export default {
		components: {Step1,Step2,Step3,Step4,AddAddress,EditAddress,Payment},

		watchQuery: true,
		data: () => ({
			loading: true,
			cart: {},
			currentStep: 'Step1',
			order: {},
			address: '',
		}),
		head () {
			return {
				title: 'Корзина',
			}
		},
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
			this.$store.watch(
				(state) => {
					return this.$store.getters.getCartStep
				},
				(newValue, oldValue) => {
					this.currentStep = newValue
				},
				{
					deep:true
				}
			)
		},
		mounted() {
			this.currentStep = this.$store.getters.getCartStep
			if(this.$store.getters.getCity) this.getCart()

			this.logEvent('view_cart')
		},
		methods: {
			async getCart() {
				if(!this.$store.getters.getCity.default_id_org) return
				try {
					const options = {
						order_type: 1,
						id_org: this.$store.getters.getCity.default_id_org
					}
					const {data} = await this.$axios.post(`/api/site/cart/getCart`, options)
					this.cart = data
					this.loading = false
				} catch (error) {
					console.log(error)
					this.loading = false
				}
			},
			cleanCart() {
				this.$nuxt.$emit('cleanCart')
			},
			async getAddress(id) {
				try {
					const {data} = await this.$axios.get(`/api/site/user/address/${id}`)
					this.address = data
					this.loading = false
					this.currentStep = 'Step3'
				} catch (error) {
					console.log(error)
					this.loading = false
				}
			},
			updateCart(data) {
				this.$emit('updateCart', data)
				this.cart = data
			},
			updateOrder(order) {
				if(order.address_id !== undefined) {
					this.getAddress(order.address_id)
				}
				Object.assign(this.order, order)
				this.getCart()
			},
			nextStep(step) {
				this.currentStep = step
			},
			showModalSignIn(step) {
				this.$nuxt.$emit('showModalSignIn', step)
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
