<script setup lang="ts">
import type { TaskResponseDto } from '~/composables/generated/Api'

const emit = defineEmits(['task-deleted', 'task-edited'])

const props = defineProps<{
  task: TaskResponseDto,
  disableEditing?: boolean
}>()

const { task, disableEditing } = toRefs(props)

const deleteLoading = ref(false)

const editTaskOpen = ref(false)
const newName = ref(task.value.name)
const newDescription = ref(task.value.description)
const editLoading = ref(false)

async function deleteTask() {
  deleteLoading.value = true
  await useApi().task.taskControllerDelete(task.value.id)
  deleteLoading.value = false
  // emit event to parent
  emit('task-deleted', task.value.id)
}

async function editTask() {
  editLoading.value = true
  await useApi().task.taskControllerUpdate(task.value.id, {
    name: newName.value,
    description: newDescription.value
  })
  task.value.name = newName.value
  task.value.description = newDescription.value
  editLoading.value = false
  editTaskOpen.value = false
  // emit event to parent
  emit('task-edited', task.value)
}

async function updateCompletedState() {
  if (task.value.completed) {
    await useApi().task.taskControllerComplete(task.value.id)
    emit('task-edited', { ...task.value, completed: true })
  } else {
    await useApi().task.taskControllerUncomplete(task.value.id)
    emit('task-edited', { ...task.value, completed: false })
  }
}
</script>

<template>
  <div class="bg-primary-100/50 dark:bg-primary-900/50 border-2 border-primary-600 dark:border-primary-400 p-4 rounded-xl flex items-center">
    <div class="mr-3">
      <UCheckbox
        v-model="task.completed"
        :disabled="disableEditing"
        @change="updateCompletedState"
      />
    </div>
    <div class="flex flex-col items-start justify-start flex-1">
      <p class="text-xl font-semibold">
        {{ task.name }}
      </p>
      <p>{{ task.description }}</p>
    </div>
    <div class="flex items-center justify-center">
      <UButtonGroup v-if="!disableEditing">
        <UButton
          color="blue"
          icon="i-heroicons-pencil"
          @click="editTaskOpen = true"
        />
        <UButton
          color="red"
          icon="i-heroicons-trash"
          :loading="deleteLoading"
          @click="deleteTask"
        />
      </UButtonGroup>
    </div>
  </div>
  <UDashboardModal
    v-model="editTaskOpen"
    title="Edit task"
    :description="task.name"
    icon="i-heroicons-pencil"
  >
    <div class="flex flex-col gap-4">
      <UFormGroup label="Name">
        <UInput
          v-model="newName"
          label="Name"
        />
      </UFormGroup>
      <UFormGroup label="Description">
        <UInput
          v-model="newDescription"
          label="Description"
        />
      </UFormGroup>
      <div class="flex justify-center">
        <UButton
          color="green"
          icon="i-heroicons-check"
          label="Save"
          :loading="editLoading"
          @click="editTask"
        />
      </div>
    </div>
  </UDashboardModal>
</template>

<style scoped>

</style>
