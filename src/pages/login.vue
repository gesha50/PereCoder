<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div
          id="particles-js"
          :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
        ></div>
        <q-btn
          color="white"
          class="absolute-top-right"
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <q-card
          class="login-form"
          v-bind:style="
            $q.platform.is.mobile ? { width: '80%' } : { width: '30%' }
          "
        >
          <q-img src="/statics/images/pharmacy.jpg"></q-img>
          <q-card-section>
            <q-avatar
              size="74px"
              class="absolute"
              style="top: 0;right: 25px;transform: translateY(-50%);"
            >
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                Log in to Dashboard
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                filled
                v-model="email"
                name="email"
                type="email"
                label="Username"
                lazy-rules
                autocomplete="email"
              />

              <q-input
                type="password"
                filled
                name="password"
                v-model="password"
                label="Password"
                lazy-rules
                autocomplete="current-password"
              />

              <div>
                <q-btn
                  label="Login"

                  type="button"
                  color="primary"
                  @click="login"
                />

                <a
                  style="font-size: 30px;"
                  class="float-right"
                  href="https://github.com/sponsors/mayank091193"
                  target="_blank"
                  title="Donate"
                  ><i class="fas fa-heart" style="color: #eb5daa"></i
                ></a>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
              email: '',
              password: ''
            }
        },
      computed: {
        ...mapGetters({
          getStyle: 'style/getStyle',
        }),
      },
        methods: {
           login(){
             this.$store
               .dispatch('auth/login', {
                 email: this.email,
                 password: this.password
               })
               .then(() => {
                 this.$q.notify({
                   message: 'Login Successful',
                 })
                 this.$router.push('/dashboard')
               })
               .catch(err => {
                 console.log(err)
                 this.$q.notify({
                   message: 'Login False!',
                 })
               })
           }
         },
        mounted() {
            particlesJS("particles-js", this.getStyle);
        }
    }
</script>

<style scoped>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%);
}
.dark_gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}
.login-form {
  position: absolute;
}
</style>
