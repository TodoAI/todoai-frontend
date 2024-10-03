<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

definePageMeta({
  name: 'Accueil',
  layout: 'landing',
  middleware: 'no-auth'
})

const { width } = useWindowSize()

const orientation = computed(() => {
  if (width.value < 1024) {
    return 'vertical'
  } else {
    return 'horizontal'
  }
})
</script>

<template>
  <ULandingHero
    title="TodoAI"
    description="TodoAI is a task management application that allows users to create multiple to-do lists, such as &quot;Work,&quot; &quot;Weekend,&quot; or &quot;Household Chores.&quot; Each list contains tasks, like &quot;Submit a report,&quot; which come with a due date and time. Users can track the progress of their tasks, with statuses like &quot;In Progress&quot; or &quot;Done.&quot; Additionally, the app leverages artificial intelligence to assist users by generating task steps when they provide the task name, streamlining task breakdown and completion."
    :orientation="orientation"
    :links="[
      {
        label: 'Get Started',
        icon: 'i-heroicons-rocket-launch',
        size: 'lg',
        to: '/auth/register'
      }
    ]"
  >
    <NuxtImg
      src="/logo.png"
      class=" object-contain w-full h-96"
    />
  </ULandingHero>
</template>

<style scoped>

</style>
