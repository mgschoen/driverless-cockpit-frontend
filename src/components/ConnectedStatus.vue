<template>
  <div>
    <span>Connected</span>
    <span id="light" :class="cssClass"></span>
  </div>
</template>

<script>
export default {
  name: 'connected-status',
  props: {
    active: {
      type: Boolean
    }
  },
  computed: {
    cssClass: function () {
      return this.active ? 'on' : 'off'
    }
  }
}
</script>

<style scoped>
#light {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius:6px;
}
#light.on {
  background: greenyellow;
}
#light.off {
  background: transparent;
  border: 1px solid gray;
}
</style>
