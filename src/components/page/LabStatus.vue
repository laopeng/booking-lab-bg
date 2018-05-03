<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><i class="el-icon-setting"></i>预约审核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-row :gutter="50">
        <el-col :span="4" class="handle-box">
          <el-select v-model="params.lab" clearable placeholder="请选择实验室" @change="search()">
            <el-option
              v-for="value in labList"
              :key="value.id"
              :label="value.name"
              :value="value.id">
            </el-option>
          </el-select>
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
      <el-table-column prop="student.name" label="预约学生" />
      <el-table-column prop="teacher.name" label="指导教师"/>
      <el-table-column prop="audit" label="审核状态"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.$index, scope.row)">查看
          </el-button>
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
      url: this.$baseUrl + '/lab/status/all?sort=student,desc&sort=audit&sort=idBookingDate&sort=idBookingTimeRang',
      labUrl: this.$baseUrl + '/labs',
      tableData: [],
      total: 0,
      params: {
        page: 0,
        size: 20,
        lab: null
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
    handleSizeChange (val) {
      this.params.size = val
      this.search()
    },
    handleCurrentChange (val) {
      this.params.page = val - 1
      this.search()
    },
    handleEdit (index, row) {
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
