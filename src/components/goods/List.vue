<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入商品名称" clearable v-model="queryInfo.name" @clear="getGoodsList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleCurrentChange(1);getGoodsList;"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodslist" border align="center">
        <!-- <el-table-column align="center" type="index"></el-table-column> -->
        <el-table-column align="center" label="商品图片）">
          <template v-slot="scope">
            <img class="rowImg" :src="scope.row.img" alt />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="商品名称"></el-table-column>

        <el-table-column align="center" prop="cateName" label="商品分类"></el-table-column>
        <el-table-column align="center" prop="typeStr" label="商品属性"></el-table-column>
        <el-table-column align="center" label="推荐到首页">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.putaway"
              :active-value="0"
              :inactive-value="1"
              @change="getPutaway(scope.row)"
              active-color="#5fb878"
              inactive-color="#999"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editById(scope.row.gdsId)"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-delete"
              @click="removeById(scope.row.gdsId)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[10, 20, 50]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        name: "",
        current: 1,
        size: 10
      },
      goodslist: [],
      total: 0
    };
  },
  methods: {
    //推荐到首页
    async getPutaway(e) {
      let parm = {
        gdsId: e.gdsId,
        putaway: e.putaway 
      }
      const { data } = await this.$http.post(
            "/api/gds/update",
            parm
          );
          if (data.code !== "0000") return this.$message.error(data.msg);
          this.$message.success("修改成功");
    },
    async getGoodsList() {
      const { data } = await this.$http.post("/api/gds/list", this.queryInfo);
      if (data.code !== "0000") return this.$message.error(data.msg);

      this.goodslist = data.data.records;
      this.total = +data.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.current = newPage;
      this.getGoodsList();
    },
    //删除
    removeById(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let gid = [id];
          const { data } = await this.$http.post("/api/gds/del", gid);
          if (data.code !== "0000") return this.$message.error(data.msg);

          this.getGoodsList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //去编辑
    editById(id) {
      this.$router.push({
        path: "/goods/add",
        query: {
          gdsId: id
        }
      });
    },
    goAddPage() {
      this.$router.push("goods/add");
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style lang="less" scoped>
.rowImg {
  width: 150px;
  border-radius: 4px;
}
</style>
