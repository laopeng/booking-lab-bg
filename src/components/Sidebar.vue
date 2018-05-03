<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
  data () {
    return {
      url: this.$baseUrl + '/sys/authorities',
      subs: [],
      doc: [],
      dataClean: [],
      items: []
    }
  },
  created () {
    this.createMenu()
  },
  computed: {
    onRoutes () {
      return this.$route.path
    }
  },
  methods: {
    // 根据权限生成菜单数据
    createMenu () {
      // 获取当前用户权限
      this.$axios.get(this.url + '/user/current').then((res) => {
        if (res.status === 200) {
          this.authorities = res.data
          for (let authority of this.authorities) {
            let code = authority.code
            if (code.startsWith('is_teacher')) {
              this.items.push({
                icon: 'el-icon-menu',
                index: '/labStatus',
                title: '预约审核'
              })
            }
            // if (code.startsWith('sys_')) { // 权限中包含系统管理权限
            //   this.hasSys = true
            //   if (code.endsWith('_authority')) {
            //     this.subs.push({
            //       index: '/sys/authorities',
            //       title: '权限管理'
            //     })
            //   } else if (code.endsWith('_role')) {
            //     this.subs.push({
            //       index: '/sys/roles',
            //       title: '角色管理'
            //     })
            //   } else if (code.endsWith('_user')) {
            //     this.subs.push({
            //       index: '/sys/users',
            //       title: '用户管理'
            //     })
            //   }
            // }
          }
          // if (this.hasSys) {
          //   this.items.push({
          //     icon: 'el-icon-menu',
          //     index: '/sys',
          //     title: '系统管理',
          //     subs: this.subs
          //   })
          //   this.subs = []
          // }
        }
      })
    }
  }
}
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom: 0;
        background: #2E363F;
    }

    .sidebar > ul {
        height: 100%;
    }

    a {
        color: inherit;
    }

    a:hover {
        color: inherit;
    }
</style>
