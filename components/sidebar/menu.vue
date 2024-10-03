<script setup lang="ts">
const lists = ref([])

const links = computed(() => {
  return [{
    label: 'All Tasks',
    icon: 'i-heroicons-home',
    to: '/dashboard'
  }].concat(lists.value.map((list) => {
    return {
      label: list.name,
      icon: 'i-heroicons-list-bullet',
      to: `/lists/${list.id}`
    }
  }))
})

lists.value = await useApi().list.listControllerGetAllLists()
</script>

<template>
  <UDashboardSidebarLinks :links="links" />
</template>

<style scoped>

</style>
