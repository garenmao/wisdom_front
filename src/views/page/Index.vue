<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="3" :offset="21">
        <el-input class="course_search"
                  placeholder="搜索从这里开始..."
                  prefix-icon="el-icon-search"
                  size="small"
                  v-model="input2">
        </el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="3">
        <i class="el-icon-s-opportunity" style="font-size: 20px;">好课推荐</i>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row gutter="20" type="flex" :key="item.index" v-for="item in popularEduCourseDtos">
      <el-col :span="2"></el-col>
      <el-col :span="5" :key="popularCourse.index" v-for="popularCourse in item">
        <div class="course">
          <router-link :to="'/videoPage/'+popularCourse.id">
            <img class="courseImage" :src="popularCourse.cover">
          </router-link>
          <el-row>
            <el-col :span="20">
              <span>{{ popularCourse.title }}</span>
            </el-col>
            <el-col :span="4">
              <i class="el-icon-view">{{ popularCourse.viewCount ? popularCourse.viewCount : 0}}</i>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-divider></el-divider>
    <el-row type="flex" justify="center">
      <el-col :span="3">
        <i class="el-icon-s-opportunity" style="font-size: 20px;">最新课程</i>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row gutter="20" type="flex" :key="item.index" v-for="item in newestEduCourseDtos">
      <el-col :span="2"></el-col>
      <el-col :span="5" :key="newestCourse.index" v-for="newestCourse in item">
        <div class="course">
          <router-link :to="'/videoPage/'+newestCourse.id">
            <img class="courseImage" :src="newestCourse.cover">
          </router-link>
          <el-col :span="20">
            <span>{{ newestCourse.title }}</span>
          </el-col>
          <el-col :span="4">
            <i class="el-icon-view">{{ newestCourse.viewCount ? newestCourse.viewCount: 0}}</i>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      popularEduCourseDtos: [],
      newestEduCourseDtos: []
    }
  },
  methods: {
    queryIndexPage () {
      this.$axios.get('/course/pageIndexQuery').then(res => {
        this.popularEduCourseDtos = res.data.data.popularEduCourseDtos
        this.newestEduCourseDtos = res.data.data.newestEduCourseDtos
      })
    }
  },
  created () {
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

.course {
  width: 224px;
  height: 150px;
  margin: 10px;
  border-radius: 20px;
}

.courseImage {
  width: 224px;
  height: 124px;
  border-radius: 5px;
}
</style>
