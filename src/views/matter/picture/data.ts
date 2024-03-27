import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
     {
       title:  'ID',
       dataIndex: 'id',
       width: 76,
       align:'center'
     },
     {
      title:  '图片',
      dataIndex: 'mimetype',
      slotName: 'mimetype',
      align:'center'
    },
     {
       title:  '名称',
       dataIndex: 'title',
       align:'center'
     },
     {
      title:  '类型',
      dataIndex: 'type',
      slotName: 'type',
      align:'center'
     },
     {
       title:  '分类',
       dataIndex: 'catename',
       align:'center'
     },
     {
       title:  '大小',
       dataIndex: 'filesize',
       slotName: 'filesize',
       align:'center'
     },
     {
       title:  '状态',
       dataIndex: 'status',
       slotName: 'status',
       align:'center'
     },
     {
      title: '创建时间',
      dataIndex: 'createtime',
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
