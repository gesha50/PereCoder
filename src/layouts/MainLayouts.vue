<template>
  <q-layout>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
<!--  <q-layout class="container" view="hHh LpR fff">-->
<!--    <top-header-->
<!--      @drawer="drawer = !drawer"-->
<!--    ></top-header>-->
<!--    <q-drawer-->
<!--      side="right"-->
<!--      v-model="drawer"-->
<!--      show-if-above-->
<!--      :width="200"-->
<!--      :breakpoint="599"-->
<!--      bordered-->
<!--      class="bg-grey-3 mobile_only"-->
<!--    >-->
<!--      <q-scroll-area class="fit">-->
<!--        <q-list>-->

<!--          <template v-for="(menuItem, index) in this.$store.getters['header/getMenu']">-->
<!--            <q-item clickable :to="menuItem.href" exact v-ripple>-->
<!--              <q-item-section avatar>-->
<!--                <q-icon :name="menuItem.icon" />-->
<!--              </q-item-section>-->
<!--              <q-item-section>-->
<!--                {{ $t(menuItem.label) }}-->
<!--              </q-item-section>-->
<!--            </q-item>-->
<!--            <q-separator :key="'sep' + index"  v-if="menuItem.separator" />-->
<!--          </template>-->

<!--        </q-list>-->
<!--      </q-scroll-area>-->
<!--    </q-drawer>-->
<!--    <q-page-container>-->
<!--      <router-view></router-view>-->
<!--    </q-page-container>-->
<!--    <Footer></Footer>-->
<!--  </q-layout>-->
</template>

<script>
import TopHeader from "components/header/topHeader";
import Footer from "components/footer/Footer";

export default {
  name: "MainLayouts",
  components: {
    TopHeader,
    Footer,
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    }
  },
  data() {
    return {
      drawer: false,
      tab: ''
    }
  },
}
</script>

<style lang="scss">
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
