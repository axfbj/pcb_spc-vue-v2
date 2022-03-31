import { mapGetters } from 'vuex'
export default {
  props: {
    menuItems: {
      type: Array,
      default: () => ([])
    },
    rowContextmenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      menu_row: {}
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }

  },
  computed: {
    ...mapGetters(['powerCodes']),
    filterMenuItems() {
      const filterMenuItems = []
      this.menuItems.forEach(menuItem => {
        if (Array.isArray(menuItem.permission)) {
          const hasPermission = menuItem.permission.some(code => this.powerCodes.includes(code))
          if (hasPermission) filterMenuItems.push(menuItem)
        } else {
          filterMenuItems.push(menuItem)
        }
      })
      return filterMenuItems
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (!this.rowContextmenu) return false
      if (this.menu_row[this.unique] === row[this.unique]) {
        return 'right-click-row-color'
      }
      return ''
    },
    menuClick({ row, menuKey }) {
      this.$emit('menu-click', { row, menuKey })
    },
    // row_contextmenu() {},
    openMenu(row, column, e) {
      if (!this.rowContextmenu) return
      this.menu_row = row
      if (this.multiple) {
        if (this.value && this.value.length <= 1) {
          this.$refs.table.clearSelection()
          this.$refs.table.setCurrentRow(null)
        }
        this.$refs.table.toggleRowSelection(row, true)
      }
      //   this.$refs.table.clearSelection()
      //   this.$refs.table.setCurrentRow(null)
      //   this.$refs.table.toggleRowSelection(row, true)
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - this.$el.getBoundingClientRect().top
      this.visible = true
      e.preventDefault()
    },
    closeMenu() {
      this.menu_row = {}
      this.visible = false
    }
  }
}
