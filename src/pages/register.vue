<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <Particles
          :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
          id="particles-js"
          :options="getStyle"
        />
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
                Register to Dashboard
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                filled
                v-model="name"
                name="name"
                type="name"
                label="name"
                lazy-rules
                autocomplete="username"
              />
              <q-input
                filled
                v-model="email"
                name="email"
                type="email"
                label="mail@mail.com"
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
                autocomplete="new-password"
              />
              <q-input
                type="password"
                filled
                name="confirmPassword"
                v-model="confirmPassword"
                label="Password"
                lazy-rules
                autocomplete="new-password"
              />

              <div>
                <q-btn
                  label="Register"
                  :disabled="samePassword"
                  type="button"
                  color="primary"
                  @click="register"
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

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  },
  computed: {
    getStyle() {
      return this.$store.getters['style/getStyle']
    },
    samePassword() {
      return !(this.password && this.confirmPassword && (this.password === this.confirmPassword));
    }
  },
  methods: {
    register () {
      this.$store
        .dispatch('auth/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push('/login')
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
}
</script>

<style>
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

