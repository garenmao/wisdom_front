<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :xl="6" :lg="7">
      <h2>Java在线教育平台后台系统</h2>
      <el-image :src="require('@/assets/img.png')" style="height: 180px; width: 180px;"></el-image>
      <p>凡有所学 皆有所得</p>

    </el-col>

    <el-col :span="1">
      <el-divider direction="vertical"></el-divider>
    </el-col>
    <el-col :xl="6" :lg="7">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="email" style="width: 380px;">
          <el-input v-model="loginForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord" style="width: 380px;">
          <el-input v-model="loginForm.passWord" type="passWord"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" style="width: 380px;">
          <el-input v-model="loginForm.code" style="width: 172px; float: left" maxlength="5"></el-input>
          <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

</template>

<script>
// import comment from '@/components/Comment'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        email: '',
        passWord: '',
        code: '',
        loginForm: '',
        randomCode: ''
      },
      rules: {
        email: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        passWord: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur'}
        ]
      },
      captchaImg: null
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        const axios = this.$axios
        if (valid) {
          axios.post('/user/login', {
            'data': this.loginForm
          }).then(res => {
            const jwt = res.data.data.token
            this.$store.commit('SET_TOKEN', jwt)
            this.$store.commit('SET_USERTYPE', 'admin')
            axios.get('/menu/listAllMenu').then(r => {
              this.$store.commit('setMenuList', JSON.stringify({submenu: r.data.data}))
              this.$router.push('/sys/index')
            })
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getCaptcha () {
      this.$axios.get('/captcha').then(res => {
        this.loginForm.randomCode = res.data.data.randomCode
        this.captchaImg = res.data.data.captchaImg
        this.loginForm.code = ''
      })
    }
  },
  created () {
    this.getCaptcha()
    this.$store.commit('SET_USERTYPE', 'admin')
  }
}
</script>

<style scoped>

.el-row {
  background-color: #fafafa;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.el-divider {
  height: 200px;
}

.captchaImg {
  float: left;
  margin-left: 8px;
  border-radius: 4px;
}

</style>
