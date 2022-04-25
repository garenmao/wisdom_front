import Vue from 'vue'
import Router from 'vue-router'
import UserCenter from '../views/UserCenter'
import PageHome from '../views/page/PageHome'
import PageIndex from '../views/page/Index'
import CoursePage from '../views/page/CoursePage'
import VideoPage from '../views/page/VideoPage'
import StudentLogin from '../views/page/StudentLogin'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Page',
    component: PageHome,
    redirect: '/index',
    children: [{
      path: '/index',
      name: 'PageIndex',
      meta: {
        title: '课程推荐'
      },
      component: PageIndex
    }, {
      path: '/coursePage',
      name: 'CoursePage',
      meta: {
        title: '课程首页'
      },
      component: CoursePage
    }, {
      path: '/videoPage/:courseId',
      name: 'VideoPage',
      meta: {
        title: '课程列表'
      },
      component: VideoPage
    }, {
      path: '/studentLogin',
      name: 'StudentLogin',
      meta: {
        title: '学生登录'
      },
      component: StudentLogin
    }, {
      path: '/userCenter',
      name: 'UserCenter',
      meta: {
        title: '用户中心'
      },
      component: UserCenter
    }]
  }
]

export default new Router({
  mode: 'history',
  routes
})
