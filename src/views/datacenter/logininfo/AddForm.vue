<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :isPadding="false" :loading="loading" width="800px" @height-change="onHeightChange" :minHeight="modelHeight" :title="getTitle" @ok="handleSubmit">
    <div class="addFormbox" :style="{'min-height':`${windHeight}px`}">
      <div class="tabs-content">
        <a-form ref="formRef" :model="formData" auto-label-width>
          <div class="content_box">
              <!--基础信息-->
              <a-scrollbar style="overflow: auto;" :style="{height:`${windHeight}px`}">
                <div class="besecontent" >
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item field="title" label="名称" validate-trigger="input" :rules="[{required:true,message:'请填写名称'}]" >
                        <a-input v-model="formData.title" placeholder="请填名称" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="weigh" label="排序" validate-trigger="input" style="margin-bottom:15px;">
                        <a-input-number  v-model="formData.weigh" placeholder="请填排序" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="24" >
                      <a-form-item field="type" label="类型" style="margin-bottom:5px;">
                        <a-radio-group v-model="formData.type" :options="OYoptions" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="24">
                      <a-form-item field="des" label="描述" style="margin-bottom:15px;">
                        <a-textarea v-model="formData.des" placeholder="请填描述"  :auto-size="{minRows:3,maxRows:5}"/>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="image" label="添加封面" style="margin-bottom:15px;">
                        <a-upload
                            accept="image/*"
                            :show-file-list="false"
                            :custom-request="customRequest"
                          >
                            <template #upload-button>
                              <div class="upimagebox">
                                <div class="imagebtn">
                                  <div
                                      class="upload-show-picture"
                                      v-if="formData.image"
                                    >
                                      <img :src="formData.image" />
                                      <div class="upload-show-picture-mask">
                                        <IconEdit />
                                      </div>
                                    </div>
                                    <div class="upload-picture-card" v-else>
                                      <div class="upload-picture-card-text">
                                        <IconPlus />
                                        <div style="margin-top: 10px; font-weight: 600">上传图片</div>
                                      </div>
                                    </div>
                                </div>
                              </div>
                            </template>
                          </a-upload>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-scrollbar>
          </div>
        </a-form>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { cloneDeep } from 'lodash-es';
  //api
  import { save,getContent } from '@/api/datacenter/logininfo';
  import { Message } from '@arco-design/web-vue';
  import type { RequestOption} from '@arco-design/web-vue/es/upload/interfaces';
  import { userUploadApi } from '@/api/common';
  export default defineComponent({
    name: 'AddBook',
    components: { BasicModal },
    emits: ['success'],
    setup(_, { emit }) {
      const isUpdate = ref(false);
      const modelHeight= ref(480);
      const windHeight= ref(480);
      //表单
      const { loading, setLoading } = useLoading();
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
            id:0,
            type: 'business',
            title: '',
            image: '',
            des: "",
            weigh:1,
        }
      const formData = ref(basedata)
      //编辑器
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setLoading(true);
          setModalProps({ confirmLoading: false });
          isUpdate.value = !!data?.isUpdate;
          if (unref(isUpdate)) {
            formData.value=cloneDeep(data.record)
            const mewdata = await getContent({id:data.record.id});
            formData.value=Object.assign({},formData.value,mewdata)
          }else{
            formData.value=basedata
          }
          setLoading(false);
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增数据' : '编辑数据'));
     //点击保存数据
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            Message.loading({content:"提交中",id:"upStatus"})
            let savedata=cloneDeep(unref(formData))
            await save(savedata);
            Message.success({content:"提交成功",id:"upStatus"})
            closeModal()
            emit('success');
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };
      //上传附件=图片
      const customRequest = (options: RequestOption) => {
          const controller = new AbortController();
            (async function requestWrap() {
              const {
                onProgress,
                onError,
                onSuccess,
                fileItem,
              } = options;
              onProgress(20);
              const onUploadProgress = (event: ProgressEvent) => {
                let percent;
                if (event.total > 0) {
                  percent = (event.loaded / event.total) * 100;
                }
                onProgress(parseInt(String(percent), 10), event);
              };
              try {
                //开始手动上传
                const filename=fileItem?.name||""
                const resdata = await userUploadApi({ name: 'file', file: fileItem.file as Blob, filename,data:{cid:0}},onUploadProgress);
                //更新图片
                if(resdata){
                  formData.value.image=resdata.url
                }
              } catch (error) {
                onError(error);
              }
            })();
            return {
              abort() {
                controller.abort();
              },
            };
      };
       //监听高度
       const onHeightChange=(val:any)=>{
        windHeight.value=val
      }
      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        OYoptions:[
          { label: '总管理后台', value: "admin" },
          { label: '业务后台', value: "business" },
          { label: '公共', value: "common" },
        ],
        customRequest,
        modelHeight,
        onHeightChange,windHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  @import '@/assets/style/formlayer.less';
  .tabs-content{
    padding: 0px 25px;
  }
  //上传图片
  .upimagebox{
    display: flex;
    .imagebtn{
      position: relative;
      width: 160px;
      height: 90px;
      background-color: var(--color-neutral-1);
      border-radius: 4px;
      overflow: hidden;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      //预览
      .upload-show-picture{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          height: 100%;
        }
        &:hover{
          .upload-show-picture-mask{
             opacity: 1;
          }
        }
        .upload-show-picture-mask{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            color: var(--color-white);
            font-size: 16px;
            line-height: 90px;
            text-align: center;
            background: rgba(0, 0, 0, 0.5);
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);
        }
      }
      .upload-picture-card{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .upload-picture-card-text{
           text-align: center;
           color:  var(--color-neutral-5);
        }
      }
    }
  }
</style>

