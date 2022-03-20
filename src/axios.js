import axios from 'axios'
import router from './router'
import Element from 'element-ui'
import global from './components/Comment'

axios.defaults.baseURL = global.httpUrl

const request = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

request.interceptors.request.use(config => {
  if (localStorage.getItem('token') === null) {
    config.headers['Authorization'] = ''
  } else {
    config.headers['Authorization'] = localStorage.getItem('token')
  }
  return config
})

request.interceptors.response.use(
  response => {
    console.log('response ->' + response)

    const userType = localStorage.getItem('userType')
    let res = response.data
    if (res.code === 200) {
      return response
    } else if (res.code === 401) {
      if (userType === 'student') {
        router.push('/studentLogin')
      } else {
        router.push('/login')
      }
    } else {
      Element.Message.error(!res.msg ? '系统异常' : res.msg)
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    const userType = localStorage.getItem('userType')
    if (error.response.data.code === 400 || error.response.data.code === 401 || error.response.data.code === 402 || error.response.data.code === 403 || error.response.data.code === 404) {
      Element.Message.error(!error.response.data.message ? '系统异常' : error.response.data.message)
    } else {
      if (error.response.data) {
        error.massage = error.response.data.msg
      }

      if (error.response.status === 401) {
        if (userType === 'student') {
          router.push('/page')
        } else {
          router.push('/login')
        }
      }

      Element.Message.error(error.massage, {duration: 3000})
      return Promise.reject(error)
    }
  }
)

export default request
