<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员</el-breadcrumb-item>
      <el-breadcrumb-item>管理员设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="userlist" border stripe style="width: 100%">
        <el-table-column align="center" prop="nickName" label="昵称"></el-table-column>
        <el-table-column align="center" prop="account" label="登陆帐号"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createDate"></el-table-column>
        <el-table-column align="center" label="操作">
          <!-- 编辑用户 -->
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog" size="mini">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改账户密码"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="newUserInfo"
        :rules="addUserFormRules"
        ref="userFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item required label="帐号" prop="account">
          <el-input v-model="newUserInfo.account" @input="handleChange($event)"></el-input>
        </el-form-item>
        <el-form-item required label="密码" prop="pwd">
          <el-input v-model="newUserInfo.pwd"  type="password"></el-input>
        </el-form-item>
        <el-form-item required label="确认密码" prop="pwd">
          <el-input v-model="newUserInfo.confirmPwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { aes } from "../../util/signCrypto.js";
export default {
  data() {
    return {
      userlist: [],
      newUserInfo: {
        account: "",
        pwd: "",
        confirmPwd: ""
      },
      editDialogVisible: false,
      addUserFormRules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            require: true,
            min: 5,
            max: 10,
            message: "用户名长度在 5 到 10 个字符",
            trigger: "blur"
          }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            require: true,
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //解决Input  无法输入
    handleChange(){
      this.$forceUpdate()
    },
    //点击修改按钮
    showEditDialog() {
      this.editDialogVisible = true;
      this.newUserInfo.account = this.userlist[0].account
    },
    //dialog关闭钩子
    editDialogClosed() {
      
      this.newUserInfo = {}
    },
    //确定按钮
    editUser() {
      this.$refs.userFormRules.validate(async valid=>{
        if(!valid) {
          return this.$message.error('请先填写必填项！')
        }
        if(this.newUserInfo.pwd != this.newUserInfo.confirmPwd) {
          return this.$message.error('两次密码不一致！')
        }
        let parm = {
          account: this.newUserInfo.account,
          pwd: aes.en(this.newUserInfo.pwd),
          confirmPwd: aes.en(this.newUserInfo.confirmPwd)
        }
        const {data:res} = await this.$http.post("/api/user/resetPwd",parm);
        console.log(res)
        if(res.code != "0000") return this.$message.error('密码修改失败，请稍后再试')
        this.$message.success('密码修改成功！！')
        if(this.userlist[0].account != this.newUserInfo.account) {
          localStorage.removeItem("token");
          this.$router.push("/login");
          return
        }
        // this.getUserList()
        this.editDialogVisible = false;
      })
    },

    //请求列表数据
    async getUserList() {
      const { data: res } = await this.$http.post("/api/user/list");
      if (res.code != "0000") {
        return this.$message({
          message: "获取数据失败，请稍后刷新页面",
          type: "error"
        });
      }
      this.userlist = res.data;
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="less" scoped></style>
