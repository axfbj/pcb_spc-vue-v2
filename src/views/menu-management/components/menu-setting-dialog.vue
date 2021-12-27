<template>
  <ki-dialog
    :visible="visible"
    title="菜单"
    width="35%"
    :flag="$attrs.flag"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @opened="opened"
    @closed="closed"
    @keypress.native.enter="confirm"
  >
    <div style="padding: 10px 20px;">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="auto"
      >
        <!-- <el-form-item prop="parentName" label="上级菜单:">
          <el-input v-model="form.parentName" readonly />
        </el-form-item>
        <el-form-item prop="title" label="标题:">
          <el-input ref="ipt" v-model="form.title" />
        </el-form-item> -->
        <el-form-item prop="pid" label="上级菜单:">
          <el-cascader
            ref="cas"
            v-model="pids"
            :options="menuTree"
            :show-all-levels="false"
            :props="{value:'id',label: 'title',checkStrictly: true}"
            style="width: 100%;"
            clearable
            @change="cas_change"
          />
        </el-form-item>
        <el-form-item prop="title" label="名称:">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item prop="icon" label="小图标:">

          <el-input v-model="form.icon">
            <template slot="append">
              <i :class="{[form.icon]:true}" style="display: inline-block; width: 14px; height: 14px; font-size: 14px;" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="sort" label="排序码:">
          <el-input-number
            v-model="form.sort"
            :min="0"
            controls-position="right"
            style="width: 100%;"
            :step="1"
          />
        </el-form-item>

        <el-form-item prop="href" label="链接:">
          <el-input v-model="form.href" />
        </el-form-item>
        <el-form-item prop="powerCode" label="权限标识:">
          <el-input v-model="form.powerCode" />
        </el-form-item>
        <el-form-item prop="type" label="类型:">
          <el-select v-model="form.type" placeholder="" clearable style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否隐藏:">
          <el-radio-group v-model="form.resource">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="是否启用:">
          <el-radio-group v-model="form.enable">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="remark" label="备注:">
          <el-input v-model="form.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
export default {
  name: 'MenuSettingDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: [Object, Array],
      default: () => ({})
    },
    sendRow: {
      type: [Object, Array],
      default: () => ({})
    },
    menuTree: {
      type: [Object, Array],
      default: () => ([])
    }
  },
  data() {
    return {
      flag: '',
      form: {},
      form_data: {
        // 'checkArr': '',
        // 'createTime': '',
        // 状态(0:禁用,1:启用)
        'enable': true,
        'href': '',
        // 'id': 0,
        'openType': '', // 链接打开方式
        'pid': '0', // 父级ID
        'powerCode': '', // 权限标识
        'remark': '', // 备注
        'sort': 0, // 排序码
        'title': '', // 标题
        'type': '', // 类型 1:目录、2：菜单、3接口、4数据
        'icon': '' // 小图标类名
      },
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        badName: [{ required: true, message: '不良名称不能为空', trigger: 'change' }]
      },
      options: [{
        value: 1,
        label: '目录'
      }, {
        value: 2,
        label: '菜单'
      }, {
        value: 3,
        label: '接口'
      }, {
        value: 4,
        label: '数据'
      }],
      // pids: ['1','2'],
      pids: [],
      send_row: {}
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clear() {
      this.send_row = {}
      this.pids = []
      this.form = JSON.parse(JSON.stringify(this.form_data))
      this.$refs.form.resetFields()
    },
    cas_change(val) {
      this.form.pid = val[val - 1]
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        loading(true)
        if (this.flag === 'add' || this.flag === 'add-clear') {
          this.add(loading)
        } else {
          this.update(loading)
        }
      })
    },
    async add(loading) {
      const { code, data } = await this.$api.menu_save({
        ...this.form,
        enable: Number(this.form.enable)
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    async update(loading) {
      const { code, data } = await this.$api.menu_update({
        ...this.form,
        enable: Number(this.form.enable)
        // // 'checkArr': '', 不知道是什么
        // 'createTime': '',
        // 'enable': true,
        // 'href': '',
        // 'id': 0,
        // 'openType': '',
        // 'pid': 0,
        // 'powerCode': '',
        // 'remark': '',
        // 'sort': 0,
        // 'title': '',
        // 'type': ''
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    getParentIds(id, data) {
      // 深度遍历查找
      function dfs(data, id, parents) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          // 找到id则返回父级id
          if (item.id === id) return parents
          // children不存在或为空则不递归
          if (!item.children || !item.children.length) continue
          // 往下查找时将当前id入栈
          parents.push(item.id)

          if (dfs(item.children, id, parents).length) return parents
          // 深度遍历查找未找到时当前id 出栈
          parents.pop()
        }
        // 未找到时返回空数组
        return []
      }

      return dfs(data, id, [])
    },
    async open({ loading }) {
      this.flag = this.$attrs.flag
      if (this.flag === 'add') {
        this.send_row = this.sendRow
        const ids = this.getParentIds(this.send_row.id, this.menuTree)
        ids.push(this.send_row.id)
        if (ids.length > 0) {
          this.pids = ids
        }
        this.form.pid = this.pids.length > 0 ? this.pids[this.pids.length - 1] : '0'
      } else if (this.flag === 'update') {
        this.send_row = this.sendRow
        const ids = this.getParentIds(this.send_row.id, this.menuTree)
        if (ids.length > 0) {
          this.pids = ids
        }
        this.form = {
          ...this.send_row,
          pid: this.pids.length > 0 ? this.pids[this.pids.length - 1] : '0',
          type: this.send_row.type || ''
        }
      } else {
        this.clear()
        this.form.pid = '0'
      }
    },
    closed() {
      this.clear()
    },
    async opened({ loading }) {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
