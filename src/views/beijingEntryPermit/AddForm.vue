<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改进京证信息" width="600px" :minHeight="400" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width style="padding:10px 20px;">

      <a-form-item field="name" label="用户名" validate-trigger="input" :rules="[{required:true,message:'请填写用户名'}]" style="margin-bottom:15px;">
        <a-input v-model="formData.name" placeholder="请填写用户名" />
      </a-form-item>

      <a-form-item field="auth_key" label="authKey" validate-trigger="input" :rules="[{required:true,message:'请填写authKey'}]" style="margin-bottom:15px;">
        <a-input v-model="formData.auth_key" placeholder="请填写authKey" />
      </a-form-item>

      <a-form-item field="fangtang_key" label="方糖Key" validate-trigger="input" :rules="[{required:true,message:'请填写方糖key'}]" style="margin-bottom:15px;">
        <a-input v-model="formData.fangtang_key" placeholder="请填写方糖key" />
      </a-form-item>

      <a-form-item label="服务周期" field="service_cycle" style="margin-bottom:15px;" :rules="[{required:true,message:'请选择服务周期'}]">
        <a-select placeholder="服务周期" :options="serviceList" v-model="formData.service_cycle"></a-select>
      </a-form-item>

      <a-form-item label="服务开始时间" field="start_time" style="margin-bottom:15px;" :rules="[{required:true,message:'请选择服务开始时间'}]">
        <a-date-picker  placeholder="服务开始时间" v-model="formData.start_time" style="width:100%"  value-format="timestamp"/>
      </a-form-item>
      <a-form-item field="remark" label="备注" validate-trigger="input" style="margin-bottom:15px;">
        <a-textarea v-model="formData.remark" placeholder="请填写备注" allow-clear/>
      </a-form-item>
    </a-form>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';
  import { cloneDeep } from 'lodash-es';
  //api
  import { save } from '@/api/beijingEntryPermit';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  export default defineComponent({
    name: 'AddForm',
    components: { BasicModal,IconPicker,Icon },
    emits: ['success'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(false);
      const parntList = ref([]);
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
            id: null,
            name: '',
            auth_key: '',  // 认证key
            fangtang_key: '', // 方糖key
            service_cycle: 1, // 服务周期 1 月， 2 季度， 3 年 ,
            start_time:dayjs().valueOf(),
            remark: "", //  备注
        }
      const formData = ref(basedata)
      const serviceList=[
        { label: '月', value: 1 },
        { label: '季度', value: 2 },
        { label: '年', value: 3 },
      ]
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setModalProps({ confirmLoading: false });
          isUpdate.value = !!data?.isUpdate;
          if (unref(isUpdate)) {
            formData.value = { ...basedata, ...Object.fromEntries(
              Object.keys(basedata)
                .filter(key => key in data.record)
                .map(key => [key, data.record[key]])
            )};
          }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));
      //点击确认
      const { loading, setLoading } = useLoading();
      const handleSubmit = async () => {
        try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            Message.loading({content:"保存中",id:"upStatus"})
            let params=cloneDeep(unref(formData))
            params.start_time=dayjs(params.start_time).valueOf()
            await save(params);
            Message.success({content:"保存成功",id:"upStatus"})
            closeModal()
            emit('success');
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };
      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        parntList,
        serviceList,
        t,
        OYoptions:[
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
      };
    },
  });
</script>
