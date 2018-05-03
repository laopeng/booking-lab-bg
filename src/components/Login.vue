<template>
  <div class="login-wrap">
    <div class="ms-title">预约实验室后台管理系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="ruleForm.password"
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn-submit" type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button type="danger" :plain="true" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default{
  data () {
    return {
      tokenUrl: this.$baseUrl + '/token',
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      loading: false
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.get(this.tokenUrl, {params: {username: this.ruleForm.username, password: this.ruleForm.password}}).then((res) => {
            sessionStorage.setItem('token', res.data.access_token)
            sessionStorage.setItem('username', this.ruleForm.username)
            this.$router.push('/labStatus')
            this.$message.success('登录成功')
          }).catch((error) => {
            console.debug(error)
            if (error.response.status === 400) {
              this.$message.warning('帐号或密码错误')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .login-wrap {
    width: 100%;
    height: 100%;
  }

  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
  }

  .login-btn-submit {
    width: 210px;
  }
</style>
