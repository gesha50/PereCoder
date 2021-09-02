<template>
  <q-footer class="footer bg-white text-grey-9">
<!--    <div style="max-width: 300px; margin: 20px auto">-->
<!--      <div class="q-mt-sm row justify-around">-->
<!--        <a href="tel:+79175433952">-->
<!--          <custom-icon-->
<!--            :icon="'phone'"-->
<!--          ></custom-icon>-->
<!--        </a>-->
<!--        <a href="https://github.com/gesha50?tab=repositories" target="_blank">-->
<!--          <custom-icon-->
<!--            :icon="'fab fa-github'"-->
<!--          ></custom-icon>-->
<!--        </a>-->
<!--        <a href="https://www.instagram.com/gesha50/" target="_blank">-->
<!--          <custom-icon-->
<!--            :icon="'fab fa-instagram'"-->
<!--          ></custom-icon>-->
<!--        </a>-->
<!--        <a href="https://tlgg.ru/@dev_gesha" target="_blank">-->
<!--          <custom-icon-->
<!--            :icon="'fab fa-telegram-plane'"-->
<!--          ></custom-icon>-->
<!--        </a>-->
<!--      </div>-->
<!--    </div>-->
  </q-footer>
</template>
<script>
import CustomIcon from "components/icon/CustomIcon";

export default {
  name: "Footer",
  components: {
    CustomIcon,
  }
}
</script>

<style lang="scss">

  .footer__text {
    font-family: Red Hat Display;
    font-style: normal;
    font-weight: 500;
    font-size: 36px;
    line-height: 48px;
    justify-content: center;
  }
</style>
