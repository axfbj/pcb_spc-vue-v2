<template>
  <ki-dialog
    :visible="visible"
    title="选择粘贴类型"
    v-bind="$attrs"
    width="38%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-form>
        <el-form-item label="粘贴类型" label-width="120px">
          <el-select v-model="copyType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CopyPositionDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    level: {
      type: String,
      default: ''
    },
    copyNode: {
      type: Object,
      default: () => ({})
    },
    currentTreeNodeData: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      copyType: '',
      options: [
        // {
        //   value: '1',
        //   label: '不包含控制图'
        // },
        // {
        //   value: '2',
        //   label: '包含控制图'
        // },
        // {
        //   value: '3',
        //   label: '包含控制图和数据'
        // }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'hierarchicalTypes',
      'userId',
      'username',
      'powerCodes'
    ]),
    copy_id() {
      return this.copyNode.id || ''
    }
  },
  created() {

  },
  methods: {
    clean() {
      this.options = []
      this.copyType = ''
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      const params = {
        id: this.copyNode.id
      }
      if (this.level === '0') {
        params.parentId = this.currentTreeNodeData['parentId']
      } else if (this.level === '1') {
        params.parentId = this.currentTreeNodeData.id
      }
      let [code, data] = ['203', false]
      loading(true)
      if (this.copyType === '1') {
        ({ code, data } = await this.$api.copyControlGroupNotContainControlChart(params))
      }
      if (this.copyType === '2') {
        ({ code, data } = await this.$api.copyControlGroupContainControlChart(params))
      }
      if (this.copyType === '3') {
        ({ code, data } = await this.$api.copyControlGroupContainControlChartAndInspectionRecord(params))
      }
      if (code === '200' && data) {
        this.$emit('confirm')
      }
      loading(false)
    },
    async add(loading) {

    },
    async update(loading) {

    },
    async open({ load }) {
      if (this.powerCodes.includes('control.group.copy.no.chart')) {
        const o = {
          value: '1',
          label: '不包含控制图'
        }
        this.options.push(o)
      }

      if (this.powerCodes.includes('control.group.copy.chart')) {
        const o = {
          value: '2',
          label: '包含控制图'
        }
        this.options.push(o)
      }

      if (this.powerCodes.includes('control.group.copy.chartAndData')) {
        const o = {
          value: '3',
          label: '包含控制图和数据'
        }
        this.options.push(o)
      }
      this.copyType = this.options[0].value
    },
    closed() {
      this.clean()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
