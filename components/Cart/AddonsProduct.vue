<template>
	<div class="col item">
		<div class="wrap">
			<div class="row no-gutters align-items-center">
				<div class="col item-img">
					<img :src="product.img_small" :alt="product.title">
				</div>
				<div class="col item-caption">
					<div class="item-caption-title">
						{{ product.title }}
					</div>
					<div class="item-caption-btn">
						<a href="" @click.prevent="addToCart">
							<i class="icon-shopping-basket"></i>
							<span>{{ product.price }} ₽</span>
						</a>
					</div>
					<div class="item-variants" style="display: none">
						<div class="form-group" v-for="(mod, idx) in product.modificators" :key="idx">
							<label>{{ mod.title }}</label>
							<select v-model="form[mod.type]" @change="change">
								<option value="" v-if="mod.min_quantity === 0">Выберите</option>
								<option
									:value="`${item.id}|${mod.title}|${item.title}|${item.price}|${item.weight === null ? 0 : item.weight}`"
									v-for="(item, idx) in mod.products" :key="idx"
									v-if="item.published"
								>{{ item.title }}</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
	 	name: "AddonsProduct",
		props: [ 'product' ],
		data: () => ({
			in_cart: false,
			form: {},
			actual_price: '',
			actual_weight: '',
			current_size: {
				id: 0,
				title: ''
			}
		}),
		created() {

			this.actual_price = this.product.price
			this.actual_weight = this.product.weight

			for (const [key, value] of Object.entries(this.product.modificators)) {
				this.form[value.type] = ''
				if(value.min_quantity > 0) {
					for (const [k, v] of Object.entries(value.products)) {
						if(this.form[value.type] === '') {
							this.form[value.type] = `${v.id}|${value.title}|${v.title}|${v.price}|${v.weight ?? 0}`
						}
					}
				}
			}
			if(Object.keys(this.form).length !== 0) {
				for (const [k, v] of Object.entries(this.form)) {
					let value = v.split('|')
					if(v !== '') {
						this.actual_price = parseInt(this.product.price) + parseInt(value[3])
						this.actual_weight = parseInt(value[4])
						if(isNaN(this.actual_weight)) this.actual_weight = this.product.weight
					}
				}
			}

			if(this.product.sizes.products !== undefined) {
				this.current_size.id = this.product.sizes.products[0].id
				this.current_size.title = this.product.sizes.products[0].title
			}
		},
		methods: {
			async addToCart() {
				this.$emit('wait')
				const row = {
					id: this.product.id,
					comment: '',
					count: 1,
					order_type: 2,
					id_org: this.$store.getters.getCity.default_id_org,
				}

				const mods = [];
				let explode;
				for (const [key, value] of Object.entries(this.form)) {
					explode = value.split('|')
					if(value === '') continue
					mods[key] = [
						{
							id: parseInt(explode[0]),
							count: 1,
							block_title: explode[1],
							title: explode[2]
						}
					]
				}
				Object.assign(row, mods)

				console.log(row)

				if(this.current_size.id !== 0) {
					let size = []
					size['size'] = [
						{
							id: this.current_size.id,
							count: 1,
							block_title: 'Размер',
							title: this.current_size.title
						}
					]
					Object.assign(row, size)
				}

				try {
					const {data} = await this.$axios.post(`/api/site/cart/add`, row)
					this.in_cart = true
					this.$emit('updateCart', data)
				} catch (error) {
					console.log(error)
				}
			}
		}
	}
</script>

<style scoped>

</style>
