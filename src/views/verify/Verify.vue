
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>认证管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
      
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.userName" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>  
    <!--列表-->
    <el-table size="small"  :data="verifyData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" sortable prop="userId" label="申请者id" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="userName" label="申请者姓名" width="120">
      </el-table-column>
       <el-table-column align="center" sortable prop="companyId" label="公司id" width="240">
      </el-table-column>
      <el-table-column align="center" sortable prop="department" label="部门" width="120">

      </el-table-column>
        <el-table-column align="center" sortable prop="jobNumber" label="工号" width="120">
      </el-table-column>
        <el-table-column align="center" sortable prop="applyDate" label="申请时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="state" label="状态" min-width="80">
          <template slot-scope="scope">{{ scope.row.state === 1 ? '通过' : '未审核' }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
   
           <el-button  v-show="scope.row.state == 0"  size="mini" type="primary" @click="offlineVerify(scope.$index, scope.row,'通过')">通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>

<script>
// 导入请求方法
import {
  verifyList,
  verifyExpireToken
 
} from '../../api/verifyMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      
      loading: false, //是显示加载
      
      // 选择数据
      selectdata: [],
      // 用户下线
      offline: {
        token: localStorage.getItem('logintoken')
      },
      // 请求数据参数
      formInline: {
        page: 1,
        limit: 10,
        deptId: '',
        userName: '',
        userMobile: '',
        isLock: ''
      },
      //用户数据
      verifyData: [],

      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },

  /**
   * 数据发生改变
   */
  watch: {},

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline)
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取数据方法
    getdata(parameter) {
      this.loading = true

      /***
       * 用户列表
       */
      verifyList(parameter).then(res => {
         
        this.loading = false
        if (res.result == "error") {
          this.$message({
            type: 'info',
            message: res.message
          })
        } else {
          this.verifyData = res.data
       
          // 分页赋值
          this.pageparm.currentPage = this.formInline.page
          this.pageparm.pageSize = this.formInline.limit
          this.pageparm.total = this.verifyData.length
        }
      })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    //搜索事件
    search() {
      this.getdata(this.formInline)
    },
  
    // 申请审核
    offlineVerify(index, row,opertion) {
      this.$confirm('确定要'+ opertion + row.userId + '用户的申请吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          verifyExpireToken({id:row.id})
            .then(res => {
              if (res.result == 'success' && res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '用户' + row.userId + '申请通过！'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.mesasge
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('用户申请'+'失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
   
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

 