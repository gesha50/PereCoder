<template>
    <q-card
      class="login-form"
      :style="$q.platform.is.mobile ? { width: '60%' } : { width: '50%' }"
    >
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis text-center">
            Setting
          </div>
        </div>
      <q-card-section class="column">
        <q-option-group
          :options="options"
          type="toggle"
          v-model="notifications"
        />
      </q-card-section>
    </q-card>
</template>

<script>
export default {
  name: "setting",
  data () {
    return {
      notifications: [],
      options: [
        { label: 'Battery too low', value: 'bat' },
        { label: 'Friend request', value: 'friend', color: 'green' },
        { label: 'Picture uploaded', value: 'upload', color: 'red' }
      ]
    }
  },
}
</script>

<style scoped>

</style>
