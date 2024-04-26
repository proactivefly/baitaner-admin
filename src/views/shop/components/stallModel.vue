<template>
    <BasicModal 
      v-bind="$attrs" 
      @register="registerModal" 
      :loading="loading" 
      width="800px" 
      title="摊位详情"
      @cancel="handleCancel"
    >
      <div>
          <a-descriptions :data="info" :column="2" layout="inline-horizontal" size="large">
            <template #value="{value,_,data}">
              <span v-if="data.label==='摊位评分'">
                <a-rate :model-value="value" readonly/>
              </span>
              <span v-else-if="data.label==='logo'">
                <a-avatar>
                  <img :src="value"/>
                </a-avatar>
              </span>
              <div v-else-if="data.label==='详细信息'">
                lotem 
              </div>
              <span v-else>{{ value }}</span>
             </template>
          </a-descriptions>
      </div>
    </BasicModal>
  </template>
<script lang="ts" setup name="StallDetail">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import useLoading from '@/hooks/loading';
  import { ref } from 'vue';
  const { loading, setLoading } = useLoading();
  const info=ref([]);
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    setLoading(true);
    info.value = data;
    setLoading(false);
  });

  const handleCancel = () => {
    closeModal()
  }
</script>
<style scoped>
  :deep(.arco-descriptions-row){
    height:40px;
    display:flex;
    align-items: center;
  }
  :deep(.arco-descriptions-item){
    display:flex;
    flex:1;
    align-items: center;
  }
</style>
  