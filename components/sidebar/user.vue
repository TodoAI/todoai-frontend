<script setup lang="ts">
const username = useUserStore().username

const items = computed(() => [
  [
    {
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Se déconnecter',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: () => {
        useUserStore().logout()
        navigateTo('/auth/login')
      }
    }
  ]
])
</script>

<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        :label="username"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <UAvatar
            :alt="username"
            size="sm"
          />
        </template>

        <template #trailing>
          <UIcon
            name="i-heroicons-ellipsis-vertical"
            class="w-5 h-5 ml-auto"
          />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p>Connecté en tant que</p>
        <p class="truncate font-semibold text-gray-900 dark:text-white">
          {{ username }}
        </p>
      </div>
    </template>
  </UDropdown>
</template>
