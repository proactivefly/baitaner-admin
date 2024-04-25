<template>
    <div class="container" >
      <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
      <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
        <a-row style="margin-bottom: 10px">
          <a-col :span="16">
            <a-space>
              <a-input :style="{width:'220px'}"  v-model="formModel.name" placeholder="名称" allow-clear />
              <DICTSELECT v-model="formModel.type_id" tableName="common_dictionary_stall_type" style="width:120px"/>
              <a-select v-model="formModel.status"  :options="statusOptions" placeholder="状态" :style="{width:'120px'}" />
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button @click="reset">
                {{ $t('searchTable.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
          <a-col
            :span="8"
             style="text-align: right;"
          >
          <a-space>
            <a-tooltip :content="$t('searchTable.actions.refresh')">
              <div class="action-icon" @click="search"
                ><icon-refresh size="18"
              /></div>
            </a-tooltip>
            <a-dropdown @select="handleSelectDensity">
              <a-tooltip :content="$t('searchTable.actions.density')">
                <div class="action-icon"><icon-line-height size="18" /></div>
              </a-tooltip>
              <template #content>
                <a-doption
                  v-for="item in densityList"
                  :key="item.value"
                  :value="item.value"
                  :class="{ active: item.value === size }"
                >
                  <span>{{ item.name }}</span>
                </a-doption>
              </template>
            </a-dropdown>
            </a-space>
          </a-col>
        </a-row>
        <a-table
           row-key="id"
          :loading="loading"
          :pagination="pagination"
          :columns="(cloneColumns as TableColumnData[])"
          :data="renderData"
          :bordered="{wrapper:true,cell:true}"
          :size="size"
          :default-expand-all-rows="true"
          ref="artable"
          @page-change="handlePaageChange" 
          @page-size-change="handlePaageSizeChange" 
        >
          <template #logo="{ record }">
            <img style="height: 50px;border-radius: 5px;" :src="record.logo"/>
          </template>
          <template #overtime="{ record }">
            {{record.overtime==0?"不限":record.overtime}}
          </template>
          <template #filesize="{ record }">
            {{filesizeFont(record.filesize)}}
          </template>
          <template #operations="{ record }">
            <a-space>
              <ButtonGroup size="mini" type="primary">
                <a-button @click="lookDetail(record)">详情</a-button>
              </ButtonGroup>
              <ButtonGroup size="mini">
                <a-popconfirm content="您确定要删除附件吗?" @ok="handleDelete(record.id)">
                  <a-button style="color: red;">删除</a-button>
                </a-popconfirm>
              </ButtonGroup>
            </a-space>
            
          </template>
        </a-table>
        
      </a-card>
      <!--表单-->
    <StallModal @register="registerModal"/>
    </div>
  </template>
  
  <script lang="ts" setup name="Rule">
    import { computed, ref, reactive, watch } from 'vue';
    import StallModal from "./components/stallModel.vue";
    import useLoading from '@/hooks/loading';
    import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
    import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
    import cloneDeep from 'lodash/cloneDeep';
    import { columns,statusEnum} from './data';
    import { getList ,delStall } from '@/api/stall';
    import { useI18n } from 'vue-i18n';
    import { useModal } from '@/components/Modal';
    import { Message ,Button} from '@arco-design/web-vue';
    import { Pagination } from '@/types/global';
    import { useRoute } from 'vue-router'
    import DICTSELECT from "@/components/DictSelect/index.vue";
    const [registerModal, { openModal }] = useModal();
    const route = useRoute();
    const ButtonGroup=Button.Group
    const { t } = useI18n();
    const densityList = computed(() => [
      {
        name: t('searchTable.size.mini'),
        value: 'mini',
      },
      {
        name: t('searchTable.size.small'),
        value: 'small',
      },
      {
        name: t('searchTable.size.medium'),
        value: 'medium',
      },
      {
        name: t('searchTable.size.large'),
        value: 'large',
      },
    ]);
    //分页
    const basePagination: Pagination = {
      current: 1,
      pageSize: 10,
    };
    const pagination = reactive({
      ...basePagination,
      showTotal:true,
      showPageSize:true,
    });
    type SizeProps = 'mini' | 'small' | 'medium' | 'large';
    type Column = TableColumnData & { checked?: true };
    const { loading, setLoading } = useLoading(true);
    const renderData = ref([]);
    const cloneColumns = ref<Column[]>([]);
    const showColumns = ref<Column[]>([]);
    const size = ref<SizeProps>('large');
     //查询字段
     const generateFormModel = () => {
      return {
        type_id:'',
        name: '',
        status: '',
      };
    };
    const formModel = ref(generateFormModel());
    const fetchData = async () => {
      setLoading(true);
      try {
        const data= await getList({page:pagination.current,pageSize:pagination.pageSize,...formModel.value});
        renderData.value = data.items.map((item:any)=>{
          item['statusStr']=statusEnum[item.status]
          return {
            ...item,
          }
        });
        pagination.current = data.page;
        pagination.total = data.total;
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    };
    //查询 
    const search = () => {
      fetchData();
    };
    const reset = () => {
      formModel.value = generateFormModel();
      fetchData();
    };
    fetchData();
    const handleSelectDensity = (
      val: string | number | Record<string, any> | undefined,
      e: Event
    ) => {
      size.value = val as SizeProps;
    };
  
    watch(
      () => columns.value,
      (val) => {
        cloneColumns.value = cloneDeep(val);
        cloneColumns.value.forEach((item, index) => {
          item.checked = true;
        });
        showColumns.value = cloneDeep(cloneColumns.value);
      },
      { deep: true, immediate: true }
    );
    //分页
    const handlePaageChange = (page:any) => {
      pagination.current=page
      fetchData();
    }
    //分页总数
    const handlePaageSizeChange = (pageSize:any) => {
      pagination.pageSize=pageSize
      fetchData();
    }
    const handleDelete=async(disdata:any)=>{
      try {
          Message.loading({content:"删除中",id:"upStatus"})
         const res= await delStall({id:disdata});
         if(res){
          fetchData();
           Message.success({content:"删除成功",id:"upStatus"})
         }
      }catch (error) {
        Message.clear("top")
      } 
    }

    const lookDetail=async (record:any)=>{
      const arr=[
        {label:'摊位名称',value:record.name},
        {label:'摊主',value:record.owner_name},
        {label:'类型',value:record.type_name},
        {label:'状态',value:statusEnum[record.status]},
        {label:'摊位评分',value:record.star},
        {label:'logo',value:record.logo},
        {label:'创建时间',value:record.created_at},
        {label:'详细信息',value:record.detail,span:24},
      ]
      // 处理数据
      openModal(true,arr);
    }
    //状态
    const statusOptions = computed<SelectOptionData[]>(() => [
      {
        label: "营业中",
        value: 'open',
      },
      {
        label: "准备中",
        value: "pending",
      },
      {
        label: "打烊",
        value:"closed",
      },
    ]);
    //存储单位换算
    const suffix = ['B', 'KB', 'MB', 'GB', 'TB'];
    const filesizeFont=(size:any)=>{
      const base = Math.floor(Math.log2(size) / 10);
      const index = clamp(base, 0, 4);
      return (size / 2 ** (10 * index)).toFixed(2) + suffix[index];
    }
    function clamp(v:any, min:any, max:any) {
    if (v < min) return min;
    if (v > max) return max;
    return v;
  }
  </script>
  
  <style scoped lang="less">
    .container {
      padding: 0 20px 20px 20px;
      height: 100%;
    }
    :deep(.arco-table-th) {
      &:last-child {
        .arco-table-th-item-title {
          margin-left: 16px;
        }
      }
    }
    .action-icon {
      margin-left: 12px;
      cursor: pointer;
    }
    .active {
      color: #0960bd;
      background-color: #e3f4fc;
    }
    .setting {
      display: flex;
      align-items: center;
      width: 200px;
      .title {
        margin-left: 12px;
        cursor: pointer;
      }
    }
    :deep(.general-card > .arco-card-header){
      padding: 10px 16px;
    }
    .iconbtn{
      user-select: none;
      cursor: pointer;
      opacity: .8;
      &:hover{
        opacity: 1;
      }
    }
  </style>
  