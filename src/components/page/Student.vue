<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><i class="el-icon-setting"></i>学生列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-row :gutter="50">
        <el-col :span="4" class="handle-box">
          <el-input v-model="params.name" placeholder="请输入姓名" clearable @change="search()"></el-input>
        </el-col>
        <el-col :span="4" class="handle-box">
          <el-button type="primary" icon="search" @click="search()">搜 索</el-button>
          <el-button type="primary" icon="close" @click="reset()">重 置</el-button>
        </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%" ref="multipleTable"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"/>
      <el-table-column prop="id" label="编号" width="210"/>
      <el-table-column prop="number" label="学号" width="130"/>
      <el-table-column prop="subject" label="专业"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column prop="isDisable" label="是否被禁用" :formatter="isDisableText"/>
      <el-table-column prop="disableDateTime" label="禁用结束时间"/>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
            <el-button size="small" type="danger"
                       @click="handleDelete(scope.$index, scope.row)">解绑
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
      url: this.$baseUrl + '/students',
      tableData: [],
      total: 0,
      params: {
        page: 0,
        size: 20,
        name: null
      }
    }
  },
  created () {
    this.search()
  },
  methods: {
    search () {
      this.$axios.get(this.url, {params: this.params}).then((res) => {
        this.tableData = res.data.content
        this.total = res.data.totalElements
      })
    },
    reset () {
      this.params.name = null
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
    handleDelete (index, row) {
      this.$confirm('此操作将删除学生绑定的微信账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(this.url + '/' + row.id).then((res) => {
          this.$message.success(res.data)
          this.search()
        })
      })
    },
    handleSelectionChange (val) {
    },
    isDisableText (row, column, cellValue, index) {
      if (cellValue) {
        return '禁用'
      }
    }
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }
</style>
