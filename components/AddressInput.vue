<template>
	<div class="address-input">
		<input
			type="text"
			v-model="addressValue"
		/>

		<div class="input_location" @click.prevent="getMyLocation"></div>
	</div>
</template>

<script>
	import geolocation from "../mixins/geolocation";

	export default {
		name: 'AddressInput',
		props: {
			value: {
				required: true
			},
			addressData: {
				required: true
			}
		},
		mixins: [
			geolocation
		],
		computed: {
			addressValue: {
				get () {
					return this.value
				},
				set (v) {
					this.$emit('input', v)
				}
			}
		},
		methods: {
			getMyLocation () {
				this.getLocation(async (position) => {
					this.coords = [position.coords.latitude, position.coords.longitude]
					const { city, street, house_num } = await this.reverseGeocode()

					this.addressValue = `${city ?? ''}, ${street ?? ''} ${house_num ?? ''}`
				})
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
			getAddressDataFromGeoObject (geoObject) {
				const city = geoObject.getLocalities().length ? geoObject.getLocalities()[0] : geoObject.getAdministrativeAreas()
				const street = geoObject.getThoroughfare() || geoObject.getPremise()
				const building = geoObject.getPremiseNumber()

				this.$emit('update:address-data', {
					city,
					street,
					house_num: building
				})

				return {
					city,
					street,
					house_num: building
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.address-input {
		position: relative;
	}

	input {
		border-radius: 50px;
		max-width: 160px;
		width: 100%;
		padding: 2px 20px 2px 10px;
		font-size: 12px;
	}

	.input_location {
		width: 12px;
		height: 12px;
		background: url(/img/address/location.svg) center/contain no-repeat;
		display: block;
		position: absolute;
		top: 8px;
		right: 5px;
		cursor: pointer;
	}
</style>
