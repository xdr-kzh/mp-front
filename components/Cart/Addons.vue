<template>
	<div class="cart-addons" v-if="addons.length">
		<div class="cart-addons-title cart-subtitle">
			Добавьте для большего вкуса!
		</div>
		<div :class="`cart-addons-content mt-2 ${loading ? 'loading' : ''}`" id="addons" ref="addons">
			<div class="row no-gutters no-wrap cart-addons-content-row">
				<addons-product
					v-if="addons"
					v-for="(product, idx) in addons"
					:key="product.id"
					:product="product"
					@updateCart="updateCart"
					@wait="wait"
				></addons-product>
			</div>
		</div>
	</div>
</template>

<script>
	import AddonsProduct from "./AddonsProduct";
	export default {
		name: "Addons",
		components: {AddonsProduct},
		data: () => ({
			addons: [],
			loading: false
		}),
		mounted() {
			this.getAddons()
		},
		methods: {
			async getAddons() {
				try {
					const options = {
						id_org: this.$store.getters.getCity.default_id_org,
						order_type: 1
					}
					const query = new URLSearchParams(options).toString()
					const {data} = await this.$axios.get(`/api/site/product/recommendations?${query}`)
					this.loading = false
					this.addons = data.data
					if(data.data.length)
						setTimeout(() => { this.dragAddons() }, 100)
				} catch (error) {
					console.log(error)
				}
			},
			dragAddons() {

				const slider = this.$refs.addons;
				let isDown = false;
				let startX;
				let scrollLeft;

				slider.addEventListener('mousedown', (e) => {
					isDown = true;
					slider.classList.add('active');
					startX = e.pageX - slider.offsetLeft;
					scrollLeft = slider.scrollLeft;
				});
				slider.addEventListener('mouseleave', () => {
					isDown = false;
					slider.classList.remove('active');
				});
				slider.addEventListener('mouseup', () => {
					isDown = false;
					slider.classList.remove('active');
				});
				slider.addEventListener('mousemove', (e) => {
					if(!isDown) return;
					e.preventDefault();
					const x = e.pageX - slider.offsetLeft;
					const walk = (x - startX) * 1; //scroll-fast
					slider.scrollLeft = scrollLeft - walk;
				});
			},
			updateCart(cart) {
				this.$emit('updateCart', cart)
				this.loading = false
			},
			wait() {
				this.loading = true
			}
		}
	}
</script>

<style scoped>

</style>
