import Particles from "particles.vue";
import Vue from 'vue'

Vue.use(Particles)
// "async" is optional
export default async ({ app }) => {
  app.Particles = Particles
}
