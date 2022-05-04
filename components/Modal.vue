<template>
  <div :class="`modal ${modal_class}`" :id="id">
		<div class="modal-close-btn" @click.prevent="close"></div>
    <div class="modal-title">
      <slot name="title"></slot>
    </div>
    <div class="modal-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Modal",
    props: {
      id: String,
      show: Boolean,
      modal_class: String,
			required: Boolean
    },
    mounted() {

    },
    watch: {
      show: {
        handler() {
          (this.show === true) ? this.open() : this.close()
        }
      }
    },
    methods: {
      async open() {
        $.fancybox.open({ src: `#${this.id}`, touch: false, clickOutside: !this.required, clickSlide: !this.required })
			},
			async close() {
      	$.fancybox.close('all')
				this.$emit('closeModal')
				this.$nuxt.$emit('closeModals')
			}
    }
  }
</script>

<style scoped>

</style>
