<template>
  <div class="app-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/courseManger' }">课程列表</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">章节管理</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="videoQuery.title" placeholder="章节名称"/>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="queryPage()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="success" icon="el-icon-edit" @click="addVideo()">新增</el-button>
    </el-form>

    <el-table
        :data="videoList"
        style="width: 100%"
        row-key="id"
        fit
        stripe
        lazy
        highlight-current-row>

      <el-table-column
          width="70"
          label="序号"
          align="center">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="章节名称" width="200"/>

      <el-table-column prop="duration" label="时长" width="90"/>
      <el-table-column prop="size" label="文件大小" width="90"/>
      <el-table-column prop="sort" label="排序分" width="90"/>
      <el-table-column prop="" label="添加时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.createDate | formatTimer }}
        </template>
      </el-table-column>

      <el-table-column prop="playCount" label="浏览量" width="80"/>
<!--      <el-table-column prop="praiseCount" label="点赞数" width="80"/>-->
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editVideo(scope.$index, scope.row)">编辑
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-edit" @click="deleteVideo(scope.$index, scope.row)">删除
          </el-button>
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
        <el-form-item label="章节名称" label-width="68px">
          <el-input class="inline-input" v-model="editForm.title" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序分" label-width="68px">
          <el-input v-model="editForm.sort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程上传" label-width="68px">
          <el-upload
              class="upload-demo"
              drag
              :limit="1"
              :headers="headers"
              :action="actionUrl"
              :on-success="handleFileSuccess"
              :before-upload="handleFileBeforeUpload"
              ref="courseUpload"
              multiple>
            <video v-if="editForm.videoSource !='' && showVideo" :src="editForm.videoSource"
                   class="avatar video-avatar"
                   controls="controls">
            </video>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传map4文件，且不超过1024M</div>
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
import global from '@/components/Comment'

export default {
  name: 'VideoList',
  data () {
    return {
      courseId: null,
      pageNum: 1, // 当前页
      pageSize: 10, // 每页记录数
      total: 0, // 总记录数
      videoQuery: {
        title: null,
        courseId: null,
        pageNum: 1,
        size: 10
      },
      videoList: [],
      dialogName: '上传章节',
      editForm: {
        id: null,
        courseId: null,
        title: null,
        duration: null,
        size: null,
        videoSource: null,
        videoOriginalName: null
      },
      actionUrl: global.httpUrl + '/file',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      showVideo: false,
      dialogFormVisible: false
    }
  },
  methods: {
    queryPage () {
      this.videoQuery.courseId = this.courseId
      this.$axios.post('video/list', {
        data: this.videoQuery
      }).then(res => {
        this.videoList = res.data.data.list
        this.total = res.data.data.total
        this.pageNum = res.data.data.pageNum
        this.size = res.data.data.pageSize
      })
    },
    resetData () {
      debugger
    },
    editVideo (index, row) {
      this.dialogName = '编辑章节'
      this.$set(this.editForm, 'id', row.id)
      this.$set(this.editForm, 'courseId', row.courseId)
      this.$set(this.editForm, 'sort', row.sort)
      this.$set(this.editForm, 'title', row.title)
      this.$set(this.editForm, 'videoSource', row.videoSource)
      if (row.videoSource) {
        this.showVideo = true
      }
      this.dialogFormVisible = true
    },
    deleteVideo (index, row) {
      this.$axios.delete('video/' + row.id).then(res => {
        this.$message(res.data.code === 200 ? '删除成功' : res.data.message)
        this.queryPage()
      })
    },
    addVideo () {
      this.dialogFormVisible = true
      this.editForm.courseId = this.courseId
    },
    dialogClose () {
      this.dialogFormVisible = false
      this.editForm = {}
      this.showVideo = false
    },
    handleFileSuccess (res, file) {
      this.editForm.videoSource = res.data
      if (this.editForm.videoSource) {
        this.showVideo = true
      }
      this.$refs.courseUpload.clearFiles()
    },
    handleFileBeforeUpload (file, index) {
      const _this = this
      _this.editForm.size = file.size
      _this.editForm.videoOriginalName = file.name
      let url = URL.createObjectURL(file)
      const audioElement = new Audio(url)
      audioElement.addEventListener('loadedmetadata', function () {
        _this.editForm.duration = audioElement.duration // playTime就是当前视频长度
      })
    },
    saveOrUpdateHandle () {
      this.$axios.post('video/saveOrUpdate', {
        data: this.editForm
      }).then(res => {
        this.dialogFormVisible = false
        this.editForm = {}
        this.showVideo = false
        this.queryPage()
      })
    },
    handleCurrentChange: function (val) {
      this.videoQuery.pageNum = val
      this.queryPage()
    }
  },
  created () {
    this.courseId = this.$route.params.courseId
    this.queryPage()
  }
}
</script>

<style scoped>
.el-input {
  width: 150px;
}
</style>
