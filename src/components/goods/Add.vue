<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{addForm.gdsId?"编辑商品" : "添加商品"}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form
        class="el_from"
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        label-position="left"
      >
        <div class="title">产品基本信息:</div>
        <el-form-item required label="产品类别" prop="cateId">
          <el-cascader
            class="cascader"
            clearable
            v-model="cascaderId"
            :options="catelist"
            :props="cascaderProp"
            @change="handleCateChange"
          />
        </el-form-item>

        <el-form-item label="产品属性" prop="type">
          <el-select class="cascader" v-model="addForm.type" clearable placeholder="请选择">
            <el-option  v-for="item in typeList" :key="item.val" :label="item.lab" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="产品标题" prop="name">
          <el-input v-model="addForm.name" style="width:500px" />
        </el-form-item>
        <el-form-item required label="产品价格" prop="price">
          <el-input v-model="addForm.price" :maxlength="7" style="width:500px" type="number" />
        </el-form-item>
        <el-form-item required label="产品主图" prop="img">
          <upload :initType="productInitType" @sendImgUrl="getProductImg" @delImg="delProductImg" />
        </el-form-item>
        <div class="comWordls">只支持IPG,JPEG,PNG格式;图片不大于2MB。尺寸：1248*800。</div>
        <el-form-item required label="产品特征" prop="gdsFeature">
          <el-input v-model="addForm.gdsFeature" type="textarea" rows="8" style="width:500px" />
        </el-form-item>
        <el-form-item label="推荐到主页">
          <el-switch
            v-model="addForm.putaway"
            @change="getPutaway"
            active-color="#5fb878"
            inactive-color="#999"
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>
      </el-form>

      <el-form :inline="true" class="el_from" label-width="120px" label-position="left">
        <div class="title">产品详情图:</div>

        <el-form-item required label="第一张：" prop="detailImg">
          <upload :initType="detailInitType1" @sendImgUrl="getDetailImg1" @delImg="delDetailImg1" />
        </el-form-item>
        <div class="fenge"></div>
        <el-form-item label="第二张：">
          <upload :initType="detailInitType2" @sendImgUrl="getDetailImg2" @delImg="delDetailImg2" />
        </el-form-item>
        <div class="fenge"></div>
        <el-form-item label="第三张：">
          <upload :initType="detailInitType3" @sendImgUrl="getDetailImg3" @delImg="delDetailImg3" />
        </el-form-item>
        <div class="fenge"></div>
        <el-form-item label="第四张：">
          <upload :initType="detailInitType4" @sendImgUrl="getDetailImg4" @delImg="delDetailImg4" />
        </el-form-item>
        <div class="fenge"></div>
        <el-form-item label="第五张：">
          <upload :initType="detailInitType5" @sendImgUrl="getDetailImg5" @delImg="delDetailImg5" />
        </el-form-item>
        <div class="comWordls">上传至少一张产品详情图片。按顺序上传,否则在官网页面上排列显示会不正常。尺寸：1248*800。</div>

        <div class="title">产品基本参数:</div>
        <div>
          <el-form-item label="Model Number:">
            <el-input v-model="addForm.modelNumber" style="width:300px" />
          </el-form-item>
          <div class="fenge"></div>
          <el-form-item label="Texture:">
            <el-input v-model="addForm.texture" style="width:300px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Thickness:">
            <el-input v-model="addForm.thickness" style="width:300px" />
          </el-form-item>
          <div class="fenge"></div>
          <el-form-item label="Width:">
            <el-input v-model="addForm.width" style="width:300px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Color:">
            <el-input v-model="addForm.color" style="width:300px" />
          </el-form-item>
          <div class="fenge"></div>
          <el-form-item label="Feature:">
            <el-input v-model="addForm.feature" style="width:300px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Backing:">
            <el-input v-model="addForm.backing" style="width:300px" />
          </el-form-item>
          <div class="fenge"></div>
          <el-form-item label="Composition:">
            <el-input v-model="addForm.composition" style="width:300px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Weight:">
            <el-input v-model="addForm.weight" style="width:300px" />
          </el-form-item>
          <div class="fenge"></div>
          <el-form-item label="MOQ:">
            <el-input v-model="addForm.moq" style="width:300px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Use:">
            <el-input v-model="addForm.purpose" style="width:300px" />
          </el-form-item>
          <div class="fenge"></div>
          <el-form-item label="Packing:">
            <el-input v-model="addForm.packing" style="width:300px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Port:">
            <el-input v-model="addForm.port" style="width:300px" />
          </el-form-item>
          <div class="fenge"></div>
          <el-form-item label="Delivery time:">
            <el-input v-model="addForm.deliveryTime" style="width:300px" />
          </el-form-item>
        </div>
      </el-form>
      <div class="btnAdd">
        <el-button class="saveBtn" type="primary" @click="saveInfo">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import upload from "../upload/imgUpload";
export default {
  components: {
    upload
  },
  data() {
    return {
      productInitType: { limit: 1, multiple: false, type: "2", fileList: [] },
      detailInitType1: { limit: 1, multiple: false, type: "2", fileList: [] },
      detailInitType2: { limit: 1, multiple: false, type: "2", fileList: [] },
      detailInitType3: { limit: 1, multiple: false, type: "2", fileList: [] },
      detailInitType4: { limit: 1, multiple: false, type: "2", fileList: [] },
      detailInitType5: { limit: 1, multiple: false, type: "2", fileList: [] },
      catelist: [], //分类列表
      typeList: [], //属性列表
      putaway: false, //是否推荐到首页
      addForm: {
        gdsId: "",
        cateId: "", //2级分类ID
        type: "", //属性
        name: "", //产品名字
        img: "", //主图
        gdsFeature: "", //特征
        price: "", //价格
        putaway: 1, //是否推荐
        detailImg: [],
      },
      cascaderId: "",
      cascaderProp: {
        // checkStrictly: true,
        expandTrigger: "hover",
        value: "cateId",
        label: "name",
        children: "children"
      },
      addFormRules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        gdsFeature: [
          { required: true, message: "请输入商品特征", trigger: "blur" }
        ],
        img: [
          {
            required: true,
            message: "请上传图片，或等待图片上传完成",
            trigger: "blur"
          }
        ],
        cateId: [
          { required: true, message: "请选择产品类别", trigger: "blur" }
        ],
        // type: [{ required: true, message: "请选择产品属性", trigger: "blur" }],
        detailImg: [
          { required: true, message: "请至少上传一张图片", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //获取产品主图地址
    getProductImg(img) {
      this.addForm.img = img;
    },
    //删除产品主图
    delProductImg() {
      this.addForm.img = "";
    },
    //得到2级分类ID
    handleCateChange(e) {
      this.addForm.cateId = e[1];
     
    },
    //是否推荐到首页
    getPutaway(e) {
      // if (e) {
      //   this.addForm.putaway = 0;
      // } else {
      //   this.addForm.putaway = 1;
      // }
      console.log(this.addForm.putaway)
      console.log(e)

    },
    //保存按钮
    saveInfo() {
      // console.log(this.addForm);
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请先填写必填项！");
        }
        if (!this.addForm.gdsId) {
          //新增商品
          const { data } = await this.$http.post("/api/gds/save", this.addForm);
          if (data.code !== "0000") return this.$message.error(data.msg);
          this.$message.success("添加商品成功");
        } else {
          //编辑商品
          const { data } = await this.$http.post(
            "/api/gds/update",
            this.addForm
          );
          if (data.code !== "0000") return this.$message.error(data.msg);
          this.$message.success("编辑商品成功");
        }

        this.$router.push("/goods");
      });
    },
    /************获取产品详情图片 *****/
    getDetailImg1(img) {
      this.addForm.detailImg[0] = img;
    },
    getDetailImg2(img) {
      this.addForm.detailImg[1] = img;
    },
    getDetailImg3(img) {
      this.addForm.detailImg[2] = img;
    },
    getDetailImg4(img) {
      this.addForm.detailImg[3] = img;
    },
    getDetailImg5(img) {
      this.addForm.detailImg[4] = img;
    },
    /************删除详情图片 *****/
    delDetailImg1() {
      this.addForm.detailImg[0] = "";
    },
    delDetailImg2() {
      this.addForm.detailImg[1] = "";
    },
    delDetailImg3() {
      this.addForm.detailImg[2] = "";
    },
    delDetailImg4() {
      this.addForm.detailImg[3] = "";
    },
    delDetailImg5() {
      this.addForm.detailImg[4] = "";
    },

    //获取分类数据
    async getCateList(gdsId) {
      const { data } = await this.$http.post("/api/gds/category/list");
      if (data.code !== "0000") return this.$message.error(data.msg);
      this.catelist = data.data;
      this.catelist.forEach(item => {
        item.children.forEach(i => {
          delete i.children;
        });
      });
      
      //如果是编辑状态获取产品详情
      if (!gdsId) return;
      const { data: res } = await this.$http.post("/api/gds/detail", gdsId);
      if (data.code !== "0000") return this.$message.error(res.msg);
      this.addForm = res.data;

      var findCate;
      this.catelist.forEach(item => {
        item.children.forEach(i => {
          if (i.cateId == this.addForm.cateId) {
            findCate = item.cateId;
          }
        });
      });
      this.cascaderId = [findCate, this.addForm.cateId];
      this.productInitType.fileList = [
        { url: this.addForm.ossUrl + this.addForm.img }
      ];
      this.detailInitType1.fileList = [
        { url: this.addForm.ossUrl + this.addForm.detailImg[0] }
      ];
      if (!this.addForm.detailImg[1]) return;
      this.detailInitType2.fileList = [
        { url: this.addForm.ossUrl + this.addForm.detailImg[1] }
      ];
      if (!this.addForm.detailImg[2]) return;
      this.detailInitType3.fileList = [
        { url: this.addForm.ossUrl + this.addForm.detailImg[2] }
      ];
      if (!this.addForm.detailImg[3]) return;
      this.detailInitType4.fileList = [
        { url: this.addForm.ossUrl + this.addForm.detailImg[3] }
      ];
      if (!this.addForm.detailImg[4]) return;
      this.detailInitType5.fileList = [
        { url: this.addForm.ossUrl + this.addForm.detailImg[4] }
      ];
    },
    //获取属性数据
    async getTypeList() {
      const { data } = await this.$http.post("/api/gds/category/findLevel", 1);
      if (data.code !== "0000") return this.$message.error(data.msg);

      this.typeList = [
        { val: 0, lab: data.data.map[0] },
        { val: 1, lab: data.data.map[1] }
      ];
    }
  },
  created() {
    this.getTypeList();
    let gdsId = this.$route.query.gdsId;
    if (gdsId) {
      
      this.addForm.gdsId = gdsId;
      this.getCateList(gdsId);
    } else {
      this.getCateList();
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 20px;
  font-weight: bold;
  margin: 50px 0;
}
.el_from {
  padding: 0 100px;
}
.fenge {
  width: 60px;
  display: inline-block;
}
.btnAdd {
  margin: 100px 0;
  text-align: center;
}
.btnAdd .saveBtn {
  width: 150px;
}
.comWordls {
  font-size: 12px;
  color: #999;
  margin: 0px 0 50px 100px;
}
.cascader {
  width: 300px;
}

</style>
