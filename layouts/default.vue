<script setup lang="ts">

</script>

<template>
  <UDashboardLayout
    class="bg-primary-50/10 dark:bg-primary-950/10"
  >
    <UDashboardPanel
      :width="300"
      :resizable="{ min: 250, max: 350 }"
      collapsible
    >
      <SidebarHeader />

      <UDashboardSidebar>
        <SidebarMenu />

        <div class="flex-1" />

        <SidebarFooterMenu />

        <template #footer>
          <SidebarUser />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <NuxtPage />
  </UDashboardLayout>
</template>

<style scoped>

</style>
