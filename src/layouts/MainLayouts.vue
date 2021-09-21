<template>
  <q-layout>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: "MainLayouts",
  sockets: {
    connect: function () {
      console.log('socket connected')
    }
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/app.scss";

.q-page-container {
  padding-right: 0 !important;
}
.container {
  margin: 0 auto;
  background: #fff;
  @media (min-width: $breakpoint-xl-max) {
    // for TV
    max-width: 1500px;
    padding-left: 150px;
    padding-right: 150px;
  }
  @media (min-width: $breakpoint-lg-max) and (max-width: $breakpoint-xl-max) {
    // for bid PC
    max-width: 1200px;
    padding-left: 120px;
    padding-right: 120px;
  }
  @media (min-width: $breakpoint-md-max) and (max-width: $breakpoint-lg-max) {
   // for standart PC
    max-width: 90%;
    padding-left: 100px;
    padding-right: 100px;
  }
  @media (min-width: $breakpoint-sm-max) and (max-width: $breakpoint-md-max) {
    // for tablet
    max-width: 90%;
    padding-left: 75px;
    padding-right: 75px;
  }
  @media (min-width: $breakpoint-xs-max) and (max-width: $breakpoint-sm-max) {
    // for tablet
    max-width: 95%;
    padding-left: 2%;
    padding-right: 2%;
  }
  @media (max-width: $breakpoint-xs)  {
    // for mobile
    max-width: 99%;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
