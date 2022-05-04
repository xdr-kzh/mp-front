<template>
  <div class="work-time">
    <div class="work-time-caption">
      <div class="work-time-from">
        {{ worktime_from }}
      </div>
      <div class="work-time-to">
        {{ worktime_to }}
      </div>
    </div>
    <img src="~assets/img/worktime.svg" alt="">
  </div>
</template>

<script>
	export default {
		name: "WorkTime",
		data: () => ({
			worktime_from: '',
			worktime_to: ''
		}),
		mounted() {
			this.getWorkTime()
		},
		methods: {
			async getWorkTime() {
				try {
					const id_org = this.$store.getters.getCity.default_id_org
					const {data} = await this.$axios.get(`/api/site/organization/${id_org}`)

					let time = data.data.worktime.split('-')
					this.worktime_from = `с ${time[0]}`
					this.worktime_to = `до ${time[1]}`

				}catch (error) {
					console.log(error)
				}
			}
		}
	}
</script>

<style scoped>
	.work-time {
		position: absolute;
		top: 50px;
		right: 100px;
	}
  .work-time-caption {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    font-size: 20px;
    line-height: 1.4;
    height: 60px
  }
</style>
