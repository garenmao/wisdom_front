<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="14" :offset="1">
        <div id="userGrowth" :style="{width: '600px', height: '400px'}"></div>
      </el-col>
      <el-col :span="8" :offset="1">
        <div id="pieChart" :style="{width: '300px', height: '500px'}"></div>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="23" :offset="1">
        <div id="topCourse" :style="{width: '1100px', height: '400px'}"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data () {
    return {
    }
  },
  mounted () {
    this.drawLine()
    this.drawPipe()
    this.drawTopCourse()
  },
  methods: {
    drawLine () {
      this.$axios.get('/user/userGrowth').then(res => {
        let data = res.data.data
        debugger
        // 基于准备好的dom，初始化echarts实例
        let userGrowth = this.$echarts.init(document.getElementById('userGrowth'))
        // 绘制图表
        userGrowth.setOption({
          title: {text: '用户增长量统计'},
          tooltip: {},
          xAxis: {
            type: 'category',
            data: data.times
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: data.series,
              type: 'line'
            }
          ]
        })
      })
    },
    drawPipe () {
      let pieChart = this.$echarts.init(document.getElementById('pieChart'))
      this.$axios.get('course/subjectPip').then(res => {
        let data = res.data.data
        pieChart.setOption({
          title: {
            text: '课程分布',
            subtext: '分类',
            left: 'right'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      })
    },
    drawTopCourse () {
      let topCourse = this.$echarts.init(document.getElementById('topCourse'))
      this.$axios.get('course/courseViewCount').then(res => {
        let data = res.data.data
        topCourse.setOption({
          title: {
            text: 'top10课程(游览量)'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: data.titles
          },
          series: [
            {
              // name: 'top10课程',
              type: 'bar',
              data: data.counts
            }
          ]
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
