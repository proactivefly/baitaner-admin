<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'system.dept']" />
    <a-card class="general-card onelineCard" >
      <a-row style="margin-bottom: 10px">
          <a-col :span="16">
            <a-space>
              <a-input :style="{width:'220px'}"  v-model="formModel.name" placeholder="名称" allow-clear />
              <a-select v-model="formModel.status"  :options="statusOptions" placeholder="状态" :style="{width:'120px'}" :allowClear="true"/>
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button @click="reset">
                重置
              </a-button>
            </a-space>
          </a-col>
          <a-col
            :span="8"
             style="text-align: right;"
          >
          <a-space>
            <a-button type="primary" @click="createRule">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('searchTable.operation.create') }}
          </a-button>
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
        :pagination="false"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="{wrapper:true,cell:true}"
        :size="size"
        :default-expand-all-rows="true"
        ref="artable"
        @change="handleChange" 
      >
        <template #title="{ record }">
          <span v-html="record.spacer" style="padding-right: 5px;color: var(--color-neutral-4);"></span>{{ record.name }}
        </template>
        <template #icon="{ record }">
          <Icon :icon="record.icon" :size="20"></Icon>
        </template>
        <template #status="{ record }">
          <a-switch type="round" v-model="record.status" :checked-value="1" :unchecked-value="0" @change="handleStatus(record)">
              <template #checked>
                启用
              </template>
              <template #unchecked>
                禁用
              </template>
            </a-switch>
        </template>
        <template #operations="{ record }">
          <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
          <a-divider direction="vertical" />
          <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
            <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <!--表单-->
    <AddForm  @register="registerModal" @success="handleData"/>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch, nextTick , reactive} from 'vue';
  import useLoading from '@/hooks/loading';
  import { getList,del,upStatus } from '@/api/beijingEntryPermit';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import dayjs from 'dayjs';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { Pagination } from '@/types/global';
  //数据
  import { columns } from './data';
  //表单
  import AddForm from './AddForm.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from 'vue-i18n';
  import {Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  const { t } = useI18n();
  const [registerModal, { openModal }] = useModal();
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
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('large');
  const artable=ref()
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
  const generateFormModel = () => {
    return {
      name:'',
      startTime: '',
      status: '',
    };
  };
  const formModel = ref(generateFormModel());

      //状态
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: "启用",
      value: '1',
    },
    {
      label: "未启用",
      value:"0",
    },
  ]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const {items}= await getList({page:pagination.current,pageSize:pagination.pageSize,...formModel.value});
      renderData.value = items.map((item:any) => { 
        return {
          ...item,
          statusStr:item.status==1?'启用':'未启用',
          start_time:dayjs(item.start_time).format('YYYY-MM-DD HH:mm:ss'),
          end_time:dayjs(item.end_time).format('YYYY-MM-DD HH:mm:ss'),
        }
      });
      nextTick(()=>{
        artable.value.expandAll()
      })
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
    const reset = () => {
      formModel.value = generateFormModel();
      fetchData();
    };
  const search = () => {
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
  //添加菜单
  const createRule=()=>{
    openModal(true, {
      isUpdate: false,
      record:null
    });
  }
  //编辑数据
  const handleEdit=async(record:any)=>{
    openModal(true, {
      isUpdate: true,
      record:record
    });
  }
  //更新数据
  const handleData=async()=>{
    fetchData();
  }
  //排序拖拽
  const handleChange = (_data:any) => {
    console.log(_data);
    renderData.value = _data
  }
  //更新状态
  const handleStatus=async(record:any)=>{
    try {
          Message.loading({content:"更新状态中",id:"upStatus"})
          const res= await upStatus({id:record.id,status:record.status});
          res && Message.success({content:"更新状态成功",id:"upStatus"})
    }catch (error) {
      Message.clear("top")
    } 
  }
  //删除数据
  const handleDel=async(record:any)=>{
    try {
        Message.loading({content:"删除中",id:"delete"})
        const res= await del({ids:[record.id]});
        console.log(res);
        if(res){
          fetchData();
          Message.success({content:"删除成功",id:"delete"})
       }
    }catch (error) {
      Message.clear("top")
    } 
  }
</script>

<script lang="ts">
  export default {
    name: 'Rule',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
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
