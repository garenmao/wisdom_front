<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :xl="6" :lg="7">
      <div class="">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="登录" name="login">
            <div v-if="isLogin === true">
              <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
                <el-form-item label="邮箱" prop="email" style="width: 380px;">
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
                  <el-button type="primary" @click="loginSubmit">登录</el-button>
                  <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="注册" name="signIn">
            <div v-if="isLogin === false">
              <el-form :model="registerForm" :rules="registerRules" ref="loginForm" label-width="80px">
                <el-form-item label="邮箱" prop="email" style="width: 380px;">
                  <el-input v-model="registerForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNo" style="width: 380px;">
                  <el-input v-model="registerForm.phoneNo"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name" style="width: 380px;">
                  <el-input v-model="registerForm.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="resource">
                  <el-radio v-model="registerForm.gender" :label='true'>男</el-radio>
                  <el-radio v-model="registerForm.gender" :label='false'>女</el-radio>
                </el-form-item>
                <el-form-item label="密码" prop="passWord" style="width: 380px;">
                  <el-input v-model="registerForm.passWord" type="passWord"></el-input>
                </el-form-item>
                <el-form-item label="确认密码密码" prop="passWordSecond" style="width: 380px;">
                  <el-input v-model="registerForm.passWordSecond" type="passWord"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="registerFormSubmit">注册</el-button>
                  <el-button @click="resetForm('registerForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>

  </el-row>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      activeName: 'login',
      isLogin: true,
      loginForm: {
        email: '',
        passWord: '',
        code: '',
        loginForm: '',
        randomCode: ''
      },
      registerForm: {
        email: '',
        name: '',
        gender: 1,
        phoneNo: '',
        passWord: '',
        passWordSecond: ''
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
      registerRules: {
        email: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        phoneNo: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        passWord: [
          {required: true, message: '请选择密码', trigger: 'blur'}
        ],
        passWordSecond: [
          {required: true, message: '请选择密码', trigger: 'blur'}
        ]
      },
      captchaImg: null
    }
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'login') {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    },
    getCaptcha () {
      this.$axios.get('/captcha').then(res => {
        this.loginForm.randomCode = res.data.data.randomCode
        this.captchaImg = res.data.data.captchaImg
        this.loginForm.code = ''
      })
    },
    loginSubmit () {
      this.$axios.post('/user/login', {
        'data': this.loginForm
      }).then(res => {
        const jwt = res.data.data.token
        this.$store.commit('SET_TOKEN', jwt)
        this.$store.commit('SET_USERTYPE', 'student')
        this.$emit('userInfo')
        this.$router.push('/index')
      })
    },
    refreshLoginUser () {
      this.$emit('userInfo')
    },
    registerFormSubmit () {
      this.$axios.put('/user/signIn', {
        'data': this.registerForm
      }).then(res => {
        debugger
        if (res.data.code === 200) {
          this.isLogin = true
          this.loginForm.email = this.registerForm.email
          this.registerForm = {}
        } else {
          alert(res.data.message)
        }
      })
    },
    resetForm (type) {
      if (type === 'loginForm') {
        this.loginForm = {}
      }
      if (type === 'registerForm') {
        this.registerForm = {}
      }
    }
  },
  created () {
    this.refreshLoginUser()
    this.getCaptcha()
    this.$store.commit('SET_USERTYPE', 'student')
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
</style>
