import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align:"center"
    },
    {
      title: '登录秘钥',
      dataIndex: 'auth_key',
      align:"center"
    },
    {
      title: '方糖key',
      dataIndex: 'fangtang_key',
      align:"center"
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      align:"center"
    },
    {
      title: '服务周期',
      dataIndex: 'service_cycle',
      align:"center",
      render:({record})=>{
        return record.service_cycle_text
      }
    },
    {
      title: '到期时间',
      dataIndex: 'end_time',
      align:"center"
    },
    {
      title: '状态',
      dataIndex: 'status',
      align:"center",
      slotName: 'status',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
      align:"center"
    },
  ]);