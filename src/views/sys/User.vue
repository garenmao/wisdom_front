<template>
  <div class="app-container">
    用户列表
    <el-form :inline="true" :model="pageQueryForm" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="pageQueryForm.name" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="pageQueryForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageQuery">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addUser">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        fit
        stripe
        style="width: 100%"
        height="650px">
      <el-table-column
          fixed
          width="70">
        <template slot-scope="scope">
        {{ (pageQueryForm.pageNum - 1) * pageQueryForm.size + scope.$index + 1 }}
      </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="姓名"
          width="100">
      </el-table-column>
      <el-table-column
          label="性别"
          width="80">
        <template slot-scope="scope">
          {{ scope.row.gender ? '男' : '女' }}
        </template>
      </el-table-column>

      <el-table-column width="100" label="角色">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.role | formatRole }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          width="180">
      </el-table-column>
      <el-table-column
          prop="phoneNo"
          label="手机号"
          width="120">
      </el-table-column>
      <el-table-column
          label="注册日期"
          width="150">
        <template slot-scope="scope">
          {{ scope.row.registerDate | formatTimer }}
        </template>
      </el-table-column>
      <el-table-column
          label="上次登录日期"
          width="180">
        <template slot-scope="scope">
          {{ scope.row.lastLoginDate |formatTimer }}
        </template>
      </el-table-column>
      <el-table-column
          label="是否启用"
          width="100">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.disable ? 'primary' : 'success'"
              disable-transitions> {{ scope.row.disable ? '否' : '是' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleOffOn(scope.$index, scope.row)">{{ scope.row.disable ? '启用' : '禁用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @current-change="handleCurrentChange"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        :total="totalSize">
    </el-pagination>

    <el-dialog :title="dialogName" :before-close="dialogClose"
               :visible.sync="dialogFormVisible">
      <el-form
          size="mini"
          :model="userInfo">
        <el-form-item label="姓名">
          <el-input v-model="userInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="resource">
          <el-radio v-model="userInfo.gender" :label='true'>男</el-radio>
          <el-radio v-model="userInfo.gender" :label='false'>女</el-radio>
        </el-form-item>

        <el-form-item label="角色" prop="resource">
          <el-radio v-model="userInfo.role" :label='1'>管理员</el-radio>
          <el-radio v-model="userInfo.role" :label='2'>老师</el-radio>
          <el-radio v-model="userInfo.role" :label='3'>学生</el-radio>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userInfo.phoneNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
              class="upload-demo"
              drag
              :limit="1"
              :headers="headers"
              :action="actionUrl"
              :on-success="handleAvatarSuccess"
              multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import global from '@/components/Comment'
export default {
  data () {
    return {
      tableData: [{
        name: '',
        gender: null,
        email: '',
        phoneNo: '',
        registerDate: '',
        lastLoginDate: '',
        address: ''
      }],
      totalSize: 0,
      dialogFormVisible: false,
      userInfo: {
        id: null,
        name: '',
        gender: '',
        role: '',
        email: '',
        phoneNo: '',
        avatar: ''
      },
      actionUrl: global.httpUrl + '/file',
      pageQueryForm: {
        name: '',
        email: '',
        pageNum: 1,
        size: 10
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogName: '',
      dialogAffirm: 1
    }
  },
  created () {
    this.pageQuery()
    this.$store.commit('setMenuActive', '1-2')
  },
  filters: {
    formatRole: function (value) {
      if (value === 1) {
        return '管理员'
      }
      if (value === 2) {
        return '老师'
      }
      if (value === 3) {
        return '学生'
      }
    }
  },
  methods: {
    handleEdit: function (index, row) {
      this.userInfo.id = row.id
      this.userInfo.name = row.name
      this.userInfo.gender = row.gender
      this.userInfo.email = row.email
      this.userInfo.phoneNo = row.phoneNo
      this.userInfo.avatar = row.avatar
      this.userInfo.role = row.role
      this.dialogName = '修改用户'
      this.dialogAffirm = 2
      this.dialogFormVisible = true
    },
    addUser: function () {
      this.dialogName = '新增用户'
      this.dialogAffirm = 1
      this.dialogFormVisible = true
    },
    saveOrUpdateHandle: function () {
      if (this.dialogAffirm === 1) {
        this.submitAddForm()
      } else {
        this.updateForm()
      }
    },
    dialogClose: function () {
      this.dialogFormVisible = false
      this.clearUserInfo()
    },
    submitAddForm: function () {
      this.$axios.post('user/add', {
        'data': this.userInfo
      }).then(res => {
        this.clearUserInfo()
        this.pageQuery()
        this.dialogFormVisible = false
      })
    },
    handleOffOn: function (index, row) {
      this.$axios.post('user/update', {
        'data': {
          'id': row.id,
          'disable': !row.disable
        }
      }).then(res => {
        row.disable = !row.disable
        this.$message(row.disable ? '禁用成功' : '启用成功')
      })
    },
    pageQuery: function () {
      this.$axios.post('user/list', {
        'data': this.pageQueryForm
      }).then(res => {
        this.tableData = res.data.data.list
        this.totalSize = res.data.data.total
      })
    },
    handleCurrentChange: function (val) {
      this.pageQueryForm.pageNum = val
      this.pageQuery()
    },
    handleAvatarSuccess: function (res) {
      this.userInfo.avatar = res.data
    },
    clearUserInfo: function () {
      this.userInfo.id = null
      this.userInfo.name = null
      this.userInfo.gender = null
      this.userInfo.email = null
      this.userInfo.phoneNo = null
      this.userInfo.avatar = null
    },
    updateForm: function () {
      this.$axios.post('user/update', {
        'data': this.userInfo
      }).then(res => {
        this.clearUserInfo()
        this.pageQuery()
        this.dialogFormVisible = false
      })
    },
    cancelDialog: function () {
      this.clearUserInfo()
      this.dialogFormVisible = false
    }
  }
}
</script>

<style>
</style>
