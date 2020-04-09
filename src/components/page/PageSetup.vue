<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>页面设置</el-breadcrumb-item>
      <el-breadcrumb-item>{{activeName}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <!-- 公司简介 -->
      <el-tab-pane label="公司简介" name="公司简介">
        <div class="title">关于我们:</div>
        <el-form label-position="right" label-width="100px">
          <el-form-item required label="上传图片">
            <upload :initType="aboutInitType" @sendImgUrl="getAboutImg" @delImg="delAboutImg" />
          </el-form-item>
          
          <el-form-item required label="公司介绍">
            <quill-editor v-model="companyInfo.introduction" :options="editorOption"></quill-editor>
          </el-form-item>
        </el-form>
        <div class="btnAdd">
          <el-button class="saveBtn" type="primary" @click="saveCompanyInfo">保存</el-button>
        </div>
      </el-tab-pane>
      <!-- 顶部 -->
      <el-tab-pane label="顶部" name="顶部">
        <div class="title">基本信息:</div>
        <el-form label-position="left" label-width="150px">
          <el-form-item required label="公司简称">
            <el-input v-model="companyInfo.abbreviation" style="width:500px" />
          </el-form-item>
          <el-form-item required label="上传LOGO图片">
            <upload :initType="LogoInitType" @sendImgUrl="getLogoImg" @delImg="delLogoImg" />
          </el-form-item>
        </el-form>

        <div class="btnAdd">
          <el-button class="saveBtn" type="primary" @click="saveLogoInfo">保存</el-button>
        </div>
      </el-tab-pane>
      <!-- 底部 -->
      <el-tab-pane label="底部" name="底部">
        <div class="title">联系方式:</div>
        <el-form
          :model="companyInfo"
          :rules="editUserFormRules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item required label="Phone">
            <el-input v-model="companyInfo.phone" style="width:700px" />
          </el-form-item>
          <el-form-item required label="Email" prop="email">
            <el-input v-model="companyInfo.email" style="width:700px"/>
          </el-form-item>
          <el-form-item required label="Address">
            <el-input v-model="companyInfo.address" style="width:700px"/>
          </el-form-item>
          <el-form-item required label="公司名称">
            <el-input v-model="companyInfo.copyright" style="width:700px" />
          </el-form-item>
        </el-form>
        <div class="btnAdd">
          <el-button class="saveBtn" type="primary" @click="saveBottomInfo">保存</el-button>
        </div>
      </el-tab-pane>
      <!-- 联系我们 -->
      <el-tab-pane label="联系我们" name="联系我们">
        <div class="title">联系我们:</div>
        <el-form label-position="right" label-width="100px">
          <el-form-item required label="上传地图">
            <upload
              :initType="contactInitType"
              @sendImgUrl="getContactImg"
              @delImg="delContactImg"
            />
          </el-form-item>
        </el-form>

        <div class="btnAdd">
          <el-button class="saveBtn" type="primary" @click="saveContactInfo">保存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import upload from "../upload/imgUpload";
export default {
  components: {
    upload
  },
  data() {
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, cb) => {
      const regEail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    
    return {
      aboutInitType: { limit: 1, multiple: false, type: "1", fileList: [] },
      LogoInitType: { limit: 1, multiple: false, type: "1", fileList: [] },
      contactInitType: { limit: 1, multiple: false, type: "1", fileList: [] },
      activeName: "公司简介",
      companyInfo: {
        type: 0,
        copyright: '',
        name: "", //公司名字
        introduction: "", //简介
        introductionImg: "", //简介图
        logo: "", //logo
        abbreviation: "", //简称
        phone: "", //企业电话
        email: "", //邮箱
        address: "", //地址
        addressImg: "" //地址图
      },
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
            ["blockquote", "code-block"], //引用，代码块
            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: "ordered" }, { list: "bullet" }], //列表
            [{ script: "sub" }, { script: "super" }], // 上下标
            [{ indent: "-1" }, { indent: "+1" }], // 缩进
            [{ direction: "rtl" }], // 文本方向
            [{ size: ["small", false, "large", "huge"] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
             [{ 'font': [] }],     //字体
            [{ align: [] }], //对齐方式
             ['clean'],    //清除字体样式
            // ['image','video']    //上传图片、上传视频
          ]
        },
        theme: "snow"
      },
      editUserFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ]
       
      }
    };
  },
  methods: {
    //tab切换
    handleClick(tab) {
      this.activeName = tab.name;
      switch (tab.name) {
        case "公司简介":
          this.companyInfo.type = 0;
          break;
        case "顶部":
          this.companyInfo.type = 1;
          break;
        case "底部":
          this.companyInfo.type = 2;
          break;
        case "联系我们":
          this.companyInfo.type = 3;
          break;
      }
      
    },

    /**
     * ************公司简介************
     */
    //保存公司信息
    async saveCompanyInfo() {
       this.companyInfo.type = 0;
      if (!this.companyInfo.introductionImg) {
        return this.$message({ message: "请上传图片", type: "error" });
      }
      
      if (!this.companyInfo.introduction) {
        return this.$message({ message: "请填写公司介绍", type: "error" });
      }
      // this.$refs.StarUpload.submitUpload();
      const { data: res } = await this.$http.post(
        "/api/usr/cor/edit",
        this.companyInfo
      );

      if (res.code == "0000") {
        this.getCompanyInfo();
        return this.$message({
          message: "保存ABOUT页面数据成功",
          type: "success"
        });
      } else {
        this.$message({ message: "保存失败", type: "error" });
      }
    },
    //上传得到关于我们图片地址
    getAboutImg(img) {
      // console.log(img);
      this.companyInfo.introductionImg = img;
    },

    //删除图片
    delAboutImg() {
      this.companyInfo.introductionImg = "";
    },
    /**
     * *******************顶部*********************************************
     */
    //点击保存 Logo
    async saveLogoInfo() {
      this.companyInfo.type = 1;
      
      if (!this.companyInfo.logo) {
        return this.$message({ message: "请上传图片", type: "error" });
      }
      if (!this.companyInfo.abbreviation) {
        return this.$message({ message: "请填写公司简称", type: "error" });
      }
      console.log(this.companyInfo)
      const { data: res } = await this.$http.post(
        "/api/usr/cor/edit",
        this.companyInfo
      );
      if (res.code == "0000") {
        this.getCompanyInfo();
        return this.$message({ message: "保存Logo数据成功", type: "success" });
      } else {
        this.$message({ message: "保存失败", type: "error" });
      }
    },
    //上传接收LOGO 图片地址
    getLogoImg(img) {
      this.companyInfo.logo = img;
       console.log(this.companyInfo.logo)
    },
    //删除Logo 图片
    delLogoImg() {
      this.companyInfo.logo = "";
      console.log(this.companyInfo.logo)
    },
    /*****************底部保存***************** */
    async saveBottomInfo() {
       this.companyInfo.type = 2;
      if (!this.companyInfo.phone) {
        return this.$message({ message: "请填写手机号码", type: "error" });
      }
      if (!this.companyInfo.email) {
        return this.$message({ message: "请填写邮件地址", type: "error" });
      }
      if (!this.companyInfo.address) {
        return this.$message({ message: "请填写地址信息", type: "error" });
      }
      if (!this.companyInfo.copyright) {
        return this.$message({ message: "请填写公司名字", type: "error" });
      }
      const { data: res } = await this.$http.post(
        "/api/usr/cor/edit",
        this.companyInfo
      );
      if (res.code == "0000") {
        this.getCompanyInfo();
        return this.$message({ message: "保存底部数据成功", type: "success" });
      } else {
        this.$message({ message: "保存失败", type: "error" });
      }
    },
    /**
     * *************联系我们 ***************
     *
     */
    getContactImg(img) {
      this.companyInfo.addressImg = img;
    },
    delContactImg() {
      this.companyInfo.addressImg = "";
    },
    async saveContactInfo() {
       this.companyInfo.type = 3;
      if (!this.companyInfo.addressImg) {
        return this.$message({ message: "请上传地图图片", type: "error" });
      }
      const { data: res } = await this.$http.post(
        "/api/usr/cor/edit",
        this.companyInfo
      );
      if (res.code == "0000") {
        this.getCompanyInfo();
        return this.$message({ message: "保存地图成功", type: "success" });
      } else {
        this.$message({ message: "保存失败", type: "error" });
      }
    },
    /**
     * *************网络请求函数 ***************
     *
     */
    //请求后台原始数据
    async getCompanyInfo() {
      const { data: res } = await this.$http.post("/api/usr/cor/detail");
      // console.log(res);
      if (res.code != "0000") {
        return this.$message({ message: "获取数据失败", type: "error" });
      }

      this.companyInfo = {
        type: 0,
        ...res.data
      };
      //拼接about 图片
      if (res.data.introductionImg) {
        this.aboutInitType.fileList = [
          { url: res.data.properties.ossUrl + res.data.introductionImg }
        ];
      }
      //拼接logo 图片 contactInitType
      if (res.data.logo) {
        this.LogoInitType.fileList = [
          { url: res.data.properties.ossUrl + res.data.logo }
        ];
      }

      //拼接contact 图片 contactInitType
      if (res.data.addressImg) {
        this.contactInitType.fileList = [
          { url: res.data.properties.ossUrl + res.data.addressImg }
        ];
      }
    }
  },
  created() {
    //请求后台原始数据
    this.getCompanyInfo();
  }
};
</script>

<style lang="less" scoped>
.title {
  font-size: 26px;
  font-weight: bold;
  margin: 40px 0;
  color: #444;
}
.btnAdd {
  margin: 50px 100px;
  // text-align: center;
}
.btnAdd .saveBtn {
  width: 150px;
}
</style>



                            