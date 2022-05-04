<template>
	<div>
		<div class="account-aside-name">
			<span v-if="user.name">
				Добрый день, <br>
				{{ user.name }}
			</span>
			<span v-else>
				Добрый день
			</span>
		</div>
		<div class="account-aside-nav">
			<ul>
				<li>
					<a href="#">
						<i class="icon-union"></i>
						<span>Бонусы</span>
						<div>{{ bonus }} ₽</div>
					</a>
				</li>
				<li>
					<nuxt-link :to="`/account/orders`">
						<i class="icon-shopping-basket"></i>
						<span>Мои заказы</span>
					</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="`/account/settings`">
						<i class="icon-user"></i>
						<span>Настройки профиля</span>
					</nuxt-link>
				</li>
				<li>
					<a href="" @click.prevent="logout">
						<i class="icon-logout"></i>
						<span>Выйти</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: "AccountNav",
		data: () => ({
			user: {},
			bonus: 0
		}),
		mounted() {
			this.$store.dispatch('getUserData')
			this.user = this.$store.getters.getUserData
			this.getBonus()
		},
		methods: {
			async logout() {
				try {
					await this.$axios.get('/api/site/user/logout')
					await this.$store.dispatch('removeUserData')
					this.$store.commit('setAddressData', null)
					localStorage.removeItem('self_pickup')
					this.$nuxt.$router.push('/')
				}catch (e) {
					console.log(e)
				}
			},
			async getBonus() {
				try {
					const {data} = await this.$axios.post('/api/site/user/bonus', {
						id_org: this.$store.getters.getCity.default_id_org,
						phone: this.$store.getters.getUserData.phone
					})
					this.bonus = data
					this.show = true
				}catch(error) {

				}
			}
		}
	}
</script>

<style scoped>
	.nuxt-link-exact-active.nuxt-link-active {
		font-weight: 600;
		color: #386B6F;
	}
</style>
