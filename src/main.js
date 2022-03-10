import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes,
  mode:'history'
})

router.beforeEach((to, from, next) => {
  console.log("beforeEach执行！")
  //NProgress.start();
  console.log('topath',to.params)
  console.log('frompath',from.params)
  console.log('ggggggg',window.location.href)
  
  // code参数拦截跳转登录
  if (to.query.code){
    // alert(to.query.code)
    axios.get('https://api.haomoai.com/auth/ramlogin?uri=http://127.0.0.1:8080/&code=' + to.query.code)
    .then(res=>{
      let userName = res.data.username
      let token = res.data.token
      localStorage.setItem("userName",userName)
      localStorage.setItem("token",token)
      // alert(userName)
      next({path:'/indexNav'})
    })
    .catch(err=>{
      console.log(err)
      alert(err)
    })
  }

  // 首页跳转导航页
  if(to.path == '/') {
    next({path:'/indexNav'})
  }

  if (to.path == '/login') {
    // sessionStorage.removeItem('userName');
    localStorage.removeItem('userName');
    localStorage.removeItem('token')

  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  let user2 = localStorage.getItem('userName')

  if (!user2 && to.path != '/login') {
    next({ path: '/login' })
    // let ram_url = "https://api.haomoai.com/auth/ramlogin?uri=" + ("http://127.0.0.1:8080/");
    // console.log(ram_url)
    // axios.get(ram_url)
    // .then(res=>{
    //   console.log("测试ramurl")
    //   let res_url= res.data.url
    //   console.log(res_url)
    //   // alert(1)
    //   window.location.href = res_url
    // })
    // .catch(err=>{
    //   console.log(1234)
    //   console.log(err)
    // })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

