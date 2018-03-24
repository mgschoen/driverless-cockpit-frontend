<template>
  <b-row>
    <b-col>
      <h1>Dashboard View</h1>
      <pre>apiRoot: {{apiRoot}}</pre>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'DashboardView',
  data () {
    return {
      'apiRoot': process.env.FSD_API_ROOT
    }
  }
}
</script>
