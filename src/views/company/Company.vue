
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
       
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.companyName" placeholder="输入公司名"></el-input>
      </el-form-item>
     
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
        
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small"  :data="companyData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" sortable prop="companyId" label="公司id" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="companyName" label="名称" width="120">
      </el-table-column>

      
        <el-table-column align="center"  sortable prop="trade" label="所属行业" width="240">
        
          <!-- <template slot-scope="scope">{{ scope.row.trade =  getTrade(scope.row.trade ) }}</template> -->
                                    
        </el-table-column>
      <el-table-column align="center" sortable prop="scale" label="规模" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="location" label="所在地" width="120">
      </el-table-column>
        <el-table-column align="center" sortable prop="postionNum" label="招聘总人数" width="150">
      </el-table-column>
       <el-table-column align="center" sortable prop="state" label="状态" min-width="80">
          <template slot-scope="scope">{{ scope.row.state === 1 ? '正常' : '下架' }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button  v-show="scope.row.state == 1"  size="mini" type="danger" @click="companyExpireToken(scope.$index, scope.row,'下架')">下架</el-button>
           <el-button  v-show="scope.row.state == 0"  size="mini" type="primary" @click="companyExpireToken(scope.$index, scope.row,'上架')">上架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="公司名称" prop="CompanyName">
          <el-input size="small" v-model="editForm.companyName" auto-complete="off" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="logo" prop="logo">
          <el-input size="small" v-model="editForm.logo" auto-complete="off" placeholder="请输入公司logo地址"></el-input>
        </el-form-item>
        
        <el-form-item label="行业" prop="trade">
           <el-select size="small" v-model="editForm.trade" placeholder="请选择" class="userRole">
            <el-option label="互联网" value="1"></el-option>
            <el-option label="教育培训" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规模" prop="scale">
          <el-select size="small" v-model="editForm.scale" placeholder="请选择" class="userRole">
            <el-option label="1000人以下" value="1000人以下"></el-option>
            <el-option label="1000-10000人" value="1000-10000人"></el-option>
             <el-option label="10000人以上" value="10000人以上"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="location">
          <el-input size="small" v-model="editForm.location" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input size="small" v-model="editForm.description" placeholder="请输入描述"></el-input>
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
  companyList,
  addCompany,
  updateCompany,
  companyExpireToken,
  
  
} from '../../api/companyMG'
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
    
      // 编辑与添加
      editForm: {
        companyId:'',
        companyName: '',
        logo: '',
        scale: '',
        trade:'',
        location: '',
        description: '',
        token: localStorage.getItem('logintoken')
      },
    
   
      // rules表单验证
      rules: {
        companyName: [
          { required: true, message: '请输入公司名', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请输入公司logo', trigger: 'blur' }
        ],
        trade: [{ required: true, message: '请选择行业', trigger: 'blur' }],
        scale: [{ required: true, message: '请选择规模', trigger: 'blur' }],
        location: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入公司描述', trigger: 'blur' }
        ],
      },
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
      companyData: [],
     
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      
      
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
       * 调用接口，注释上面模拟数据 取消下面注释
       */
     
       companyList(parameter).then(res => {
         
        this.loading = false
        if (res.result == "error") {
          this.$message({
            type: 'info',
            message: res.message
          })
        } else {
          this.companyData = res.data
          this.tradeData = res.arrayList;
       
          // 分页赋值
          this.pageparm.currentPage = this.formInline.page
          this.pageparm.pageSize = this.formInline.limit
          this.pageparm.total = this.companyData.length
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
    
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
     
      if (row != undefined && row != 'undefined') {
        this.title = '修改公司'
         console.log(row)
        this.editForm.companyId = row.companyId
        this.editForm.companyName = row.companyName
        this.editForm.logo = row.logo
        this.editForm.scale = row.scale
        this.editForm.trade = row.trade
        this.editForm.location = row.location
        this.editForm.description = row.description
      } else {
        this.title = '添加公司'
        this.isAdd = true
        this.editForm.companyName = row.companyName
        this.editForm.logo = row.logo
        this.editForm.scale = row.scale
        this.editForm.trade = row.trade
        this.editForm.scale = row.scale
        this.editForm.description = row.description
      }
    },
    // 编辑、添加提交方法
    submitForm(editData) {
      console.log(this.isAdd)
      if(this.isAdd ){
        this.$refs[editData].validate(valid => {
        if (valid) {
          // 请求方法
          addCompany(this.editForm)
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
      }else{
        updateCompany(this.editForm)
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
      }
      
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
    
    
    // 下线公司
    companyExpireToken(index, row) {

      this.$confirm('确定要让' + row.companyName + '公司下架吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          companyExpireToken({companyId:row.companyId})
            .then(res => {
              if (res.result == 'success' && res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '公司' + row.companyName  + '成功！'
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
              this.$message.error('公司下架' +'失败，请稍后再试！')
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

 