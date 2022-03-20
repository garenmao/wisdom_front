<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="3" :offset="21">
        <el-input class="course_search"
                  placeholder="搜索从这里开始..."
                  prefix-icon="el-icon-search"
                  @change="queryIndexPage"
                  size="small"
                  v-model="queryForm.title">
        </el-input>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex">
      <el-col :span="2" offset="1">
        <span><strong>课程类别:</strong></span>
      </el-col>
      <el-col :span="1">
        <el-link :underline="false">
          <span
              v-bind:class="{ active: selectId === -1 }"
              @click="subjectSpanClick(-1)">全部
          </span>
        </el-link>
      </el-col>
      <el-col :span="1" :key="item.id" v-for="item in subjectList">
        <el-link :underline="false">
          <span
              class="static"
              v-bind:class="{ active: selectId === item.id }"
              @click="subjectSpanClick(item.id)">{{ item.title }}
          </span>
        </el-link>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex" align="middle">
      <el-col :span="1" offset="1">
        <span><strong>搜索:</strong></span>
      </el-col>
      <el-col :span="4">
        <el-input class="course_search1"
                  placeholder="请输入您要搜索的课程"
                  prefix-icon="el-icon-search"
                  size="mini"
                  v-model="queryForm.title">
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button size="mini" type="success" plain @click="queryIndexPage">搜索</el-button>
      </el-col>
    </el-row>
    <el-row gutter="20" type="flex" :key="item.index" v-for="item in courseList">
      <el-col :span="2"></el-col>
      <el-col :span="5" :key="course.id" v-for="course in item">
          <div class="course">
            <router-link :to="'/videoPage/'+course.id">
              <img class="courseImage" :src="course.cover">
            </router-link>
            <el-row>
              <el-col :span="20">
                <span>{{ course.title }}</span>
              </el-col>
              <el-col :span="4">
                <i class="el-icon-view">{{ course.viewCount ? course.viewCount: 0 }}</i>
              </el-col>
            </el-row>
          </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'CoursePage',
  data () {
    return {
      activeName: 'second',
      pageNum: null,
      pageSize: null,
      total: null,
      queryForm: {
        pageNum: 1,
        size: 12,
        subjectParentId: null,
        status: 1,
        title: null
      },
      courseList: [],
      subjectList: [],
      selectId: -1
    }
  },
  methods: {
    subjectSpanClick (id) {
      if (id === -1) {
        this.queryForm.subjectParentId = null
      } else {
        this.queryForm.subjectParentId = id
      }
      this.selectId = id
      this.queryIndexPage()
    },
    queryIndexPage () {
      this.$axios.post('/course/pageCourseList', {
        data: this.queryForm
      }).then(res => {
        this.courseList = res.data.data.list
        this.total = res.data.data.total
        this.pageNum = res.data.data.pageNum
        this.pageSize = res.data.data.pageSize
      })
    },
    handleCurrentChange: function (val) {
      this.queryForm.pageNum = val
      this.queryIndexPage()
    },
    initSubject: function () {
      const _this = this
      this.$axios.get('/subject/queryAllFirstLevel').then(res => {
        _this.subjectList = res.data.data
        if (_this.subjectList) {
          _this.queryForm.subjectParentId = _this.subjectList[0].id
        }
      })
    }
  },
  created () {
    this.initSubject()
    this.queryIndexPage()
    this.$store.commit('SET_USERTYPE', 'student')
  }
}
</script>

<style scoped>

.course_search {
  width: 200px;
  float: right;
}

.course_search1 {
  width: 200px;
}

.el-divider {
  margin: 15px;
}

.course {
  width: 224px;
  height: 150px;
  margin: 20px;
  border-radius: 20px;
}

.courseImage {
  width: 224px;
  height: 124px;
  border-radius: 5px;
}

.active {
  color: #17B3A3;
  border-radius: 1px;
}
</style>
