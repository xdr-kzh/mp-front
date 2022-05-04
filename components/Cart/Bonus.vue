<template>
	<div class="cart-bonus mt-5">
		<div class="cart-bonus-title cart-subtitle mb-2">
			Ваши бонусы <span>{{ bonus }} ₽</span>
		</div>

		<div class="cart-bonus-content">
			<div class="row no-gutters">
				<div class="col">
					<div class="checkbox">
						<input type="checkbox" v-model="check" value="1" @click="activateInput" id="a12">
						<label for="a12">
							<i></i>
							<span>Оплатить бонусами <b>Максимум {{ bonus }} ₽</b></span>
						</label>
					</div>
				</div>
				<div class="col">
					<div :class="`form-group ${disabled === true ? 'd-none' : ''}`">
						<i class="icon-rouble"></i>
						<input type="text" v-model.lazy="value" @focusout="submit" :disabled="disabled">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Bonus",
		data: () => ({
			bonus: 0,
			value: '',
			check: false,
			disabled: true,
			show: false,
		}),
		watch: {
			value: {
				handler() {
					this.value = isNaN(parseInt(this.value)) ? 0 : this.value
					if(parseInt(this.value) > this.bonus) {
						this.value = this.bonus
					}
					else if (parseInt(this.value) > parseInt(this.cart_total) * .7) {
						this.value = Math.round(parseInt(this.cart_total) * .7)
					}
					else {
						this.$emit('updateBonus', this.value)
					}
				}
			}
		},
		mounted() {
			if(this.$store.getters.getUserData) this.getBonus()
		},
		methods: {
			activateInput() {
				if (this.check === false) {
					this.disabled = false
					this.$emit('updateBonus', this.value, 'activate')
				}
				else {
					this.disabled = true
					this.$emit('updateBonus', this.value, 'disable')
				}
			},
			async getBonus() {
				try {
					const {data} = await this.$axios.post('/api/site/user/bonus', {
						id_org: this.$store.getters.getCity.default_id_org,
						phone: this.$store.getters.getUserData.phone
					}, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.getCartBonus(data)
					this.show = true
				}catch(error) {

				}
			},
			async getCartBonus(bonus) {
				if(!this.$store.getters.getCity.default_id_org) return
				try {
					const options = {
						order_type: 1,
						id_org: this.$store.getters.getCity.default_id_org
					}
					const {data} = await this.$axios.post(`/api/site/cart/getCart`, options)
					this.loading = false
					if(data.bonus_points > 0) {
						this.disabled = false
						this.check = true
					}
					this.bonus = bonus
					this.value = data.bonus_points
					this.cart_total = data.total_cost
				} catch (error) {
					console.log(error)
					this.loading = false
				}
			},
			async submit()
			{
				try {
					const {data} = await this.$axios.post('/api/site/cart/setBonusPoints', {
						id_org: this.$store.getters.getCity.default_id_org,
						bonus_points: parseInt(this.value)
					})
					this.show = true
					if(parseInt(this.value) === 0) this.$emit('updateBonus', this.value, 'disable')
				}catch(error) {

				}
			}
		}
	}
</script>

<style scoped>

</style>
