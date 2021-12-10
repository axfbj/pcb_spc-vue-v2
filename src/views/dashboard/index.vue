<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <h1>首页</h1>
    <allow-create-select
      v-model="value"
      style="width:100%"
    />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { AllowCreateSelect } from '@/components/form-item'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  components: { AllowCreateSelect },
  data() {
    return {
      value: '',
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
    setTimeout(() => {
      this.value = 'HTML'
      setTimeout(() => {
        this.value = 'CSS'
      }, 2000)
    }, 2000)
  }
}
</script>
