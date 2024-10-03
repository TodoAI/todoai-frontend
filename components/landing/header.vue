<script setup lang="ts">
const isLoggedIn = ref(false)
</script>

<template>
  <UHeader
    title="TodoAI"
    to="/"
  >
    <template #right>
      <template v-if="isLoggedIn">
        <UButton
          to="/tasks"
          label="Tasks"
          icon="mdi-format-list-checks"
        />
        <UButton
          to="/profile"
          label="Profile"
          icon="mdi-account"
        />
        <UButton
          to="/auth/logout"
          label="Logout"
          icon="mdi-logout"
          color="white"
        />
      </template>
      <template v-else>
        <UButton
          to="/auth/login"
          label="Sign in"
          icon="mdi-login"
          color="white"
        />
        <UButton
          to="/auth/register"
          label="Sign up"
          icon="mdi-account-plus"
        />
      </template>
    </template>
  </UHeader>
</template>

<style scoped>

</style>
