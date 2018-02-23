<template>
  <div class="app-container calendar-list-container">
    <!-- 筛选条件 -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.title">
      </el-input>
      <!-- 如果 Select 的绑定值为对象类型，请务必指定 :key 作为它的唯一性标识。 -->
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" :placeholder="$t('table.type')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key"></el-option>
      </el-select>
      
      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
      <el-button class='filter-item' type='primary' icon='el-icon-delete' @click='deleteHandler'>删除</el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox>
    </div>
    <!-- table   border:纵向边框，fit：列的宽度自适应，height-current-row：高亮显示当前行-->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%" @select="selectRowFun">
      <el-table-column type='selection' width='55'></el-table-column>
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <!-- slot-scope 的值将被用作一个临时变量名，此变量接收从父组件传递过来的 prop 对象： -->
        <template slot-scope="props">
          <span>{{props.row.id}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="150px" align="center" :label="$t('table.date')">
        <template slot-scope="props">
          <span>{{props.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" :label="$t('table.title')">
        <template slot-scope="props">
          <span class="link-type">{{props.row.title}}</span>
          <el-tag>{{props.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('table.author')">
        <template slot-scope="props">
          <span>{{props.row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" v-if='showReviewer' align="center" :label="$t('table.reviewer')">
        <template slot-scope="props">
          <span style='color:red;'>{{props.row.reviewer}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" :label="$t('table.importance')">
        <template slot-scope="props">
          <svg-icon v-for="n in +props.row.importance" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.readings')" width="95">
        <template slot-scope="props">
          <!-- 如果有值，填值 -->
          <span v-if="props.row.pageviews" class="link-type" @click='handleFetchPv(props.row.pageviews)'>{{props.row.pageviews}}</span>
          <!-- 没有就0 -->
          <span v-else>0</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="props">
          <el-tag :type="props.row.status | statusFilter">{{props.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="props">
          <el-button type="primary" size="mini" @click="handleUpdate(props.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="props.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(props.row,'published')">{{$t('table.publish')}}
          </el-button>
          <el-button v-if="props.row.status!='draft'" size="mini" @click="handleModifyStatus(props.row,'draft')">{{$t('table.draft')}}
          </el-button>
          <el-button v-if="props.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(props.row,'deleted')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 页码 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--新建编辑dialog  modal-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max='3'></el-rate>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <!-- 创建时保存的 按钮 -->
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <!-- 编辑时的按钮 -->
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- 阅读数据模态框 -->
    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr -> obj { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: { //查询条件
        page: 1,//页码
        limit: 20,//每页几条
        importance: undefined,//重要程度
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false, //默认隐藏
      dialogStatus: '',//表格打开时类型  新建 or 编辑
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      selectRow:[]
    }
  },
  filters: {
    statusFilter(status) { //状态过滤
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) { //过滤类型
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    // 组件加载请求数据
    this.getList()
  },
  methods: {
    //获取数据列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1 //重置页码为1
      this.getList()
    },
    handleSizeChange(val) { //改变显示条数时
      if (this.listQuery.limit === val) {
        return
      }
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) { //会掉参数为当前页（自动注入）
      if (this.listQuery.page === val) {
        return
      }
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() { //重置表单内容
      this.temp = {
        id: undefined, 
        importance: 1, 
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() { //新增 按钮
      this.resetTemp() 
      this.dialogStatus = 'create' //新建
      this.dialogFormVisible = true
      this.$nextTick(() => { //dom更新之后
        this.$refs['dataForm'].clearValidate() //clearValidate() 移除整个表单的校验结果
      })
    },
    createData() { //保存数据
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp) //前边追加
            this.dialogFormVisible = false 
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) { //编辑按钮
      this.temp = Object.assign({}, row) // 复制 row对象
      this.temp.timestamp = new Date(this.temp.timestamp)//更新时间
      this.dialogStatus = 'update' 
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteHandler(){//删除选中行
      if(this.selectRow){
        this.selectRow.forEach(row=>{
          let _index = this.list.indexOf(row)
          this.list.splice(_index, 1)
        })
      }
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    },
    /**
     * [selectRowFun 赋值]
     * @param  {[type]} selection [所选行集合]
     * @param  {[type]} row       [此次选择的行]
     * @return {[type]}           [description]
     */
    selectRowFun(selection,row){
      // console.log(selection)
      this.selectRow=selection
    },
    updateData() { //编辑状态 时的按钮
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) { //单独删除某条数据
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) { //查看阅览数
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() { //导出数据
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status'] //设置表头名称
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status'] //选择要导出的数据
        const data = this.formatJson(filterVal, this.list) //过滤数据
        // 数据导出
        excel.export_json_to_excel(tHeader, data, 'table-list') // 文件名
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) { //过滤数据
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
