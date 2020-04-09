<template>
  <el-container style="height:100vh">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>明邦官网后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          router
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="$route.path"
        >
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [
        {
          id: 103,
          authName: "页面",
          path: "pageSetup",
          children: [
            { id: 111, authName: "页面设置", path: "PageSetup" },
            { id: 112, authName: "轮播设置", path: "Slideshow" }
          ]
        },

        {
          id: 101,
          authName: "商品管理",
          path: "goods",
          children: [
            { id: 104, authName: "商品列表", path: "goods" },
            { id: 121, authName: "商品分类", path: "categories" }
          ]
        },
        {
          id: 145,
          authName: "公司环境图片",
          path: "reports",
          children: [{ id: 146, authName: "公司环境图片管理", path: "reports" }]
        },
        {
          id: 102,
          authName: "客户留言",
          path: "messge",
          children: [{ id: 107, authName: "客户留言管理", path: "messge" }]
        },
        {
          id: 125,
          authName: "管理员",
          path: "users",
          children: [{ id: 110, authName: "管理员设置", path: "users" }]
        }
      ],
      iconObj: {
        "125": "iconfont icon-icon_user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false
    };
  },
  methods: {
    async logout() {
      await this.$http.post("/api/logout");
      window.sessionStorage.clear();
      this.$message.success("退出登陆成功~!")
      this.$router.push("/login");
    },

    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 50px;
    height: 50px;
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>