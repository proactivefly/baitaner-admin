<template>
    <a-select
      v-model="selectedValue"
      @change="handleChange"
      :placeholder="placeholder"
      :allowClear="true"
    >
      <a-option
        v-for="item in dictData"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </a-option>
    </a-select>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits,onMounted } from 'vue';
  import { getListAll } from "@/api/datacenter/dictionary";
  interface DictItem {
    value: string;
    label: string;
  }
  const dictData=ref<DictItem[]>([])
  const props = defineProps({
    // 初始选中值
    value: {
      type: [String, Number],
      default: ''
    },
    // 占位提示信息
    placeholder: {
      type: String,
      default: '请选择'
    },
    tableName:{
        type:String,
        default:''
    }
  });
  
  const emit = defineEmits(['update:value']);
  
  // 处理选中值变化
  const handleChange = (newValue) => {
    emit('update:value', newValue);
  };
  const getDictOptions = async () => {
    const {items} = await getListAll({tablename:props.tableName});
    dictData.value = items;
  }
  onMounted(()=>{
    console.log('inM')
    getDictOptions()
  })
  // 将props的value映射到本地的selectedValue上，以实现v-model的双向绑定效果
  const selectedValue = ref(props.value);
  
  // 确保当props.value外部变更时，本地的selectedValue也能同步更新
//   watch(
//     () => props.value,
//     (newVal) => {
//       selectedValue.value = newVal;
//     }
//   );
  </script>