import Vue from 'vue'
import Router from 'vue-router'
// 解决build后keep-live不生效,路由懒加载
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

/* 公共Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面(默认 false)



* alwaysShow: true             //当设置 true 的时候永远会显示根菜单，不设置的情况下只有当子路由个数大于一个时才会显示根菜单
*                              //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式。只有一个时会将那个子路由当做根路由  
                                  
* redirect: noredirect           //当设置 noredirect 的时候该路由不会在面包屑导航中出现
* name:'router-name'             //设定路由的名字，一定要填写不然 使用 <keep-alive> 时会出现各种问题
* meta : {
    roles: ['admin','editor']     //设置该路由进入的权限，支持多个权限叠加
    title: 'title'               //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             //设置该路由的图标
    noCache: true                //如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
  path: '/charts',
  component: Layout,
  redirect: 'noredirect',
  name: 'excel',
  meta: {
    title: 'excel',
    icon: 'excel'
  }
}
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),//跳转转到一个新的页面时，定位到最顶端。
  routes: constantRouterMap
})

/*异步挂在路由*/
export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: 'noredirect',
    name:'system',
    meta:{ 
      title:'system',
      icon:'user',
      roles: ['admin']
    }, 
    children: [
    {path: 'auth-management ',component: _import('permission/AuthManagement'),name: 'permission',meta: {title: 'authManagement',icon: 'lock',roles: ['admin']}},
    // {path:'set',commont:_import('permission/SetPermission'),name:'set',meta:{title:"set",icon:'lock',roles:['admin']}}
    ]
  },
  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart'
    },
    children: [
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
      { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
    ]
  },
  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: 'components',
      icon: 'component'
    },
    children: [
      { path: 'avatar-upload', component: _import('components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
      { path: 'sticky', component: _import('components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
      { path: 'mixin', component: _import('components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
      { path: 'back-to-top', component: _import('components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }}
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: 'example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: '/example/table',
        component: _import('example/table/index'),
        redirect: '/example/table/complex-table',
        name: 'Table',
        meta: {
          title: 'Table',
          icon: 'table'
        },
        children: [
          { path: 'complex-table', component: _import('example/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }},
          { path: 'tree-table', component: _import('example/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
        ]
      },
      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'tab' }}
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
