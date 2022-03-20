<template>
  <div class="app-container">
    课程列表

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option value=1 label="已发布"/>
          <el-option value=2 label="未发布"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="queryPage()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="success" icon="el-icon-edit" @click="addCourse()">新增</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
        :data="courseList"
        style="width: 100%"
        row-key="id"
        fit
        stripe
        lazy
        highlight-current-row>

      <el-table-column
          width="70"
          align="center">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="200"/>

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '已发布' : '未发布' }}
        </template>
      </el-table-column>
      <el-table-column prop="teacherName" label="授课讲师" width="150"/>
      <el-table-column label="分类" width="180">
        <template slot-scope="scope">
          {{ scope.row.subjectParentName + '-' + scope.row.subjectName }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="90"/>

      <el-table-column prop="" label="添加时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.createDate | formatTimer }}
        </template>
      </el-table-column>

      <el-table-column prop="viewCount" label="浏览量" width="80"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCourse(scope.$index, scope.row)">编辑
          </el-button>
          <router-link :to="'/Video/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">章节管理</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
    />

    <el-dialog :title="dialogName" :before-close="dialogClose"
               :visible.sync="dialogFormVisible">
      <el-form
          size="mini"
          :model="editForm">
        <el-form-item label="课程分类">
          <el-cascader :options="options" @change="changeCascader" :value="editForm.subjectId"></el-cascader>
        </el-form-item>
        <el-form-item label="授课讲师">
          <el-autocomplete
              class="inline-input"
              v-model="editForm.teacherName"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="课程名称" label-width="68px">
          <el-input class="inline-input" v-model="editForm.title" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="resource" label-width="68px">
          <el-radio v-model="editForm.status" :label='1'>已发布</el-radio>
          <el-radio v-model="editForm.status" :label='2'>未发布</el-radio>
        </el-form-item>
        <el-form-item label="课时" label-width="68px">
          <el-input v-model="editForm.lessonNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程封面" label-width="68px">
          <el-upload
              class="upload-demo"
              drag
              :limit="1"
              :headers="headers"
              :action="actionUrl"
              :on-success="handleFileSuccess"
              ref="courseUpload"
              multiple>
            <el-image :src="editForm.cover" v-show="showCover"></el-image>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateHandle">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
// 引入调用teacher.js文件
// import course from '@/api/edu/course'
import global from '@/components/Comment'

export default {
  data () { // 定义变量和初始值
    return {
      courseList: [], // 查询之后接口返回集合
      pageNum: 1, // 当前页
      pageSize: 10, // 每页记录数
      total: 0, // 总记录数
      options: [],
      courseQuery: {
        title: '',
        status: '',
        pageNum: 1,
        size: 10
      },
      actionUrl: global.httpUrl + '/file',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      editForm: {
        id: null,
        teacherId: null,
        subjectId: null,
        subjectParentId: null,
        title: null,
        lessonNum: null,
        cover: null,
        status: null,
        teacherName: null,
        subjectName: null,
        subjectParentName: null
      },
      dialogName: '',
      dialogFormVisible: false,
      restaurants: [],
      showCover: false
    }
  },
  created () {
    this.queryPage()
    this.loadAll()
    this.$store.commit('setMenuActive', '3-5')
  },
  methods: {
    queryPage: function () {
      this.$axios.post('course/list', {
        'data': this.courseQuery
      }).then(res => {
        this.courseList = res.data.data.list
        this.total = res.data.data.total
        this.pageNum = res.data.data.pageNum
        this.size = res.data.data.pageSize
      })
    },
    handleCurrentChange: function (val) {
      this.courseQuery.pageNum = val
      this.queryPage()
    },
    resetData: function () {
      this.courseQuery.title = null
      this.courseQuery.status = null
    },
    addCourse: function () {
      this.initCascader()
      this.showCover = false
      this.dialogName = '新增课程'
      this.dialogFormVisible = true
    },
    editCourse: function (index, row) {
      this.initCascader()
      this.showCover = false
      this.dialogName = '修改课程'
      this.$set(this.editForm, 'id', row.id)
      this.$set(this.editForm, 'teacherId', row.teacherId)
      this.$set(this.editForm, 'subjectId', row.subjectId)
      this.$set(this.editForm, 'subjectParentId', row.subjectParentId)
      this.$set(this.editForm, 'title', row.title)
      this.$set(this.editForm, 'lessonNum', row.lessonNum)
      this.$set(this.editForm, 'cover', row.cover)
      this.$set(this.editForm, 'status', row.status)
      this.$set(this.editForm, 'teacherName', row.teacherName)
      this.$set(this.editForm, 'subjectName', row.subjectName)
      this.$set(this.editForm, 'subjectParentName', row.subjectParentName)
      // this.editForm.id = row.id
      // this.editForm.teacherId = row.teacherId
      // this.editForm.subjectId = row.subjectId
      // this.editForm.subjectParentId = row.subjectParentId
      // this.editForm.header = row.header
      // this.editForm.lessonNum = row.lessonNum
      // this.editForm.cover = row.cover
      // this.editForm.status = row.status
      // this.editForm.teacherName = row.teacherName
      // this.editForm.subjectName = row.teacherName
      // this.editForm.subjectParentName = row.subjectParentName
      this.dialogFormVisible = true
      if (this.editForm.cover) {
        this.showCover = true
      }
    },
    dialogClose: function () {
      this.dialogFormVisible = false
      this.editForm = {}
    },
    saveOrUpdateHandle: function () {
      const _this = this
      this.$axios.post('course/saveOrUpdate', {
        'data': this.editForm
      }).then(res => {
        _this.editForm = {}
        _this.queryPage()
        _this.dialogFormVisible = false
      })
    },
    initCascader: function () {
      this.$axios.get('subject/cascader').then(res => {
        this.options = res.data.data
      })
    },
    changeCascader: function (val) {
      if (val) {
        this.editForm.subjectParentId = val[0]
        this.editForm.subjectId = val[1]
      }
    },
    querySearch (queryString, cb) {
      const restaurants = this.restaurants
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll () {
      this.$axios.get('user/listAllTeachers').then(res => {
        this.restaurants = res.data.data
      })
    },
    handleSelect (value) {
      this.editForm.teacherId = value.id
    },
    handleFileSuccess (res) {
      this.editForm.cover = res.data
      if (this.editForm.cover) {
        this.showCover = true
      }
      this.$refs.courseUpload.clearFiles()
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 150px;
}
</style>
