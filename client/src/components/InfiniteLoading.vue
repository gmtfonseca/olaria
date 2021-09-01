<template>
  <div class="infinite">
    <div v-show="showSpinner">
      <OProgressSpinner class="infinite__spinner" />
    </div>
    <div v-show="showError" class="infinite__error">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const InfiniteLoadingState = {
  READY: 0,
  LOADING: 1,
  COMPLETE: 2,
  ERROR: 3,
}

const DISTANCE_THRESHOLD = 100

export default defineComponent({
  props: {
    errorMsg: {
      type: String,
      default: 'Erro ao carregar dados.',
    },
  },
  emits: ['infinite'],
  data() {
    return {
      state: InfiniteLoadingState.READY,
    }
  },
  computed: {
    showSpinner(): boolean {
      return this.state === InfiniteLoadingState.LOADING
    },
    showError(): boolean {
      return this.state === InfiniteLoadingState.ERROR
    },
    showNoMore(): boolean {
      return this.state === InfiniteLoadingState.COMPLETE
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if (
        this.state === InfiniteLoadingState.READY &&
        this.getCurrentDistance() <= DISTANCE_THRESHOLD
      ) {
        this.state = InfiniteLoadingState.LOADING
        this.$emit('infinite', {
          loaded: () => {
            this.state = InfiniteLoadingState.READY
          },
          complete: () => {
            this.state = InfiniteLoadingState.COMPLETE
          },
          error: () => {
            this.state = InfiniteLoadingState.ERROR
          },
        })
      }
    },
    getCurrentDistance(): number {
      const distance = this.$el.getBoundingClientRect().top - window.innerHeight
      return distance
    },
  },
})
</script>

<style lang="scss" scoped>
.infinite {
  display: flex;
  justify-content: center;
  align-items: center;

  $margin-top: 12px;
  $margin-bottom: 100px;

  &__spinner {
    width: 60px;
    height: 60px;
    margin-top: $margin-top;
    margin-bottom: $margin-bottom;
  }

  &__error {
    font-size: 16px;
    margin-top: $margin-top;
    margin-bottom: $margin-bottom;
  }
}
</style>
