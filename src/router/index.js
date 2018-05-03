import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: resolve => require(['@/components/Login'], resolve)
    },
    {path: '/labStatus',
      component: resolve => require(['@/components/Home'], resolve),
      meta: {requiresAuth: true},
      children: [
        {
          path: '/',
          component: resolve => require(['@/components/page/LabStatus'], resolve),
          meta: {requiresAuth: true}
        }
      ]}]
})
