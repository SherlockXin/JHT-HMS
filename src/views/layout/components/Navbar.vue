<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
        {{ name }}
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <!-- <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link> -->
        <el-dropdown-item>
          <span style="display:block;" @click="showInfoFrom">个人信息</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span style="display:block;" @click="showPwdForm">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 个人信息 -->
    <el-dialog title="个人信息" :visible.sync="infoVisible" :width="dialogWidth">
      <el-form :model="infoForm" size="small">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="infoForm.username" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="infoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="infoForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="infoForm.email"></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-input v-model="infoForm.deptName" readonly></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoVisible = false">取 消</el-button>
        <el-button type="primary" @click="infoVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="pwdVisible" :width="dialogWidth">
      <el-form :model="pwdForm" size="small">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-tag type="info">{{ user_info.username }}</el-tag>
        </el-form-item>
        <el-form-item label="原密码" :label-width="formLabelWidth">
          <el-input v-model="pwdForm.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="pwdForm.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="pwdForm.confirmPwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdVisible = false">取 消</el-button>
        <el-button type="primary" @click="pwdVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'user_info'
    ])
  },
  data() {
    return {
      dialogWidth: '40%',
      formLabelWidth: '100px',
      infoVisible: false,
      pwdVisible: false,
      infoForm: {},
      loading: false,
      pwdForm: {}
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    showInfoFrom() {
      this.infoForm = this.$store.getters.user_info
      this.infoVisible = true
    },
    updateInfo() {
      this.loading = true
      this.$store.dispatch('UpdateInfo', this.infoForm).then(() => {
        this.loading = false
        this.$message({message:'保存成功', type: 'success'})
      }).catch(() => {
        this.loading = false
      })
    },
    showPwdForm() {
      this.pwdForm = {oldPwd:null, newPwd:null, confirmPwd: null}
      this.pwdVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

