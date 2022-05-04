<template>
	<div class="self-pickup">
		<div class="self-pickup__wrapper">
			<div class="self-pickup__smile"></div>

			<div class="self-pickup__title">
				Упс, нас тут ещё нет :(
			</div>

			<p>
				Оставьте свой номер телефона и мы обязательно уведомим вас,
				как только зона доставки увеличится в нашем городе.
			</p>

			<div class="form-group position-relative">
				<input
					type="text"
					v-model="phoneNumber"
					v-mask="'+# (###) ###-##-##'"
					placeholder="Ваш номер"
					class="input"
				/>

				<button class="btn btn-colored btn-send" @click="phoneSubmit" :disabled="!agree">
					Отправить
				</button>

				<div class="checkbox">
					<input type="checkbox" v-model="agree" id="self-checkbox">
					<label for="self-checkbox">
						<i></i>
						<span>Согласие на обработку <a href="/policy" target="_blank">персональных данных</a></span>
					</label>
				</div>
			</div>

			<p>
				Если вам не терпится  попробовать нашу гавайскую еду, просто выберите ближайший ресторан и выберите самовывоз.
			</p>

			<button class="btn btn-colored" @click="submit">
				Забрать самому
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'SelfPickup',
		data: () => ({
			phoneNumber: null,
			agree: false
		}),
		methods: {
			async submit () {
				try {
					localStorage.setItem('self_pickup', 1)
					this.$emit('close')
				} catch (e) {
					console.error(e)
				}
			},
			async phoneSubmit () {
				try {
					const {data} = await this.$axios.post('api/site/user/address/new', {
						phone: this.phoneNumber,
						address: this.$store.getters.getAddressData,
						org_id: this.$store.getters.getOrganization.id
					})

					this.$toast.success(data.message)

					this.submit()
				} catch (e) {
					console.error(e)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.checkbox {
	font-family: Jost, sans-serif;
	max-width: 80%;
	margin: 10px auto 0;
	line-height: 1.1;
}
	.checkbox label a {
		color: #386B6F;
	}
button:disabled {
	background: #ccc;
	border-color: #ccc;
}
	.btn-send {
		position: absolute;
		right: 80px;
		top: 0;
		min-width: 140px;

		@media (max-width: 550px) {
			position: static;
			margin-top: 10px;
			width: 340px;
		}
	}
	.self-pickup {
		background: #fff;
		text-align: center;
		font-size: 16px;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		display: flex;
		font-family: Roboto, sans-serif;

		&__wrapper {
			max-width: 500px;
			margin: auto;

			@media (max-width: 550px) {
				max-width: 95%;
			}
		}

		&__title {
			color: #08202F;
			font-size: 26px;
			font-weight: bold;
		}
	}

	.input {
		border-radius: 7px;
	}

	input, button {
		min-width: 340px;

		@media (max-width: 400px) {
			width: 80% !important;
			min-width: auto;
		}
	}

	.btn {
		height: 50px;
		border-radius: 7px;
	}

	p {
		margin: 26px 0;
	}

	.self-pickup__smile {
		width: 100px;
		height: 100px;
		background: url(/img/address/smile.jpg) center/contain no-repeat;
		margin: 35px auto;
	}
</style>
