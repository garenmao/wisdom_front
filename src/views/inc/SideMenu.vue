<template>
  <el-menu
      class="wisdom-el-menu"
      :default-active="active"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <router-link to="index">
      <el-menu-item :index="pageIndex">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
    </router-link>
    <el-submenu :index="menu.index" :key="menu.index" v-for="menu in menuInfo.submenu">
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </template>
      <router-link :to="item.path" :key="item.index" v-for="item in menu.children">
        <el-menu-item :index="item.index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    menuInfo: {
      get () {
        return JSON.parse(localStorage.getItem('menuInfo'))
      }
    },
    active: {
      get () {
        return localStorage.getItem('menuActive')
      }
    }
  },
  methods: {
    handleSelect (index) {
      console.log(index)
    }
  }
}

</script>

<style scoped>
.wisdom-el-menu {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>
