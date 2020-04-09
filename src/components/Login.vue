<template>
  <div class="login_container">
      <div class="login_box">
        <!-- 头像 -->
        <div class="avatar_box">
          <img src="../assets/logo.png" alt="">
        </div>
        <!-- 表单 -->
        <el-form ref="LoginFormRef" :model="loginForm" label-width="0" :rules="LoginFormRules" class="login_form">
          <el-form-item prop="account">
            <el-input v-model="loginForm.account" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>  
      </div>
  </div>
</template>

<script>
import { aes } from "../util/signCrypto.js";

export default {
    data() {
      return {
        loginForm:{
          account:'admin',
          password:'123456'
        },
        LoginFormRules:{
          account:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      resetLoginForm() {
        this.$refs.LoginFormRef.resetFields()
      },
      login() {
        this.$refs['LoginFormRef'].validate(async (valid) => {
          if (valid) {
            let parme = {
              account: this.loginForm.account,
              password: aes.en(this.loginForm.password)
            }
            const {data:res} = await this.$http.post('/api/login.pub',parme)
						
            console.log(res)
            if (res.code=="0000"){
              this.$message({
                message:'登录成功',
                type:'success'
              })
              window.sessionStorage.setItem('token',res.data.token);
              this.$router.push('/home')
            }else{
              this.$message({
                message: res.msg,
                type:'error'
              })
            }
          } else {
            return false
          }
        })
      }
    }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}

.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%)
}

.avatar_box{
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content:flex-end;
}
</style>>

