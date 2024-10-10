<script setup lang="ts">
definePageMeta({
  name: 'Task list'
})

const route = useRoute()
const listId = route.params.listId as number

const tasks = ref([])

const list = ref(await useApi().list.listControllerGetList(listId))
tasks.value = list.value.tasks

const createTaskOpen = ref(false)
const newName = ref('')
const newDescription = ref('')
const taskDescriptionDisabled = ref(false)
const createLoading = ref(false)

async function createTask() {
  createLoading.value = true
  const task = await useApi().task.taskControllerCreate(listId, {
    name: newName.value,
    description: newDescription.value
  })
  tasks.value.push(task)
  newName.value = ''
  newDescription.value = ''
  createLoading.value = false
  createTaskOpen.value = false
}

const editListOpen = ref(false)
const editListLoading = ref(false)
const newListName = ref(list.value.name)
const newListDescription = ref(list.value.description)

async function generateTaskDescription() {
  taskDescriptionDisabled.value = true
  const taskName = newName.value
  newDescription.value = await useApi().task.taskControllerGenerate({
    name: taskName
  }).then((res) => res.description)
  taskDescriptionDisabled.value = false
}

async function editList() {
  editListLoading.value = true
  await useApi().list.listControllerEditList(listId, {
    name: newListName.value,
    description: newListDescription.value
  })
  editListLoading.value = false
  editListOpen.value = false
  navigateTo(`/lists/${listId}`, { external: true })
}

const deleteLoading = ref(false)

async function deleteList() {
  deleteLoading.value = true
  await useApi().list.listControllerDeleteList(listId)
  deleteLoading.value = false
  navigateTo('/dashboard', { external: true })
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="list?.name ?? 'Task list'">
        <template #title>
          <div class="flex gap-2 items-baseline">
            <p class="font-semibold">{{ list?.name }}</p>
            <p class="text-xs text-gray-500">{{ list?.description }}</p>
          </div>
        </template>
        <template #right>
          <UButton
            color="gray"
            icon="i-heroicons-plus"
            label="Create task"
            @click="createTaskOpen = true"
          />
          <UButtonGroup>
            <UButton
              color="blue"
              icon="i-heroicons-pencil"
              @click="editListOpen = true"
            />
            <UButton
              color="red"
              icon="i-heroicons-trash"
              :loading="deleteLoading"
              @click="deleteList()"
            />
          </UButtonGroup>
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <div class="flex flex-col gap-4" v-if="tasks.length > 0">
          <ListTask
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @task-deleted="tasks = tasks.filter(t => t.id !== $event)"
            @task-edited="tasks = tasks.map(t => t.id === $event.id ? $event : t)"
          />
        </div>
        <div class="flex flex-col items-center justify-center h-full" v-else>
          <p class="text-gray-500" v-if="tasks.length === 0">No tasks</p>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
    <UDashboardModal
      v-model="editListOpen"
      title="Edit list"
      :description="list?.name"
      icon="i-heroicons-plus"
    >
      <div class="flex flex-col gap-4">
        <UFormGroup label="Name">
          <UInput
            v-model="newListName"
            placeholder="Name"
          />
        </UFormGroup>
        <UFormGroup label="Description">
          <UTextarea
            v-model="newListDescription"
            placeholder="Description"
          />
        </UFormGroup>
        <div class="flex justify-center">
          <UButton
            color="green"
            icon="i-heroicons-check"
            label="Save"
            :loading="editLoading"
            @click="editList"
          />
        </div>
      </div>
    </UDashboardModal>
    <UDashboardModal
      v-model="createTaskOpen"
      title="Create task"
      icon="i-heroicons-plus"
    >
      <div class="flex flex-col gap-4">
        <UFormGroup label="Name">
          <UInput
            v-model="newName"
            placeholder="Name"
            @change="generateTaskDescription"
          />
        </UFormGroup>
        <UFormGroup label="Description">
          <UTextarea
            v-model="newDescription"
            placeholder="Description"
            :disabled="taskDescriptionDisabled"
          />
        </UFormGroup>
        <div class="flex justify-center">
          <UButton
            color="green"
            icon="i-heroicons-check"
            label="Save"
            :loading="createLoading"
            @click="createTask"
          />
        </div>
      </div>
    </UDashboardModal>
  </UDashboardPage>
</template>

<style scoped>

</style>
