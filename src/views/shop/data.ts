import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
  {
    title: 'ID',
    dataIndex: 'id',
    align:"center",
    width:70,
  },
  {
    title: '摊位名称',
    dataIndex: 'name',
    align:"center"
  },
  {
    title: '摊主',
    dataIndex: 'owner_name',
    align:"center"
  },
  {
    title:  'logo',
    dataIndex: 'logo',
    slotName: 'logo',
    align:'center'
  },
  {
    title: '摊位类型',
    dataIndex: 'type_name',
    align:"center"
  },
  {
    title: '营业状态',
    dataIndex: 'statusStr',
    align:"center"
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    slotName: 'createtime',
    align:"center"
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    align:"center"
  },
]);

export const statusEnum={
  'open':'营业中',
  'close':'休息中',
  'pending':'准备中',
}