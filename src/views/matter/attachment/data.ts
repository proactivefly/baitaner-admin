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
      title:  '图片',
      dataIndex: 'mimetype',
      slotName: 'mimetype',
      align:'center'
    },
    {
      title: '文件名称',
      dataIndex: 'title',
      align:"center"
    },
    {
      title: '文件大小',
      dataIndex: 'filesize',
      slotName: 'filesize',
      align:"center"
    },
    {
      title: 'mime类型',
      dataIndex: 'mimetype',
      align:"center"
    },
    {
      title: '创建时间',
      dataIndex: 'uploadtime',
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