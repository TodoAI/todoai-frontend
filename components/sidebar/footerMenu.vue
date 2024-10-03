<script setup lang="ts">
const links = [{
  label: 'Create list',
  icon: 'i-heroicons-plus',
  click: () => {
    createListVisible.value = true
  }
}]

const loading = ref(false)

async function createListHandler() {
  if (!title.value.length || !description.value.length) {
    error.value = 'Title and description are required'
    return
  }
  try {
    loading.value = true
    const newList = await useApi().list.listControllerCreateList({
      name: title.value,
      description: description.value
    })
    loading.value = false
    createListVisible.value = false
    navigateTo(`/lists/${newList.id}`, { external: true })
  } catch (e) {
    loading.value = false
    error.value = e.error.message
  }
}

const error = ref<string | null>(null)

const title = ref('')
const description = ref('')

const createListVisible = ref(false)
</script>

<template>
  <UDashboardSidebarLinks :links="links" />

  <UDashboardModal
    v-model="createListVisible"
    title="New list"
    description="Enter information about the new list"
  >
    <UForm
      @submit="createListHandler"
    >
      <UFormGroup
        label="Title"
        required
      >
        <UInput
          v-model="title"
          name="title"
          placeholder="Enter list title"
        />
      </UFormGroup>
      <UFormGroup
        label="Description"
        required
        class="mt-4"
      >
        <UTextarea
          v-model="description"
          name="description"
          placeholder="Enter list description"
        />
      </UFormGroup>
      <UAlert
        v-if="error"
        color="red"
        variant="subtle"
        class="mt-6"
        icon="i-heroicons-x-circle"
        :title="error"
      />
      <UButton
        type="submit"
        class="mt-6"
        color="primary"
        label="Create"
        :loading="loading"
      />
    </UForm>
  </UDashboardModal>
</template>

<style scoped>

</style>
