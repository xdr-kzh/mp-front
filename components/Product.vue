<template>
	<div class="item col-6 col-md-6 col-lg-4 col-xl-4">
		<form @submit.prevent="addToCart(product)" class="wrapper">
			<div class="item-img">
				<a href="">
					<img :data-src="product.img_small" v-lazy-load class="img-responsive" :alt="product.name">
				</a>
			</div>
			<div class="item-title">
				<a href="">{{ product.title }}</a>
			</div>
			<div class="item-text" v-html="product.content">
			</div>
			<div class="tabs mt-3" v-if="product.sizes">
				<div class="tabs-titles">
					<div :class="`item ${current_size.id === size.id ? 'active' : ''}`"
							 v-for="size in product.sizes.products" :key="size.id"
							 @click="switchSize(size)"
					>
						{{ size.title }}
					</div>
				</div>
			</div>
			<div class="item-variants" v-show="product.card_type !== 'no_mods'">
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
			<div class="item-footer">
				<div class="row no-gutters align-items-center">
					<div class="item-footer-price col-12 col-xl-5">
						<div class="wrap">
							<span><i>{{ actual_price }}</i> <img src="~assets/img/ruble.svg" alt=""></span>
							<div>{{ actual_weight }} {{ prepareWeightName(product.weight_name) }}</div>
						</div>
					</div>
					<div class="item-footer-btn col-12 col-xl-7">
						<div class="wrap">
							<button :class="`btn btn-trans ${in_cart ? 'd-none' : ''}`" type="submit">
								<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M0 0.752688C0 0.33699 0.33699 0 0.752688 0H2.74731C3.16301 0 3.5 0.33699 3.5 0.752688V3.65054H13.2473C13.4857 3.65054 13.71 3.76348 13.852 3.95499C13.9939 4.14651 14.0368 4.39396 13.9675 4.62206L11.8976 11.4339C11.8012 11.751 11.5088 11.9677 11.1774 11.9677H2.74731C2.33161 11.9677 1.99462 11.6307 1.99462 11.215V1.50538H0.752688C0.33699 1.50538 0 1.16839 0 0.752688ZM3.5 5.15591V10.4624H10.6195L12.2319 5.15591H3.5Z" fill="#000"/>
									<circle cx="3.08599" cy="13.7743" r="1.05376" fill="#000"/>
									<circle cx="10.1612" cy="13.7743" r="1.05376" fill="#000"/>
								</svg>
								<span>в корзину</span>
							</button>
							<button :class="`btn btn-colored ${!in_cart ? 'd-none' : ''}`">
								<img src="~assets/img/v.svg" alt=""><span>добавлено</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
	import prepareWeightName from "../mixins/prepareWeightName"
	export default {
		name: "Product",
		props: ['product', 'idx', 'cart'],
		mixins: [prepareWeightName],
		data: () => ({
			form: {},
			in_cart: false,
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
			change(item) {
				let value = item.target.value.split('|')
				this.actual_price = parseInt(this.product.price) + parseInt(value[3])
				this.actual_weight = parseInt(value[4])
				if(isNaN(this.actual_weight)) this.actual_weight = this.product.weight
			},
			switchSize(size) {
				this.current_size.id = size.id
				this.current_size.title = size.title
			},
			async addToCart() {
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
				console.log(this.form)

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
					this.$nuxt.$emit('updateCart', data)
          this.$toast.success('Товар добавлен в корзину')
					this.$fb.track('AddToCart')
					this.$yandexMetrika.reachGoal('add_to_basket')
					await this.logEvent('add_to_cart')
					await this.logEvent('select_item', {
						item_id: this.product.id,
						item_name: this.product.title,
						price: this.product.price
					})
				} catch (error) {
					console.log(error)
					if(error.response.status === 404 || error.response.status === 422) {
						this.$toast.error(error.response.data.message)
					}else {
            this.$toast.error('Что то пошло не так, попробуйте позже')
          }
				}
			},
		}
	}
</script>

<style scoped>

</style>
