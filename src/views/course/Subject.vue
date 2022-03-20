<template>
  <div class="app-container">

    <el-form :inline="true" :model="pageQueryForm" class="course-form-inline">
      <el-form-item label="课程分类">
        <el-input v-model="pageQueryForm.title" placeholder="课程分类"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageQuery">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSubject">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
        fit
        stripe
        lazy
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          fixed
          type="index"
          width="50">
      </el-table-column>
      <el-table-column
          label="课程分类"
          prop="title"
          width="180">
      </el-table-column>
      <el-table-column
          label="排序分"
          prop="sort"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createUserName"
          label="创建人">
      </el-table-column>
      <el-table-column
          label="创建时间"
          width="180">
        <template slot-scope="scope">
          {{ scope.row.createDate | formatTimer }}
        </template>
      </el-table-column>
      <el-table-column
          prop="updateUserName"
          label="修改人">
      </el-table-column>
      <el-table-column
          label="上次修改时间"
          width="180">
        <template slot-scope="scope">
          {{ scope.row.updateDate | formatTimer }}
        </template>
      </el-table-column>

      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="editDialogName" :before-close="dialogClose"
               :visible.sync="dialogFormVisible">
      <el-form v-model="editForm" size="medium" label-width="100px">
        <el-form-item label="课程分类">
          <el-radio-group type="kind" v-model="editForm.subjectLevel" :disabled="disableRadio"
                          @change="selectChange">
            <el-radio :label="1">一级分类</el-radio>
            <el-radio :label="2">二级分类</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="一级分类">
          <el-input v-model="editForm.firstLevelName"
                    v-show="showFirstInput"
                    :disabled="disableFirstInput"
                    placeholder="请输入一级分类" clearable :style="{width: '100%'}">
          </el-input>
          <!--新增二级分类显示-->
          <el-select v-model="editForm.firstLevel" v-show="showFirstSelect" placeholder="请选择">
            <el-option
                v-for="item in courseOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" v-show="showSecondLevel">
          <el-input v-model="editForm.secondLevelName" placeholder="请输入二级分类" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="排序分值">
          <el-input v-model="editForm.sort" placeholder="请输入排序分值" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="submitSubject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [{
        id: null,
        parentId: null,
        title: null,
        parentName: null,
        createUserId: null,
        createUserName: null,
        createDate: null,
        updateUserId: null,
        updateUserName: null,
        updateDate: null
      }],
      pageQueryForm: {
        title: '',
        pageNum: 1,
        size: 10
      },
      totalSize: null,
      editDialogName: '',
      dialogFormVisible: false,
      editForm: {
        firstLevel: null,
        firstLevelName: null,
        secondLevel: null,
        secondLevelName: null,
        sort: null,
        parentId: null,
        title: null,
        subjectLevel: 1,
        id: null
      },
      courseOptions: [{
        id: null,
        title: ''
      }],
      disableRadio: false,
      showFirstInput: false,
      disableFirstInput: false,
      showFirstSelect: false,
      showSecondLevel: false
    }
  },
  methods: {
    load (tree, treeNode, resolve) {
      const parentId = tree.id
      setTimeout(() => {
        this.$axios.get('subject/querySubject/' + parentId).then(res => {
          resolve(res.data.data)
        })
      }, 200)
    },
    pageQuery () {
      // 先清空数据
      this.tableData = []
      this.$axios.post('subject/list', {
        'data': this.pageQueryForm
      }).then(res => {
        this.tableData = res.data.data.list
        this.totalSize = res.data.data.total
      })
    },
    addSubject () {
      this.editForm.editDialogName = '新增分类'
      this.addFirstLevel()
      this.dialogFormVisible = true
    },
    addFirstLevel () {
      this.disableRadio = false
      this.showFirstInput = true
      this.disableFirstInput = false
      this.showFirstSelect = false
      this.showSecondLevel = false
    },
    addSecondLevel () {
      this.disableRadio = false
      this.showFirstInput = false
      this.disableFirstInput = false
      this.showFirstSelect = true
      this.showSecondLevel = true
    },
    editFirstLevel () {
      this.disableRadio = true
      this.showFirstInput = true
      this.disableFirstInput = false
      this.showFirstSelect = false
      this.showSecondLevel = false
    },
    editSecondLevel () {
      this.disableRadio = true
      this.showFirstInput = true
      this.disableFirstInput = true
      this.showFirstSelect = false
      this.showSecondLevel = true
    },
    handleEdit (index, row) {
      this.editForm.editDialogName = '修改分类'
      if (row.parentId === -1) {
        this.editFirstLevel()
        this.$set(this.editForm, 'subjectLevel', 1)
        // this.editForm.firstLevelName = row.header
        this.$set(this.editForm, 'firstLevelName', row.title)
      } else {
        this.editSecondLevel()
        this.$set(this.editForm, 'subjectLevel', 2)
        this.$set(this.editForm, 'firstLevel', row.parentId)
        this.$set(this.editForm, 'firstLevelName', row.parentName)
        this.$set(this.editForm, 'secondLevelName', row.title)
        // this.editForm.firstLevel = row.parentName
        // this.editForm.firstLevelName = row.parentName
        // this.editForm.secondLevelName = row.header
      }
      this.disabledUpdateEdit = true
      this.$set(this.editForm, 'id', row.id)
      this.$set(this.editForm, 'sort', row.sort)
      // this.editForm.id = row.id
      // this.editForm.sort = row.sort
      this.dialogFormVisible = true
    },
    submitSubject () {
      const id = this.editForm.id
      this.$axios.post('subject/saveOrUpdate', {
        'data': this.editForm
      }).then(res => {
        if (id) {
          this.$message(res.data.code === 200 ? '修改成功' : res.data.message)
        } else {
          this.$message(res.data.code === 200 ? '新增成功' : res.data.message)
        }
        this.clearEditForm()
        this.dialogFormVisible = false

        this.pageQuery()
      })
    },
    dialogClose () {
      this.clearEditForm()
      this.dialogFormVisible = false
    },
    cancelDialog () {
      this.clearEditForm()
      this.dialogFormVisible = false
    },
    selectChange (value) {
      if (value === 1) {
        this.addFirstLevel()
      } else {
        this.addSecondLevel()
        this.$axios.get('subject/queryAllFirstLevel').then(res => {
          this.courseOptions = res.data.data
        })
      }
    },
    clearEditForm () {
      this.editForm = {}
      this.$set(this.editForm, 'subjectLevel', 1)
      this.disabledUpdateEdit = false
    }
  },
  created () {
    this.pageQuery()
    this.$store.commit('setMenuActive', '3-4')
  }
}
</script>

<style scoped>

</style>
