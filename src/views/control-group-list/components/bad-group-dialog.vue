<template>
  <ki-dialog
    :visible="visible"
    title="不良分组"
    v-bind="$attrs"
    width="40%"
    :permission="['badDefinitionGroup.update']"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-transfer
        v-model="value"
        :titles="['可选不良项目','已选不良项目']"
        :data="data"
        :props="props"
      />
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
    // const generateData = _ => {
    //   const data = []
    //   for (let i = 1; i <= 15; i++) {
    //     data.push({
    //       id: i,
    //       badName: `备选项 ${i}`,
    //       disabled: i % 4 === 0
    //     })
    //   }
    //   return data
    // }
    return {
      hadData: [],
      controlChartSonId: '',
      form: {
      },
      data: [],
      value: [],
      props: {
        key: 'id',
        label: 'badName'
      }
    }
  },
  methods: {
    clear() {
      this.value = []
      this.controlChartSonId = ''
    },
    handleClose() {
      // this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      const badGrupSelect = []
      // console.log('value', this.value)
      if (this.value.length === 0) {
        this.$message.warning('此控制图需要进行不良分组!')
        return
      }
      this.value.forEach(id => {
        const d = this.data.find(item => item.id === id)
        if (d) {
          badGrupSelect.push(d)
        }
      })

      const newGroup = badGrupSelect.map(item => {
        return {
          'badDefinitionId': item.id,
          'controlChartSonId': this.controlChartSonId
        }
      })

      this.hadData.forEach(item1 => {
        const idx = newGroup.findIndex(item2 => {
          return item1.badDefinitionId === item2.badDefinitionId
        })
        if (idx > -1) {
          newGroup[idx].id = item1.id
        }
      })

      const dels = this.hadData.filter(item => {
        return newGroup.every(i => i.badDefinitionId !== item.id)
      })
      const { code, data } = await this.$api.badDefinitionGroup_saveOrUpdateBatch({
        baDefinitionGroupDeletes: dels,
        baDefinitionGroups: newGroup
      })
      if (code === '200' && data) {
        if (this.hadData.length === 0) {
          this.$emit('confirm', 'link')
        } else {
          this.$emit('confirm')
        }
      }
    },
    async add() {

    },
    async update() {

    },
    async open({ load }) {
      this.controlChartSonId = this.selectRow[0].id
      const { code, data } = await this.$api.badDefinitionGroup_info({ id: this.controlChartSonId })
      if (code === '200' && data) {
        this.hadData = data
        this.value = data.map(item => item.badDefinitionId)
        // console.log(this.value)
      }

      const res = await this.$api.badDefinition_list({
        page: '1',
        limit: '300'
      })
      if (res.code === '200' && res.data) {
        this.data = res.data.list
      }
    },
    closed() {
      this.clear()
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
