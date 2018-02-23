<template>
  <div class="dashboard-container">
    <h1>赶趟出行乘务系统</h1>
    <p>
      <h3 style='color:red'>权限控制流</h3>  
      <p>1、用户登陆 - > 拿到服务器token  -  >分发Login事件 ->  改变state.token 状态, 把用户token存到cookie中</p>
      <p>2、跳转路由时 - > 走route.beforeEach全局前置钩子 -  还未拉取用户信息 ，通过token拉取用户信息 设置state中用户roles信息（['admin','custorm',..]），还有其他信息avtar,name。。</p>
      <p>3、通过用户 的 角色信息 对比 异步路由表 过滤掉不可进入的路由。添加到state.permission.addRoutes中 </p>
      <p style='color:blue'>4、调用route.addRoute(store.permission.addRoutes) 中</p>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([ //解构state.roles
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) { //判断数组中是否有某个值arr.includes('valur')
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style>
  .dashboard-container{
    padding: 20px;
  }
</style>
