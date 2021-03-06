<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><i class="el-icon-setting"></i>预约审核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-row :gutter="50">
        <el-col :span="4" class="handle-box">
          <el-select v-model="params.labId" clearable placeholder="请选择实验室" @change="search()">
            <el-option
              v-for="value in labList"
              :key="value.id"
              :label="value.name"
              :value="value.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="handle-box">
          <el-button type="primary" icon="search" @click="search()">搜 索</el-button>
          <el-button type="primary" icon="close" @click="reset()">重 置</el-button>
        </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%" ref="multipleTable"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"/>
      <el-table-column prop="id.lab.id" label="编号" width="210"/>
      <el-table-column prop="id.lab.name" label="实验室名称" sortable width="130"/>
      <el-table-column prop="id.bookingDate" label="日期"/>
      <el-table-column prop="id.bookingTimeRang" label="时间段"/>
      <el-table-column prop="status" label="是否可预约"/>
      <el-table-column label="预约学生">
        <template slot-scope="scope" v-if="scope.row.student">
          <el-popover trigger="hover" placement="top">
            <p>学号: {{ scope.row.student.number }}</p>
            <p>专业: {{ scope.row.student.subject }}</p>
            <p>姓名: {{ scope.row.student.name }}</p>
            <p>电话: {{ scope.row.student.phone }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.student.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="指导教师">
        <template slot-scope="scope" v-if="scope.row.teacher">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.teacher.name }}</p>
            <p>邮箱: {{ scope.row.teacher.email }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.teacher.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="audit" label="审核状态"/>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-popover trigger="hover"
            placement="top"
            width="600" v-if="scope.row.labStatusLogs.length!==0">
            <p v-for="item in scope.row.labStatusLogs" :key="item.id">{{item.content}}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium"> 审核日志 </el-tag>
            </div>
          </el-popover>
          <template v-if="scope.row.status === '不可用' && scope.row.audit === '未审'">
            <el-button size="small" type="primary"
                       @click="handleEdit(scope.$index, scope.row,'通过')">通过
            </el-button>
            <el-button size="small" type="danger"
                       @click="handleEdit(scope.$index, scope.row,'不通过')">不通过
          </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total" :page-size="params.size" :current-page="params.page + 1">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: this.$baseUrl + '/lab/status/all?sort=idBookingDate,desc&sort=audit&sort=idBookingTimeRang',
      labUrl: this.$baseUrl + '/labs',
      auditUrl: this.$baseUrl + '/lab/status/audit',
      tableData: [],
      total: 0,
      params: {
        page: 0,
        size: 20,
        labId: null
      },
      labList: []
    }
  },
  created () {
    this.getLabs()
    this.search()
  },
  methods: {
    getLabs () {
      this.$axios.get(this.labUrl).then((res) => {
        this.labList = res.data
      })
    },
    search () {
      this.$axios.get(this.url, {params: this.params}).then((res) => {
        this.tableData = res.data.content
        this.total = res.data.totalElements
      })
    },
    reset () {
      this.params.labId = null
      this.search()
    },
    handleSizeChange (val) {
      this.params.size = val
      this.search()
    },
    handleCurrentChange (val) {
      this.params.page = val - 1
      this.search()
    },
    handleEdit (index, row, oper) {
      this.$confirm('此操作将' + oper + '学生的申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.audit = oper
        this.$axios.put(this.auditUrl, row).then((res) => {
          this.search()
        }).catch(() => {
          row.audit = '未审'
        })
      })
    },
    handleSelectionChange (val) {
    }
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }
</style>
