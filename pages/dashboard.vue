<script setup lang="ts">
definePageMeta({
  name: 'Dashboard'
})

const lists = await useApi().list.listControllerGetAllLists()
const allTasks = await Promise.all(lists.map(list => useApi().list.listControllerGetList(list.id))).then(lists => lists.map(list => list.tasks))
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="All tasks" />
      <UDashboardPanelContent>
        <div class="flex flex-col gap-4">
          <div
            v-for="(tasks, index) in allTasks"
            :key="index"
            class="flex flex-col gap-4"
          >
            <ULink
              class="text-3xl font-bold hover:underline"
              :to="`/lists/${lists[index].id}`"
            >
              {{ lists[index].name }}
            </ULink>
            <div
              v-if="!tasks.length"
              class="text-sm text-gray-500"
            >
              No tasks
            </div>
            <ListTask
              v-for="task in tasks"
              :key="task.id"
              :task="task"
              :disableEditing="true"
            />
          </div>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>

</style>
