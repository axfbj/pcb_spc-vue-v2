import { mapGetters } from 'vuex'
export default {
  props: {
    menuItems: {
      type: Array,
      default: () => ([])
    },
    treeContextmenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      menu_node: {}
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
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }

  },
  methods: {
    menuClick({ node, menuKey }) {
      this.$emit('menu-click', { node, menuKey })
    },
    // row_contextmenu() {},
    openMenu(e, data, node, comp) {
      if (!this.treeContextmenu) return
      this.menu_node = node
      if (this.multiple) {
        if (this.value && this.value.length <= 1) {
          this.$refs.tree.clearSelection()
          this.$refs.tree.setCurrentRow(null)
        }
      }
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
      this.$emit('open-menu', { data, node })
      e.preventDefault()
    },
    closeMenu() {
      this.menu_node = {}
      this.visible = false
    }
  }
}
