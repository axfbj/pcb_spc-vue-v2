<template>
  <ki-dialog
    :visible="visible"
    title="不良分组"
    v-bind="$attrs"
    width="40%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-transfer v-model="value" :data="data" :props="props" />
    </div>
  </ki-dialog>
</template>

<script>
export default {
  name: 'BadGroupDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: [Object, Array],
      default: () => ({})
    }
  },
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          id: i,
          badName: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      form: {
      },
      data: generateData(),
      value: [],
      props: {
        key: 'id',
        label: 'badName'
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      const badGrupSelect = []
      console.log('value', this.value)
      this.value.forEach(id => {
        const d = this.data.find(item => item.id === id)
        if (d) {
          badGrupSelect.push(d)
        }
      })
      console.log(badGrupSelect)
      this.$emit('confirm', badGrupSelect)
    },
    async add() {

    },
    async update() {

    },
    async open({ load }) {
      // const { code, data } = await this.$api.badDefinition_list({
      //   page: '1',
      //   limit: '300'
      // })
      // if (code === '200' && data) {
      //   this.data = data.list
      // }
    },
    closed() {
      // this.level = '0'
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-select {
  ::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #1890ff;
  }
}
.rule-input {
  width: 60px;
}
</style>
