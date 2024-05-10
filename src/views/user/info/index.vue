<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.info']" />
    <UserInfoHeader />
    <div class="content">
      <a-button id="jump">返回A</a-button>
      <div class="content-left">
        <a-grid :cols="24" :col-gap="16" :row-gap="16">
          <a-grid-item :span="24">
            <MyProject />
          </a-grid-item>
          <a-grid-item :span="24">
            <LatestActivity />
          </a-grid-item>
        </a-grid>
      </div>
      <div class="content-right">
        <a-grid :cols="24" :row-gap="16">
          <a-grid-item :span="24">
            <MyTeam />
          </a-grid-item>
          <a-grid-item class="panel" :span="24">
            <LatestNotification />
          </a-grid-item>
        </a-grid>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import UserInfoHeader from './components/user-info-header.vue';
  import LatestNotification from './components/latest-notification.vue';
  import MyProject from './components/my-project.vue';
  import LatestActivity from './components/latest-activity.vue';
  import MyTeam from './components/my-team.vue';
  // import { onMounted,ref } from 'vue';
  // let initId:any=ref(null)
  // let rid:any=ref(null)
  // onMounted(() => {
  //     initId=setInterval(()=>{
  //     const randomNum=Math.floor(Math.random()*10)
  //     console.log('随机数',randomNum)
  //     if(randomNum>5){
  //       // back()
  //       clickk()
  //     }
  //   },3000)
  // })
  // function clickk(){
  //   window.focus();
  //   var element = document.getElementById('jump');
  //     var clickEvent = new MouseEvent('click', {
  //           bubbles: true, 
  //           cancelable: true, 
  //           view: document.defaultView
  //       });
  //     element?.dispatchEvent(clickEvent);
  //     console.log('click')
  //   }
  // var _url='http://localhost:9420/#/baitaner/index'
  // window.name="PAGEB";
  // const back = () => {
  //   // clickk()
  //   console.log('回去了——----————————B页面name',window.name)
  //   window.open("","PAGEA")
  // }


  // // rid=setInterval(()=>{
  // //   const randomNum=Math.floor(Math.random()*10)
  // //   console.log('随机数',randomNum)
  // //   if(randomNum>5){
  // //     // back()
  // //     const jumpBtn=document.getElementById('jump')
  // //       if(jumpBtn){
  // //          jumpBtn.click()
  // //       }
  // //   }
  // // },3000)

  // document.addEventListener('visibilitychange', function () {
  //   console.log("B页面监听了",document.visibilityState)
  //   clearInterval(initId)
  //   if (document.visibilityState === 'visible') {
  //     rid=setInterval(()=>{
  //         const randomNum=Math.floor(Math.random()*10)
  //         console.log("随机数",randomNum)
  //         if(randomNum>5){
  //           // back()
  //           clickk()
  //         }
  //       },3000)
  //   }else{
  //     clearInterval(rid)
  //   }
  // })
</script>
<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .content {
    display: flex;
    margin-top: 12px;

    &-left {
      flex: 1;
      margin-right: 16px;
      overflow: hidden;
      // background-color: var(--color-bg-2);

      :deep(.arco-tabs-nav-tab) {
        margin-left: 16px;
      }
    }

    &-right {
      width: 332px;
    }

    .tab-pane-wrapper {
      padding: 0 16px 16px 16px;
    }
  }
</style>

<style lang="less" scoped>
  .mobile {
    .content {
      display: block;
      &-left {
        margin-right: 0;
        margin-bottom: 16px;
      }
      &-right {
        width: 100%;
      }
    }
  }
</style>
