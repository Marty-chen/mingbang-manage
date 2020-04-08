<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>客户留言</el-breadcrumb-item>
      <el-breadcrumb-item>客户留言管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="orderlist" stripe border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="content" label="留言内容" align="center"></el-table-column>
        <el-table-column label="操作" width="130px" align="center">
          <template v-slot="scope">
            <el-button size="mini" type="warning" icon="el-icon-delete" @click="delMsg(scope.row.messageId)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[10, 15, 20]"
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
      orderlist: [],
      queryInfo: {
        current: 1,
        size: 10
      },
      total: 0
    };
  },
  methods: {
    async getOrderList() {
      const { data } = await this.$http.post(
        "/api/message/list",
        this.queryInfo
      );
      if (data.code !== "0000") return this.$message.error(data.msg);
      this.orderlist = data.data.records;
      this.total = +data.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.current = newPage;
      this.getOrderList();
    },
    delMsg(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let gid = [id];
          const { data } = await this.$http.post("/api/message/del", gid);
          if (data.code !== "0000") return this.$message.error(data.msg);

          this.getOrderList();
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
    }
  },
  created() {
    this.getOrderList();
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
