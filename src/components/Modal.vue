<script setup>

const isModalOpen = defineModel();

</script>

<template>
    <teleport to="body">
        <Transition name="fade">
            <div v-if="isModalOpen" class="modal-backdrop" @click.self="isModalOpen = false">
                <div class="container mt-4 mb-4">
                    <div class="main p-3">
                        <div class="container">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </teleport>
</template>


<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0);
    --webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}
</style>