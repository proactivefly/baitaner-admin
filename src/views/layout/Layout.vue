<template>
	<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<!-- 侧边栏 -->
		<sidebar class="sidebar-container"></sidebar>
		<!-- 主体区域 -->
		<div class="main-container">
			<!-- 导航栏 -->
			<navbar></navbar>
			<!-- 页面标签 -->
			<tags-view></tags-view>
			<!-- 内容主体区域 -->
			<app-main></app-main>
		</div>
	</div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
	@import "../../styles/mixin.styl";
	.app-wrapper {
		clearfix();
		position: relative;
		height: 100%;
		width: 100%;
	}
</style>
