<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公司环境图片</el-breadcrumb-item>
      <el-breadcrumb-item>公司环境图片管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="title">上传图片:</div>
      <div class="imgBox">
        <upload :initType="detailInitType" @sendImgUrl="getDetailImg" @delImg="delDetailImg" />
      </div>
      <div class="wordls">
        只支持JPG,JPEG,PNG格式;图片不大于2M;尺寸400*400;最多只能上传8张。
        <div style="margin-top:20px;">删除或者添加图片的操作完成时，需要点击保存，才能保存到服务器。</div>
      </div>
      <div class="btnAdd">
        <el-button class="saveBtn" type="primary" @click="saveInfo">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import upload from "../upload/imgUpload";
export default {
  components:{
    upload
  },
  data() {
    return {
      imgs: [],
      detailInitType: { limit: 8, multiple: true, type: "1", fileList: [] },
    };
  },
 methods:{
  //  上传得到图片
   getDetailImg(img) {
     this.imgs.push(img)
   },
   //删除图片
   delDetailImg(file) {
     let index; 
     this.imgs.forEach((item,i)=>{
       if(file.url.includes(item)) {
         index = i
       }
     })
     this.imgs.splice(index,1)
   },
   async saveInfo() {
     if(!this.imgs[0]) return this.$message.error("请上传至少一张图片")
     const {data} = await this.$http.post("/api/usr/env/save",this.imgs)
     if(data.code !== '0000') return this.$message.error(data.msg)
     this.getImgList()
      this.$message.success("图片保存成功")
   },
   async getImgList() {
     
     const {data} = await this.$http.post("/api/usr/env/list")
     if(data.code !== '0000') return this.$message.error(data.msg)
     this.detailInitType.fileList = []
     this.imgs = data.data.imgs;
      data.data.imgs.forEach(item=>{
        this.detailInitType.fileList.push({url: data.data.ossUrl + item})
      })
   },
 },
 created() {
   this.getImgList()
 }
};
</script>

<style lang="less" scoped>
.title {
  font-size: 26px;
  font-weight: bold;
  margin: 100px 0 70px 0;
}
.imgBox {
  text-align: center;
}
.wordls {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin: 60px 0;
}
.btnAdd {
  margin: 30px auto;
  text-align: center;
}
.btnAdd .saveBtn {
  width: 150px;
}
</style>
