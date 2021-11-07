<template>
    <div class="delete-button">
        <b-button variant="danger" v-on:click="$emit('del-notification', notification._id)">x</b-button>
    </div>
</template>

<script>
export default {
  name: 'notification-item',
  props: ['notification']
}
</script>

<style>
.delete-button{
  text-align: right;
}
</style>
