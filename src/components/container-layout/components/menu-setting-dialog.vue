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
            :props="{value:'id',label: 'title'}"
            style="width: 100%;"
            clearable
            @change="cas_change"
          />
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
        <el-form-item prop="type" label="类型:">
          <el-select v-model="form.type" placeholder="菜单类型:" clearable>
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
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="remark" label="备注:">
          <el-input v-model="form.remark" />
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
    menuTree: {
      type: [Object, Array],
      default: () => ([])
    }
  },
  data() {
    return {
      flag: '',
      pids: ['1', '2'],
      form: {
        // 'checkArr': '',
        'createTime': '',
        // 状态(0:禁用,1:启用)
        'enable': 1,
        'href': '',
        // 'id': 0,
        'openType': '', // 链接打开方式
        'pid': 0, // 父级ID
        // 'powerCode': '', // 权限标识
        'remark': '', // 备注
        'sort': 0, // 排序码
        'title': '', // 标题
        'type': 1, // 类型 1:目录、2：菜单、3接口、4数据
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
      }]
    }
  },
  methods: {
    cas_change(val) {
      this.form.pid = val[val - 1]
    },
    handleClose() {
      this.$emit('handleClose')
      this.$refs.form.resetFields()
    },
    async confirm({ loading }) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        loading(true)
        if (this.flag === 'add') {
        //   this.add()
        } else {
        //   this.update()
        }
      })
    },
    async add() {
      const res = await this.$api.menu_save({
        badCode: this.form.badCode,
        badName: this.form.badName,
        badDescription: this.form.badDescription
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async update() {
      const res = await this.$api.menu_update({
        // 'checkArr': '', 不知道是什么
        'createTime': '',
        'enable': true,
        'href': '',
        'id': 0,
        'openType': '',
        'pid': 0,
        'powerCode': '',
        'remark': '',
        'sort': 0,
        'title': '',
        'type': 0
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    // getTreeIds() {
    // //   const currentNode = this.selectRow.id
    //   const arr = [this.selectRow.id]
    //   const getName = (key) => {
    //     if (key === '0') return arr.reverse()
    //     const node = this.getNode(key)
    //     arr.push(node.data.groupName)
    //     return getName(node.data.parentId)
    //   }
    //   const path = `/${getName(parentId)}`
    //   return path
    // },
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
      if (this.flag !== 'add') {
        loading(true)
        const { code, data } = await this.$api.menu_info({ id: this.selectRow.id })
        if (code === '200' && data) {
        //   this.form = {
        //     badCode: data.badCode,
        //     badName: data.badName,
        //     badDescription: data.badDescription
        //   }
        }
        loading(false)
      } else {
        const ids = this.getParentIds(this.selectRow.id, this.menuTree)
        if (ids[0]) {
          ids.push(this.selectRow.id)
          this.pids = ids
          this.form.pid = this.pids[this.pids.length - 1]
        } else {
          this.pids = []
          this.form.pid = '0'
        }
      }
    //   this.$refs['ipt'].focus()
    },
    async opened({ loading }) {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
