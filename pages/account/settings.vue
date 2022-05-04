<template>
	<div>
		<div class="mt-5"></div>

		<loader v-if="loading"></loader>

		<div class="account" v-else>
			<div class="container">
				<div class="row">
					<div class="col account-aside">
						<account-nav></account-nav>
					</div>
					<div class="col account-content">
						<div class="account-content-title">
							Мой профиль
						</div>
						<div class="account-content-settings">
							<loader v-if="loading"></loader>

							<div class="wrapper" v-else>
								<div :class="`form-group ${errors.name ? 'has-error' : ''}`">
									<input type="text" v-model="form.name" placeholder="Ваше имя">
									<span class="error" v-if="errors.name">{{ error(errors.name) }}</span>
								</div>
								<div :class="`form-group ${errors.phone ? 'has-error' : ''}`">
									<input type="text" v-mask="'+# (###) ###-##-##'" v-model="form.phone" placeholder="Телефон">
									<span class="error" v-if="errors.phone">{{ error(errors.phone) }}</span>
								</div>
								<div :class="`form-group ${errors.birthday ? 'has-error' : ''}`">
									<input type="text" v-mask="'##.##.####'" v-model="form.birthday" placeholder="Дата рождения">
									<span class="error" v-if="errors.birthday">{{ error(errors.birthday) }}</span>
								</div>
								<div :class="`form-group ${errors.email ? 'has-error' : ''}`">
									<input type="email" v-model="form.email" placeholder="Ваш E-Mail">
									<span class="error" v-if="errors.email">{{ error(errors.email) }}</span>
									<span class="form-group-text" v-else>Для чеков и информации об акциях</span>
								</div>
								<div class="form-group">
									<div class="form-group-title">Ваш пол</div>
									<div class="radio">
										<input type="radio" v-model="form.gender" value="1" id="gender1">
										<label for="gender1"><i></i><span>Мужской</span></label>
									</div>
									<div class="radio">
										<input type="radio" v-model="form.gender" value="2" id="gender2">
										<label for="gender2"><i></i><span>Женский</span></label>
									</div>
								</div>
								<div class="form-group">
									<button type="button" @click.prevent="submit" class="btn btn-colored btn-medium">
										<span>Продолжить</span><i class="icon-right-open-big pl-3"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import AccountNav from "../../components/AccountNav";
	export default {
		components: {AccountNav},
		middleware: [
			'authenticated'
		],
		name: "settings",
		data: () => ({
			loading: true,
			form: {
				name: '',
				phone: '',
				birthday: '',
				email: '',
				gender: '',
			},
			errors: {
				name: '',
				phone: '',
				birthday: '',
				email: '',
				gender: '',
			}
		}),
		mounted() {
			this.$store.dispatch('getUserData')
			console.log(this.$store.getters.getUserData)
			Object.assign(this.form, this.$store.getters.getUserData)
			this.loading = false
		},
		methods: {
			error(error) {
				return error.join(', ')
			},
			async submit() {
				try {
					this.errors = {}
					const {data} = await this.$axios.put('/api/site/user/update', this.form, {
						headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
					})
					this.$store.commit('setUserData', data)
					this.$toast.success('Профиль обновлен')
				}catch (e) {
					if(e.response.status === 422) {
						this.errors = e.response.data.errors
						console.log(this.errors)
					}
				}
			}
		}
	}
</script>

<style scoped>

</style>
