<template>
  <el-container>
    <Header :userInfoPop="userInfo" @userInfo="refreshUser"></Header>
    <el-main>
      <div style="margin: 0 15px;">
        <router-view @userInfo="refreshUser"/>
      </div>
    </el-main>
    <el-footer>
      <el-divider></el-divider>
      <el-row type="flex" justify="center">
        <el-col :span="5"><span>©1997-2022 Java在线教育平台 版权所有</span></el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import Header from './header/Header'

export default {
  data () {
    return {
      userInfo: {
        isLogin: false
      }
    }
  },
  name: 'PageIndex',
  components: {Header},
  methods: {
    refreshUser () {
      if (localStorage.getItem('token') === null) {
        this.userInfo.isLogin = false
      } else {
        this.$axios.get('/user/detail').then(res => {
          this.userInfo = res.data.data
          this.userInfo.isLogin = true
        })
      }
    }
  }
}
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}
</style>
