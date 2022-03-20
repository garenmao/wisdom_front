<template>
  <el-header>
    <el-row align="middle" type="flex">
      <el-col :span="16">
        <div class="grid-content">
          <img style="margin: 0px 80px" :src="require('@/assets/logo.png')">
        </div>
      </el-col>
      <el-col :span="8">
        <el-row>
          <router-link to="/index">
            <el-col :span="6">
              <span>首页</span>
              <el-divider direction="vertical"></el-divider>
            </el-col>
          </router-link>
          <router-link to="/coursePage">
            <el-col :span="6">
              <span>课程</span>
              <el-divider direction="vertical"></el-divider>
            </el-col>
          </router-link>
          <router-link to="/userCenter">
            <el-col :span="6">
              <span>个人中心</span>
              <el-divider direction="vertical"></el-divider>
            </el-col>
          </router-link>
          <div v-show="userInfo.isLogin === false">
            <router-link to="/studentLogin">
              <el-col :span="6">
                <span>登录/注册</span>
              </el-col>
            </router-link>
          </div>
          <div v-show="userInfo.isLogin === true">
            <el-col :span="6">
              <el-dropdown>
                <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>
                <span class="el-dropdown-link">
                  {{ userInfo.name }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <router-link to="/userCenter">个人中心</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
export default {
  props: ['userInfoPop'],
  name: 'Header',
  data () {
    return {
      userInfo: {
        isLogin: false
      }
    }
  },
  methods: {
    getUserInfo () {
      if (localStorage.getItem('token') === null) {
        this.userInfo.isLogin = false
      } else {
        this.$axios.get('/user/detail').then(res => {
          this.userInfo = res.data.data
          this.userInfo.isLogin = true
        })
      }
    },
    logout () {
      this.$axios.post('/user/logout').then(res => {
        localStorage.clear()
        sessionStorage.clear()
        this.userInfo = {}
        this.userInfo.isLogin = false
        this.$router.push('/studentLogin')
      })
    }
  },
  created () {
    debugger
    this.getUserInfo()
    this.$store.commit('SET_USERTYPE', 'student')
  },
  watch: {
    userInfoPop: function (val) {
      console.log(this.userInfoPop)
      this.userInfo = this.userInfoPop
    }
  }
}
</script>

<style scoped>
.el-header {
  height: 60px;
  background: #fff;
  box-shadow: 0px 2px 5px #ebebeb;
  z-index: 10;
  position: relative;
  min-width: 1220px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
