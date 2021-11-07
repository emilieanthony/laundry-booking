<template>
    <div class="delete-button">
        <b-button variant="danger" v-on:click="$emit('del-booking', booking._id)">x</b-button>
    </div>
</template>

<script>
export default {
  name: 'booking-item',
  props: ['booking']
}
</script>

<style>
.delete-button{
  text-align: right;
}
</style>
