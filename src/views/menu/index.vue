<template>
  <div class="menu-container">
    <el-button type="primary" size="medium" icon="el-icon-plus" @click="add">新增</el-button>
    <tree-table :data="menuList" :current-change="selectChange" :columns="columns">
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0" type="info">{{menuType[scope.row.type]}}</el-tag>
          <el-tag v-if="scope.row.type == 1">{{menuType[scope.row.type]}}</el-tag>
          <el-tag v-if="scope.row.type == 2" type="success">{{menuType[scope.row.type]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          {{scope.row.orderNum}}
        </template>
      </el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon || ''"/>
        </template>
      </el-table-column>
      <el-table-column label="路径">
        <template slot-scope="scope">
          {{scope.row.path}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="action-col">
            <el-button type="primary" size="mini" icon="el-icon-edit" plain round @click="edit(scope.row.menuId)"></el-button>
            <el-button size="mini" icon="el-icon-delete" round @click="cancel(scope.row.menuId)"></el-button>
          </div>
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog
      :title="title"
      :visible.sync="formVisible"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form v-loading="formLoading" :model="menuInfo" :rules="formRules" size="small" :label-width="formLabelWidth" ref="menuForm">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuInfo.name" placeholder="菜单名称或按钮名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio v-for="(type,key) in menuType" v-model="menuInfo.type" :label="key">{{type}}</el-radio>
          <el-radio-group v-model="menuInfo.type">
            <el-radio v-for="(type,key) in menuType" :label="key">{{type}}</el-radio>
          </el-radio-group>
          <el-radio-group v-model="menuInfo.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
          <el-input v-model="menuInfo.parentName" placeholder="选择上级菜单" readonly @focus="selectPMenu"></el-input>
        </el-form-item>
        <el-form-item v-if="menuInfo.type != 2" label="菜单路径" prop="path">
          <el-input v-model="menuInfo.path" placeholder="菜单路径"></el-input>
        </el-form-item>
        <el-form-item label="授权标识">
          <el-input v-model="menuInfo.perms" type="textarea" autosize placeholder="多个用逗号分隔，如：user:list,user:create"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="menuInfo.orderNum" type="number" placeholder="排序号"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="menuInfo.icon" placeholder="图标"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save" :loading="formLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择上级菜单" :visible.sync="pMenuVisible" width="300px">
      <el-tree v-loading="pMenuLoading" :data="selectableMenu" :props="props" default-expand-all @node-click="pMenuClick"></el-tree>
    </el-dialog>
  </div>
</template>

<script>
import { getMenu, selectMenu, getMenuInfo, saveOrUpdateMenu, cancelMenu } from "@/api/menu";
import treeTable from "@/components/TreeTable";

export default {
  components: { treeTable },
  data() {
    return {
      menuInfo:{type:null,parentId:null,parentName:null},
      title:'新增菜单',
      formVisible: false,
      pMenuVisible: false,
      pMenuLoading: false,
      formLoading: false,
      formLabelWidth: '100px',
      menuType: null,
      columns: [{text: "名称",value: "name",width: 200}],
      menuList: [],
      selectableMenu: [],
      props: {
        label: "name",
        value: "menuId"
      },
      formRules: {
        name: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
        type: [{required: true, message: '请输选择菜单类型', trigger: 'blur'}],
        parentName: [{required: true, message: '请选择上级菜单', trigger: 'blur'}],
        path: [{required: true, message: '请输入菜单路径', trigger: 'blur'}]
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  filters: {},
  methods: {
    getMenuList() {
      getMenu(true).then(response => {
        this.menuList = response;
      });
    },
    getSelectableMenu() {
      selectMenu().then(response => {
        this.selectableMenu = response.menuList
      })
    },
    selectChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow;
      console.log("currentRow:", currentRow);
    },
    selectPMenu() {
      this.pMenuVisible = true
      this.pMenuLoading = true
      selectMenu().then(response => {
        this.selectableMenu = response.menuList
        this.pMenuLoading = false
      })
    },
    pMenuClick(data) {
      this.menuInfo.parentId = data.menuId
      this.menuInfo.parentName = data.name
      this.pMenuVisible = false
    },
    handleClose() {
      this.$refs.menuForm.resetFields()
      this.formVisible = false
    },
    add() {
      this.menuInfo = {type:null,parentId:null,parentName:null}
      this.formVisible = true
    },
    edit(id) {
      this.formVisible = true
      this.formLoading = true
      getMenuInfo(id).then(res => {
        this.menuInfo = res.menu
        this.formLoading = false
      })
    },
    save() {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          this.formLoading = true
          saveOrUpdateMenu(this.menuInfo).then(res => {
            this.$message({type:'success',message:'保存成功'})
            // this.$refs.menuForm.clearValidate()
            this.$refs.menuForm.resetFields()
            this.formLoading = false
            this.formVisible = false
            this.getMenuList()
          }).catch(() => {
            this.formLoading = false
          })
        }else {
          return false;
        }
      })
    },
    cancel(id) {
      this.$confirm('确定删除该菜单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancelMenu(id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getMenuList()
          })
          
        })
    }
  },
  mounted() {
    this.getMenuList()
    this.getSysDictMap(["menu_type"]).then(res => {
      this.menuType = res.menu_type;
    })
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
<style rel="stylesheet/scss" lang="scss">
.menu-container {
  padding: 10px;
  .action-col {
    display: none;
  }
  .el-table tr:hover {
    .action-col {
      display: block;
    }
  }
}
</style>
