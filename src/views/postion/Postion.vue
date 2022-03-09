<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>职位管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.isLock" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="N"></el-option>
          <el-option label="已锁定" value="Y"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.userName" placeholder="输入职位名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="postionData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" sortable prop="postionId" label="职位id" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="companyId" label="公司id" width="120">
      </el-table-column>
       <el-table-column align="center" sortable prop="publicerId" label="发布者id" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="postionName" label="职位名称" width="120">
          
      </el-table-column>
     <el-table-column align="center" sortable prop="salary" label="薪资" width="120">
          
      </el-table-column>
      <el-table-column align="center" sortable prop="demandEducation" label="学历要求" width="120">
          
      </el-table-column>
      
        <el-table-column align="center" sortable prop="location" label="地址" width="80">
      </el-table-column>
      <el-table-column align="center" sortable prop="publicDate" label="发布时间" min-width="80">
      </el-table-column>
      <el-table-column align="center" sortable prop="num" label="招聘人数" min-width="120">
      </el-table-column>
       <el-table-column align="center" sortable prop="state" label="状态" min-width="80">
          <template slot-scope="scope">{{ scope.row.state === 1 ? '正常' : '下架' }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button  v-show="scope.row.state == 1"  size="mini" type="danger" @click="offlinePostion(scope.$index, scope.row,'下架')">下架</el-button>
           <el-button  v-show="scope.row.state == 0"  size="mini" type="primary" @click="offlinePostion(scope.$index, scope.row,'上架')">上架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="职位名称" prop="postionName">
          <el-input size="small" v-model="editForm.postionName" auto-complete="off" placeholder="请输入职位名称"></el-input>
        </el-form-item>
        <el-form-item label="salary" prop="salary">
          <el-input size="small" v-model="editForm.salary" auto-complete="off" placeholder="请输入薪资"></el-input>
        </el-form-item>
        
        <el-form-item label="学历要求" prop="demandEducation">
           <el-select size="small" v-model="editForm.demandEducation" placeholder="请选择" class="demandEducation">
            <el-option label="不限" value="不限"></el-option>
            <el-option label="本科以下" value="本科以下"></el-option>
            <el-option label="本科" value="本科"></el-option>
            <el-option label="硕士" value="硕士"></el-option>
            <el-option label="博士" value="博士"></el-option>
          </el-select>
        </el-form-item>
      
        <el-form-item label="地址" prop="location">
          <el-input size="small" v-model="editForm.location" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="招收人数" prop="num">
          <el-input size="small" v-model="editForm.num" placeholder="请输入招收人数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入请求方法
import {
  postionList,
  postionExpireToken,
  updatePostion

} from '../../api/postionMg'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
       nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      title: '添加公司',
      isAdd : false,
      editFormVisible: false, //控制编辑页面显示与隐藏
      
       editForm: {
        postionId:'',
        postionName: '',
        location: '',
        num:'',
        salary:'',
        demandEducation:'',
        token: localStorage.getItem('logintoken')
      },
       // rules表单验证
      rules: {
        postionName: [
          { required: true, message: '请输入公司名', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
        num: [{ required: true, message: '请输入招收人数', trigger: 'blur' }],
        salary: [{ required: true, message: '请输入薪资', trigger: 'blur' }],
        demandEducation: [{ required: true, message: '请选择学历要求', trigger: 'blur' }],
    
      },

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
    
      },
      //用户数据
      postionData: [],

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
      postionList(parameter).then(res => {
         
        this.loading = false
        if (res.result == "error") {
          this.$message({
            type: 'info',
            message: res.message
          })
        } else {
          this.postionData = res.data
       
          // 分页赋值
          this.pageparm.currentPage = this.formInline.page
          this.pageparm.pageSize = this.formInline.limit
          this.pageparm.total = this.postionData.length
        }
      })
    },
    // 分页插件事件
    callFather(parm) {
        console.log(parm)
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    //搜索事件
    search() {
      this.getdata(this.formInline)
    },
  
  
    offlinePostion(index, row,opertion) {
      this.$confirm('确定要'+ opertion + row.postionName + '职位吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          postionExpireToken({postionId:row.postionId})
            .then(res => {
              if (res.result == 'success' && res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '职位' + row.postionName + opertion + '成功！'
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
              this.$message.error('职位'+ opertion +'失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
     //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
     
      if (row != undefined && row != 'undefined') {
        this.title = '修改职位'
         console.log(row)
        this.editForm.postionId= row.postionId
        this.editForm.postionName= row.postionName
        this.editForm.location = row.location
        this.editForm.num = row.num
        this.editForm.salary = row.salary
        this.editForm.demandEducation = row.demandEducation

      } 
    },
    // 编辑、添加提交方法
    submitForm(editData) {
        this.$refs[editData].validate(valid => {
        if (valid) {
          // 请求方法
          updatePostion(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.result == 'success' && res.code == 200) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '数据保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },
        
        
    
    
    handleClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([])
        this.$refs.tree.setCheckedNodes([data])
        this.unitparm.deptId = data.id
        this.unitparm.deptName = data.name
        //交叉点击节点
      } else {
      }
    },
   
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == 'edit') {
        this.editFormVisible = false
      } else if (dialog == 'perm') {
        this.dataAccessshow = false
      } else if (dialog == 'unit') {
        this.unitAccessshow = false
      }
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

 