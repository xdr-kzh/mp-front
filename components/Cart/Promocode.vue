<template>
	<div class="cart-promocode mt-5">
		<div class="cart-promocode-title cart-subtitle mb-2">
			Промокод
		</div>

		<div :class="`cart-promocode-content ${success.show ? 'accepted': ''} ${error.show ? 'error' : ''}`">
			<div class="form-group mb-2">
				<input type="text" v-model="promocode" @change="validate" @paste="validate" @keypress="validate" placeholder="Введите промокод" pattern="^[A-Za-z0-9]$">
				<button type="button" @click="setPromocode">{{ success.show ? 'Отменить' : 'Проверить' }}</button>

				<span v-if="error.show">{{ error.message }}</span>
				<span v-if="success.show">{{ success.message }}</span>

				<div v-if="success.show" class="cart-promocode-text">Скидка по промокоду: {{ discount }} руб.</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Promocode",
		props: [ 'cart' ],
		data: () => ({
			promocode: '',
			discount: 0,
			error: {
				show: false,
				message: 'Промокод не найден. Попробуйте еще раз.'
			},
			success: {
				show: false,
				message: 'Промокод применен'
			}
		}),
		mounted() {
			if(this.cart.promocodes) {
				this.promocode = this.cart.promocodes
				this.success.show = true
				this.discount = this.cart.actual_discount
			}
		},
		methods: {
			validate() {
				this.error.show = false
			},
			async removePromocode() {
				this.error.show = false
				this.success.show = false
				this.promocode = ''
				try {
					const {data} = await this.$axios.post(`/api/site/cart/promocode/remove`, {
						id_org: this.$store.getters.getCity.default_id_org,
						order_type: 1
					})

					this.$emit('updateCart', data)
				} catch (error) {
					if(error.response.status === 404) this.error.show = true
				}
			},
			async setPromocode() {
				if(this.success.show) return this.removePromocode()
				this.error.show = false
				this.success.show = false
				try {
					const {data} = await this.$axios.post(`/api/site/cart/promocode/set`, {
						id_org: this.$store.getters.getCity.default_id_org,
						order_type: 1,
						promocode: this.promocode
					},
					{
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})

					this.$emit('updateCart', data)
					this.discount = data.actual_discount
					this.success.show = true
				} catch (error) {
					if(error.response.status === 401) {
						this.promocode = ''
						this.$emit('showModalSignIn')
					}else {
						this.error.show = true
						this.error.message = error.response.data.message
					}
				}
			}
		}
	}
</script>

<style scoped>

</style>
