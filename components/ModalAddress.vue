<template>
	<div class="overlay">
		<div class="modal-address">
			<div class="modal-address__close" @click="isActive = false" v-if="$store.state.addressData && $store.state.addressData.house_num"></div>
			<div class="modal-address__title">Выберите адрес</div>
			<div class="modal-address__content">
				<div class="modal-address__list">
					<label v-for="item in addresses" v-if="addresses.length"
							   class="modal-address__list-item"
								 :for="`address_${item.id}`"
					>
						<input
							:id="`address_${item.id}`"
							:value="item"
							type="radio" v-model="selected_address" class="d-none">
						<span>{{ item.city }}, {{ item.address }}</span>
					</label>
				</div>
				<form @submit.prevent="submit" class="modal-address__form">
					<div class="modal-address__input">
						<input
							type="text"
							placeholder="Пенза, Ленина 5"
							v-model="address"
							@change="requestAndGetData"
						/>
						<div class="input_clear" @click.prevent="clearInput">&times;</div>
						<div class="input_location" @click.prevent="getMyLocation"></div>
					</div>
					<button type="submit">
						выбрать
					</button>
				</form>

				<client-only>
					<yandex-map
						:coords="computedCoords"
						:controls="['zoomControl', 'fullscreenControl']"
						:options="mapOptions"
						@click="mapClick"
						@map-was-initialized="initMap"
						style="height: 240px">
						<ymap-marker
							:marker-id="1"
							:coords="computedCoords"
							:options="markerOptions"
						></ymap-marker>
					</yandex-map>
				</client-only>
			</div>
		</div>
	</div>
</template>

<script>
	import geolocation from "../mixins/geolocation";

	export default {
		name: "ModalAddress",
		props: {
			value: {
				type: Boolean,
				required: true
			},
			addressData: {
				type: Object,
				required: true
			}
		},
		mixins: [
			geolocation
		],
		watch: {
			selected_address: {
				handler(v) {
					this.address = v.address
					this.submit()
				}
			},
		},
		data: () => ({
			selected_address: '',
			addresses: [],
			address: '',
			coords: null,
			markerOptions: {
				iconColor: '#000'
			},
			mapOptions: {
				zoomControlPosition: {
					left: 10,
					top: 40
				},
				zoomControlSize: 'small',
			},
			mapInstance: {},
			isAlreadySearching: false,
			isGeocoding: false
		}),
		computed: {
			isActive: {
				get () {
					return this.value
				},
				set (v) {
					this.$emit('input', v)
				}
			},
			currentCity () {
				return this.$store.getters.getCity
			},
			storeAddressData () {
				return this.$store.getters.getAddressData
			},
			computedCoords: {
				get () {
					if (this.coords) {
						return this.coords
					}
					if (this.storeAddressData?.coords) {
						return this.storeAddressData.coords
					}
					if (this.currentCity?.organization) {
						return [this.currentCity.organization.lat, this.currentCity.organization.long]
					}

					return [56.845239, 53.200261]
				},
				set (v) {
					this.coords = v
				}
			}
		},
		methods: {
			getMyLocation () {
				this.getLocation(async (position) => {
					this.coords = [position.coords.latitude, position.coords.longitude]
					const { city, street, house_num } = await this.reverseGeocode()

					this.address = `${city ?? ''}, ${street ?? ''} ${house_num ?? ''}`
				})
			},
			clearInput () {
				this.address = ''
				Object.keys(this.addressData).forEach(key => this.addressData[key] = '')
			},
			initMap (map) {
				this.mapInstance = map
			},
			async mapClick (e) {
				try {
					this.mapInstance.geoObjects.removeAll();
					this.coords = e.get('coords');

					const { city, street, house_num } = await this.reverseGeocode()

					this.address = `${city ?? ''}, ${street ?? ''} ${house_num ?? ''}`
				} catch (e) {
					console.error(e)
				}
			},
			async requestAndGetData () {
				try {
					this.lastInputSearchAddress = this.address
					if (!this.isAlreadySearching && this.address.trim() !== '') {
						this.isAlreadySearching = true
						setTimeout(async () => {
							await this.straightGeocode()
						}, 400)
					}
				} catch (e) {
					console.error(e)
				} finally {
					this.isGeocoding = false
				}
			},
			getAddressDataFromGeoObject (geoObject) {
				const coords = geoObject.geometry.getCoordinates()
				const city = geoObject.getLocalities().length ? geoObject.getLocalities()[0] : geoObject.getAdministrativeAreas()
				const street = geoObject.getThoroughfare() || geoObject.getPremise()
				const building = geoObject.getPremiseNumber()

				this.addressData.city = city ?? ''
				this.addressData.coords = coords
				this.addressData.street = street ?? ''
				this.addressData.house_num = building ?? ''

				return {
					coords,
					city,
					street,
					house_num: building
				}
			},
			async reverseGeocode (coords = this.coords) {
				try {
					const { geoObjects } = await ymaps.geocode(coords)
					const firstGeoObject = geoObjects.get(0);
					return this.getAddressDataFromGeoObject(firstGeoObject)
				} catch (e) {
					console.error(e)
				}
			},
			async straightGeocode () {
				try {
					this.isGeocoding = true
					const { geoObjects } = await ymaps.geocode(this.currentCity.title + ' ' + this.address)

					const firstGeoObject = geoObjects.get(0);
					this.getAddressDataFromGeoObject(firstGeoObject)
					const bounds = firstGeoObject.properties.get('boundedBy');

					firstGeoObject.options.set('iconColor', '#000')
					this.mapInstance.geoObjects.removeAll();
					this.mapInstance.geoObjects.add(firstGeoObject);
					this.mapInstance.setBounds(bounds, {
						checkZoomRange: true
					});

				} catch (e) {
					console.error(e)
					this.$toast.error('Ошибка. Проверьте корректность введённого адреса')
				} finally {
					this.isAlreadySearching = false
				}
			},
			async getAddresses() {
				try {
					const {data} = await this.$axios.get(`/api/site/user/address?city_id=${this.currentCity.id}`)
					this.addresses = data
				} catch (e) {
					console.log(e.response)
				}
			},
			async selectAddress() {

			},
			async submit () {
				await this.requestAndGetData()
				setTimeout(() => {
					this.$emit('submit', this.address)
				}, 2000)
			}
		},
		mounted () {
			this.getAddresses()
			if (this.currentCity?.title && this.currentCity?.organization?.address && !this.storeAddressData) {
				this.address = `${this.currentCity.title}, ${this.currentCity.organization.address}`
				setTimeout(async () => {
					await this.requestAndGetData()
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		z-index: 9999;
		background: rgb(30 30 30 / 71%);
	}

	.modal-address {
		margin: auto;
		background: #fff;
		padding: 35px;
		border-radius: 15px;
		position: relative;
		width: 620px;
		max-width: 95%;

		@media (max-width: 576px) {
			padding: 20px;
		}

		&__list {
			margin-bottom: 10px;

			&-item {
				transition: color .3s ease;
				cursor: pointer;
				display: block;

				span {
					display: block;
				}

				input:checked {
					& + span {
						position: relative;

						&:after {
							content: "";
							display: block;
							width: 16px;
							height: 13px;
							background: url(~assets/img/vvvv.svg);
							position: absolute;
							top: 0;
							bottom: 0;
							margin: auto;
							right: 0;
						}
					}
				}

				img {
					position: absolute;
					top: 0;
					bottom: 0;
					right: 10px;
					margin: auto;
				}

				&:hover {
					color: #386B6F;
				}
			}
		}

		&__title {
			font-size: 24px;
			color: #000;
			font-family: Jost, sans-serif;
		}

		&__close {
			position: absolute;
			right: 20px;
			top: 20px;
			height: 40px;
			width: 40px;
			display: block;
			background: url(/img/address/close.svg) center/contain no-repeat;
			transition: .2s;
			cursor: pointer;

			&:hover {
				transform: rotate(90deg);
			}
		}

		&__form {
			margin-top: 20px;
			margin-bottom: 10px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&__input {
			position: relative;
			width: 100%;
		}
	}

	button {
		font-family: Jost, sans-serif;
		font-weight: bold;
		font-size: 12px;
		background: #386B6F;
		padding: 10px 25px;
		color: #fff;
		border: none;
		margin-left: 10px;
		transition: .2s;
		cursor: pointer;

		&:hover {
			background: #275053;
		}
	}

	.modal-address__input input {
		&::placeholder {
			color: #BCC9D1;
		}

		width: 100%;
		color: #000;
		font-size: 12px;
		padding: 9px 50px 9px 17px;
		border: 1px solid #C4C4C4;
	}

	.input_clear {
		color: #08202F;
		font-size: 14px;
		top: calc(16px / 2);
		right: 30px;
		position: absolute;
		cursor: pointer;
	}

	.input_location {
		width: 14px;
		height: 14px;
		background: url(/img/address/location.svg) center/contain no-repeat;
		display: block;
		position: absolute;
		top: calc(25px / 2); // 39 input - 14 location
		right: 10px;
		cursor: pointer;
	}
</style>
