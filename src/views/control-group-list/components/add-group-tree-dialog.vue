<template>
  <ki-dialog
    :visible="visible"
    title="控制组"
    v-bind="$attrs"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 20px;">
      <el-form
        ref="form"
        :model="form"
        label-width="auto"
        :rules="rules"
      >
        <el-form-item
          prop="groupName"
          label="组名称:"
        >
          <el-input ref="ipt" v-model="form.groupName" />
        </el-form-item>

        <el-form-item
          prop="erpCode"
          label="erp代码:"
        >
          <el-input v-model="form.erpCode" />
        </el-form-item>

        <el-form-item
          prop="groupDescription"
          label="描述:"
        >
          <el-input v-model="form.groupDescription" />
        </el-form-item>

        <el-form-item
          v-if="$attrs.flag === 'add'"
          label="添加节点:"
        >
          <el-select v-model="level" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.level"
              :label="item.label"
              :value="item. level"
            />
          </el-select>
        </el-form-item>

      </el-form>
    </div>

  </ki-dialog>
</template>

<script>
export default {
  name: 'AddGroupTreeDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    nodeData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      level: '0',
      options: [
        {
          level: '0',
          label: '子级'
        },
        {
          level: '1',
          label: '同级'
        }
      ],
      form: {
        groupName: '',
        erpCode: '',
        groupDescription: ''
      },
      rules: {
        groupName: [{ required: true, message: '组名称不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    nodeKey() {
      return this.nodeData.id
    }
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        loading(true)
        if (this.flag === 'add') {
          this.add()
        } else {
          this.update()
        }
      })
    },
    async add() {
      const params = {
        ...this.form
      }

      if (Object.hasOwnProperty.call(this.nodeData, 'id')) {
        //  parentId: this.level === '0' ? this.nodeData.id : this.nodeData.parentId,
        params.parentId = this.level === '0' ? this.nodeData.id : this.nodeData.parentId
      } else {
        params.parentId = '0'
      }
      const { code, data } = await this.$api.controlGroup_save(params)
      if (code === '200' && data) {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async update() {
      const { code, data } = await this.$api.controlGroup_update({
        id: this.nodeKey,
        ...this.form
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async open({ load }) {
      this.flag = this.$attrs.flag
      if (this.flag !== 'add') {
        const { code, data } = await load(() => this.$api.controlGroup_info({ id: this.nodeKey }))
        if (code === '200' && data) {
          const { groupName, erpCode, groupDescription } = data
          this.form = {
            groupName,
            erpCode,
            groupDescription
          }
        }
      }
      this.$refs.ipt.focus()
    },
    closed() {
      this.level = '0'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
