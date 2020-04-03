<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页轮播图设置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addImg" type="primary">添加图片</el-button>
        </el-col>
      </el-row>

      <el-table align="center" :data="bannerList" border>
        <!-- <el-table-column align="center" type="index"></el-table-column> -->
        <el-table-column align="center" width="400" prop="img" label="轮播图片">
          <template v-slot="scope">
            <img class="table_img" :src="ossUrl + scope.row.img" alt />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sn" label="排序"></el-table-column>
        <el-table-column align="center" label="操作" width="450px">
          <template v-slot="scope">
            <el-button type="primary" @click="showSetRightDialog(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button
              type="danger"
              @click="removeRightById(scope.row.banId)"
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      title="新增/编辑"
      :visible.sync="setRightDialogVisible"
      @close="setRightDialogClosed"
      width="50%"
    >
      <el-form label-position="left" label-width="150px">
        <el-form-item label="图片排序号">
          <el-input v-model="sn" style="width:500px" />
        </el-form-item>
        <el-form-item>
          <div class="worlds">填写1~5的数字，数字越小图片越前。</div>
        </el-form-item>
        <el-form-item required label="上传轮播图片">
          <upload :initType="bannerInitType" @sendImgUrl="getBannerImg" @delImg="delBannerImg" />
        </el-form-item>

        <el-form-item>
          <div class="worlds">只支持JPG,JPEG,PNG格式;图片不大于5MB;尺寸1920*820。</div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </div>
    </el-dialog>
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
      bannerInitType: { limit: 1, multiple: false, type: "2", fileList: [] },
      ossUrl: "",
      bannerList: [],
      img: "",
      sn: "",
      handleType: "", //操作类型 0 为新增，1为编辑
      editId: "", //记录编辑状态的图片ID
      setRightDialogVisible: false
    };
  },
  methods: {
    //添加图片按钮
    addImg() {
      this.handleType = 0;
      if (this.bannerList.length >= 5) {
        return this.$message({
          type: "error",
          message: "轮播图片不能超过5张!"
        });
      }
      this.setRightDialogVisible = true;
    },
    //确定按钮
    async allotRights() {
      if (!this.img) {
        return this.$message({
          type: "error",
          message: "请上传图片!"
        });
      }
      let parm = {
        img: this.img,
        sn: this.sn,
        banId: this.editId
      };
      
      if (this.handleType === 0) {
        //提交新增图片
        const { data: res } = await this.$http.post(
          "/api/sys/banner/save",
          parm
        );
        if (res.code != "0000")
          return this.$message({
            type: "error",
            message: "提交失败，请重试"
          });
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.getBannerList();
        this.setRightDialogVisible = false;
      } else {
        // 提交编辑图片
        const { data: res } = await this.$http.post(
          "/api/sys/banner/update",
          parm
        );
        if (res.code != "0000")
          return this.$message({
            type: "error",
            message: "提交失败，请重试"
          });
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.getBannerList();
        this.setRightDialogVisible = false;
      }
    },
    //删除
    removeRightById(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let parm = [id];
          const { data: res } = await this.$http.post(
            "/api/sys/banner/del",
            parm
          );
          if (res.code != "0000") {
            return this.$message({
              type: "error",
              message: "删除失败!"
            });
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getBannerList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //编辑
    showSetRightDialog(row) {
      console.log(row);
      this.handleType = 1;
      this.setRightDialogVisible = true;
      this.bannerInitType.fileList = [{ url: this.ossUrl + row.img }];
      this.sn = row.sn;
      this.img = row.img;
      this.editId = row.banId;
    },
    //关闭Dialo时的钩子
    setRightDialogClosed() {
      this.handleType = "";
      this.img = "";
      this.sn = "";
      this.editId = "";
      this.bannerInitType.fileList = [];
    },
    //接受上传组件传过来的图片路径
    getBannerImg(img) {
      this.img = img;
    },
    //删除图片
    delBannerImg() {
      this.img = "";
    },
    /*******************获取列表数据************** */
    async getBannerList() {
      let parm = {
        current: 1,
        size: 10
      };
      const { data: res } = await this.$http.post("/api/sys/banner/list", parm);
      // console.log(res)
      if (res.code != "0000") {
        return this.$message({
          type: "error",
          message: "获取列表数据失败，请稍后再试"
        });
      }
      this.bannerList = res.data.bannerVOS.records;
      this.ossUrl = res.data.ossUrl;
    }
  },
  created() {
    this.getBannerList();
  }
};
</script>

<style lang="less" scoped>
.worlds {
  font-size: 12px;
  color: #999;
}
.table_img {
  width: 200px;
  border-radius: 4px;
}
</style>