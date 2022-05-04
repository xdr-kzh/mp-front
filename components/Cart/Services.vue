<template>
	<div>
		<div class="cart-services">
			<div class="cart-services-title cart-subtitle mt-4 mb-3">
				Нужны одноразовые приборы?
				<span>Спасибо, что заботитесь о природе!</span>
			</div>

			<div class="cart-services-content">
				<div class="radio" v-for="(item, idx) in services">
					<input type="radio" v-model="order.service" :value="item" :id="`service${idx}`"
								 @change="updateOrder">
					<label :for="`service${idx}`"><i></i><span>{{ item }}</span></label>
				</div>
			</div>
		</div>

		<div class="checkbox mt-4">
			<input type="checkbox" v-model="order.need_call" value="1" id="a332">
			<label for="a332">
				<i></i>
				<span>Позвонить для подтверждения</span>
			</label>
		</div>

		<div class="form-group mt-4">
			<input type="text" v-model="order.time" v-mask="'##:##'" placeholder="Доставить ко времени">
		</div>
	</div>

</template>

<script>
	export default {
		name: "Services",
		data: () => ({
			services: [
				'Нет', 'Вилочки', 'Палочки',
			],
			order: {
				service: 'Нет',
				time: '',
				need_call: false
			}
		}),
		mounted() {
			this.updateOrder()
		},
		methods: {
			updateOrder() {
				this.$store.commit('setOrder', this.order)
			}
		}
	}
</script>

<style scoped>

</style>
