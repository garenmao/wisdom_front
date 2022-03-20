import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Index from '../views/Index'
import UserCenter from '../views/UserCenter'
import CourseList from '../views/course/CourseList'
import Subject from '../views/course/Subject'
import Video from '../views/course/VideoList'
import PageHome from '../views/page/PageHome'
import PageIndex from '../views/page/Index'
import CoursePage from '../views/page/CoursePage'
import VideoPage from '../views/page/VideoPage'
import StudentLogin from '../views/page/StudentLogin'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/sys/index',
        name: 'Index',
        meta: {
          title: '首页'
        },
        component: Index
      },
      {
        path: '/sys/userCenter',
        name: 'UserCenter',
        meta: {
          title: '个人中心'
        },
        component: () => import('@/views/UserCenter.vue')
      },
      {
        path: '/sys/users',
        name: 'User',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/sys/User.vue')
      },
      {
        path: '/sys/subjectManger',
        name: 'subject',
        meta: {
          title: '课程主题'
        },
        component: Subject
      },
      {
        path: '/sys/courseManger',
        name: 'list',
        meta: {
          title: '课程发布'
        },
        component: CourseList
      },
      {
        path: '/Video/:courseId',
        name: 'VideoList',
        meta: {
          title: '课程章节'
        },
        component: Video,
        props: true
      },
      {
        path: '/sys/dataDashboard',
        name: 'DashBoard',
        meta: {
          title: '数据看板'
        },
        component: Index
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/page',
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
