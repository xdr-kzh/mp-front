<template>
	<div class="cart">
		<div class="container">
			<div class="row">
				<div class="col-12 col-xl-6 offset-xl-3">
					<div class="h1 mb-1 mt-4 mb-5">Оформление заказа</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Payment",
		props: [ 'cart' ],
		data: () => ({
			result: {},
			loading: false,
			created_order: false,
			receipt: [],
			pay: '',
		}),
		async mounted() {
			const payment_public_id = this.$store.getters.getCity.organization.cloudp_publicid
			const order = this.$store.getters.getOrder

			const response = await this.$axios.post(`/api/site/cart/getFiscalData`, order, {
				headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
			})

			const data = { //содержимое элемента data
					"CloudPayments": {
						"CustomerReceipt": response.data, //онлайн-чек
					},
					"phone": order.phone
			}


			let widget = new cp.CloudPayments();
			widget.pay('charge', // или 'charge'
				{
					publicId: payment_public_id, //id из личного кабинета
					description: 'Оплата заказа', //назначение
					email: order.email,
					amount: response.data.amounts.electronic, //сумма
					currency: 'RUB', //валюта
					accountId: '', //идентификатор плательщика (необязательно)
					invoiceId: response.data.invoiceId, //номер заказа  (необязательно)
					skin: "mini", //дизайн виджета (необязательно)
					data: data
				},
				{
					onSuccess: function (options) {
						console.log(options)
					},
					onFail: (reason, options) => {
						this.$nextTick(() => {
							location.href = '/cart'
						})
					},
					onComplete: (paymentResult, options) => {
						if(paymentResult.success === true) {
							options.id = this.created_order.id
							console.log('options', options)
							this.createOrder(true, options)
							this.$yandexMetrika.reachGoal('payment_successed')
						}
					}
				}
			)
			this.pay = widget
		},
		methods: {
			async submit() {
				this.$refs.submit.click(this.pay);
			},
			async getFiscalData() {
					try {
						const {data} = await this.$axios.post(`/api/site/cart/getFiscalData`, order, {
							headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
						})
						this.receipt = data
						console.log(this.receipt)
					} catch (error) {

					}
			},
			async createOrder(payment_success = false, options = '') {
				try {
					const order = this.$store.getters.getOrder
					Object.assign(order, {payment_success: payment_success, options: options})
					const {data} = await this.$axios.post(`/api/site/order`, order, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.created_order = data.data
					this.$store.commit('setOrder', this.created_order)
					this.$nuxt.$emit('cleanCart')
					this.$emit('nextStep', 'Step4')
					this.loading = false
				} catch (error) {
					console.log(error)
					this.loading = false
				}
			},
		}
	}
</script>

<style scoped>
	.cart-payment_form .form-group input {
		width: 100%
	}
	.cart-payment_form .form-group button {
		width: 100%
	}
	.cart-payment_form .form-group button:disabled {
		opacity: .5;
	}
	.cart {
		min-height: 500px;
	}
</style>
