<template>
  <div class="dashboard-page">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <p class="text-gray-600">Welcome to your dashboard!</p>

    <!-- Add dashboard content here -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Recent Moves</h3>
        <p class="text-gray-500">No recent moves</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Account Status</h3>
        <p class="text-green-600">Active</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Quick Actions</h3>
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Book a Move
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard page component
console.log('📊 Dashboard page loaded');
</script>
