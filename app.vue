<script setup lang="ts">
const route = useRoute()

const pageName = computed(() => {
  return route.name
})

useHead(computed(() => {
  return {
    title: pageName.value + ' - TodoAI'
  }
}))

useSeoMeta({
  ogTitle: 'TodoAI',
  description: 'TodoAI, votre liste de tâches intelligente',
  ogDescription: 'TodoAI, votre liste de tâches intelligente'
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UModals />
  </div>
</template>
