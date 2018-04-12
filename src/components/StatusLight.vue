<template>
  <div>
    <span>{{label}}</span>
    <span id="light" :style="style"></span>
  </div>
</template>

<script>
export default {
  name: 'status-light',
  props: {
    active: Boolean,
    label: String,
    color: String
  },
  computed: {
    style () {
      return this.active
        ? 'background-color: ' + this.color + ';'
        : 'background: transparent; border: 1px solid gray;'
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
</style>
