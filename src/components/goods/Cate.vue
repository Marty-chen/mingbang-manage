<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        :data="catelist"
        show-index
        index-text="#"
        class="TreeTable"
        border
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效插槽 -->
        <!-- <template v-slot:isok="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>-->
        <!-- 排序插槽 -->
        <template v-slot:level="scope">
          <el-tag size="mini" v-if="scope.row.level === 1">一级</el-tag>
          <el-tag size="mini" v-if="scope.row.level === 2" type="success">二级</el-tag>
          <el-tag size="mini" v-if="scope.row.level === 3" type="warning">三级</el-tag>
        </template>
        <!-- 操作插槽 -->
        <template v-slot:cateId="scope">
          <el-button
            @click="handleEdit(scope.row)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
          @click="handleDele(scope.row)"
           size="mini" type="warning" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      :title="isEditor?'编辑分类' : '添加分类'"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClosed"
      width="50%"
    >
      <el-form label-width="100px">
        <el-form-item label="分类名称：">
          <el-input v-model="addCateForm.name" @input="changeInput($event)" />
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-select :disabled="isEditor" v-model="addCateForm.pid" clearable placeholder="请选择">
            <el-option
              v-for="item in parentCateList"
              :key="item.cateId"
              :label="item.name"
              :value="item.cateId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="explain">不选父级分类，默认添加的是一级分类。</div>
      <div slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [], //

      columns: [
        {
          label: "分类名称",
          prop: "name"
        },

        {
          label: "分类级别",
          type: "template",
          template: "level"
        },
        {
          label: "操作",
          type: "template",
          template: "cateId"
        }
      ],
      isEditor: false,
      addCateDialogVisible: false,
      parentCateList: [], //分类数据
      addCateForm: {
        name: "",
        pid: ""
      }
    };
  },
  methods: {
    //兼容input 不能输入问题
    changeInput() {
      this.$forceUpdate()
    },
    //获取分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.post("/api/gds/category/list");
      if (res.code !== "0000") return this.$message.error(res.msg);
      this.catelist = res.data;
    },

    //添加分类按钮
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //向后台获取父级分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.post(
        "/api/gds/category/findLevel",
        "1"
      );
      if (res.code !== "0000") {
        return this.$message.error(res.msg);
      }
      this.parentCateList = res.data.categoryVOS;
    },
    //添加分类对话框  被关闭时的钩子
    addCateDialogClosed() {
      this.addCateForm = {};
      this.isEditor = false;
    },
    //添加分类  确定按钮
    async addCate() {
      if (!this.addCateForm.name) return this.$message.error("请填写分类名称");
      if (!this.isEditor) {
        //添加分类
        const { data: res } = await this.$http.post(
          "/api/gds/category/save",
          this.addCateForm
        );
        if (res.code != "0000") return this.$message.error(res.msg);
        this.$message.success("添加分类成功！");
      } else {
        //编辑分类
         const { data: res } = await this.$http.post(
          "/api/gds/category/update",
          this.addCateForm
        );
        if (res.code != "0000") return this.$message.error(res.msg);
        this.$message.success("修改分类成功！");
      }
      
      this.getCateList();
      this.addCateDialogVisible = false;
    },
    //编辑分类 按钮
    handleEdit(row) {
      console.log(row);
      this.addCateDialogVisible = true;
      this.isEditor = true;
      this.addCateForm.name = row.name;
      this.addCateForm.cateId = row.cateId;
    },
    //删除分类按钮
    handleDele(row) {
      let parm = [row.cateId];
      // console.log(this.addCateForm)
      this.$confirm(' 删除此分类将会把此分类下的所有商品一并删除， 请谨慎删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:res} = await this.$http.post("/api/gds/category/del",parm);
          if(res.code != "0000") return this.$message.error(res.msg);
          this.getCateList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style lang="less" scoped>
.TreeTable {
  margin-top: 15px;
}
.explain {
  color: #999;
  font-size: 12px;
  margin-left: 100px;
}
.el-scrollbar__wrap {
  margin-bottom: 0;
}
</style>
