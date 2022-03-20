<template>
  <el-container>
    <el-header height="10px">
      <el-row type="flex">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/coursePage' }">课程</el-breadcrumb-item>
          <el-breadcrumb-item>{{ courseInfo.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
    </el-header>
    <el-divider></el-divider>
    <el-container>
      <el-main>
        <el-row type="flex">
          <el-col :span="10" :offset="2">
            <span style="font-size: 18px; color: #17B3A3">{{ courseInfo.videoTitle }}</span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="20" :offset="2">
            <div>
              <video
                  id="playVideos"
                  style="width: 100%"
                  controls="controls">
              </video>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <!-- 课程目录-->
      <el-aside width="300px" class="videAside">
        <el-row type="flex">
          <el-col :span="19" :offset="1">
            <span style="font-size:17px; color: #17B3A3">课程目录</span>
            <i class="el-icon-video-camera"></i>
          </el-col>
          <el-col :span="4"><span style="color: #17B3A3">共({{ courseInfo.lessonNum }})集</span></el-col>
        </el-row>
        <el-row type="flex" :key="video.id" v-for="video in videoList">
          <el-col :span="23" :offset="1" class="videoListClass">
            <span
                class="static"
                v-bind:class="{ active: selectId === video.id }"
                @click="selectVideo(video)">{{ video.title }}</span>
          </el-col>
        </el-row>
      </el-aside>
    </el-container>
    <el-footer>
      <el-divider></el-divider>
      <el-row type="flex">
        <el-col :span="2" :offset="2">
          <span style="font-size: 17px; color: cadetblue">评论 （{{ commentInfo.total }}）</span>
        </el-col>
        <el-col :span="2">
          <a @click="dianZan"><i class="iconfont icon-dianzan"
                                 v-bind:class="{ dianZan: isDianZan}"></i></a>
          <span style="font-size: 10px; color: cadetblue">{{ dianZanNum }}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <!-- 评论-->
      <el-row type="flex">
        <el-col :span="1" :offset="2">
          <el-avatar icon="el-icon-user-solid"></el-avatar>
        </el-col>
        <el-col :span="16">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="发一条友善的评论"
              v-model="addCommentData.comment">
          </el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button type="primary" @click="deployComment" size="medium">发布</el-button>
        </el-col>
      </el-row>

      <el-divider></el-divider>
      <div :key="comment.id" v-for="comment in commentInfo.list">
        <el-row type="flex" align="middle">
          <el-col :span="1" :offset="2">
            <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
          </el-col>
          <el-col :span="2">
            <span style="color: grey; font-size: 10px">{{ comment.userName }}</span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="21" :offset="3">
            <span>{{ comment.comment }}</span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="21" :offset="3">
            <span style="color: grey; font-size: 10px">评论时间: {{ comment.createDate | formatTimer }}</span>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </div>

      <!-- 分页 -->
      <el-pagination
          :current-page="commentInfo.pageNum"
          :page-size="commentInfo.pageSize"
          :total="commentInfo.total"
          style="padding: 30px 0; text-align: center;"
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import '@/assets/icon/iconfont.css'
import router from '../../router'

export default {
  name: 'VideoPage',
  data () {
    return {
      courseId: null,
      selectId: null,
      courseInfo: {
        title: '',
        videoTitle: '',
        lessonNum: 0
      },
      videoList: [],
      commentInfo: {
        pageNum: 0,
        pageSize: 0,
        total: 0,
        list: []
      },
      addCommentData: {
        comment: null,
        courseId: null
      },
      commentQuery: {
        pageNum: 1,
        size: 10,
        courseId: null
      },
      isDianZan: false,
      dianZanNum: 0,
      eduThumbBody: {
        businessId: null,
        businessType: 1,
        thumbUp: false
      },
      queryDianZanBody: {
        businessId: null,
        businessType: 1
      }
    }
  },
  methods: {
    deployComment () {
      this.addCommentData.courseId = this.courseId
      this.$axios.post('comment/add', {
        data: this.addCommentData
      }).then(res => {
        if (res.data.code === 200) {
          this.addCommentData.comment = null
          this.$message('发布成功')
          this.commentInfo.pageNum = 1
          this.refreshCommentList()
        } else {
          this.$message('发布失败')
        }
      })
    },
    initVideoList () {
      this.$axios.get('video/listVideoByCourseId/' + this.courseId).then(res => {
        this.videoList = res.data.data
        if (this.videoList) {
          this.courseInfo.lessonNum = this.videoList.length
          this.selectVideo(this.videoList[0])
        }
      })
    },
    initCourseList () {
      this.$axios.get('course/queryCourseById/' + this.courseId).then(res => {
        this.courseInfo.title = res.data.data.title
      })
    },
    refreshCommentList () {
      this.commentQuery.courseId = this.courseId
      this.$axios.post('comment/listPageInfo', {
        data: this.commentQuery
      }).then(res => {
        this.commentInfo.list = res.data.data.list
        this.commentInfo.total = res.data.data.total
        this.commentInfo.pageNum = res.data.data.pageNum
        this.commentInfo.pageSize = res.data.data.pageSize
      })
    },
    selectVideo (video) {
      this.selectId = video.id
      this.courseInfo.videoTitle = video.title
      let vdo = document.getElementById('playVideos')
      vdo.src = video.videoSource
    },
    handleCurrentChange (val) {
      this.commentQuery.pageNum = val
      this.refreshCommentList()
    },
    viewCountIncr () {
      this.$axios.get('course/viewCountIncr/' + this.courseId)
    },
    dianZan () {
      this.isDianZan = !this.isDianZan
      if (this.isDianZan) {
        this.eduThumbBody.businessId = this.courseId
        this.eduThumbBody.thumbUp = this.isDianZan
        this.$axios.post('thumbUp/add', {
          data: this.eduThumbBody
        }).then(res => {
          this.dianZanNum = this.dianZanNum + 1
        })
      } else {
        this.eduThumbBody.businessId = this.courseId
        this.eduThumbBody.thumbUp = this.isDianZan
        this.$axios.post('thumbUp/add', {
          data: this.eduThumbBody
        }).then(res => {
          this.dianZanNum = this.dianZanNum - 1
        })
      }
    },
    queryDianZan () {
      this.queryDianZanBody.businessId = this.courseId
      this.$axios.post('thumbUp/queryThumbUp', {
        data: this.queryDianZanBody
      }).then(res => {
        this.isDianZan = res.data.data.thumbUp
        this.dianZanNum = res.data.data.count
      })
    }
  },
  created () {
    if (localStorage.getItem('token') === null) {
      router.push('/studentLogin')
    } else {
      this.courseId = this.$route.params.courseId
      this.initVideoList()
      this.initCourseList()
      this.refreshCommentList()
      this.viewCountIncr()
      this.$store.commit('SET_USERTYPE', 'student')
    }
    this.queryDianZan()
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}

.el-main {
  padding: 0px;
}

.el-divider {
  margin: 15px;
}

.videAside {
  background: #f4f4f4;
}

.videoListClass {
  /*margin: 10px;*/
  margin-top: 20px;
  color: #17B3A3;
}

.active {
  color: #333333;
}

.dianZan {
  color: red;
}
</style>
