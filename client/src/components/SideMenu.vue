<template>
  <OSidebar v-model:visible="visibleComputed">
    <div class="user">
      <OAvatar
        :label="userCapitalLetter"
        class="user__avatar"
        size="xlarge"
        shape="circle"
      />
      <div class="user__name">{{ userName }}</div>
      <div class="user__action" @click="handleSignout">SAIR</div>
    </div>

    <hr class="separator" />

    <div class="routes">
      <div v-for="route in routes" :key="route.path">
        <router-link v-slot="{ navigate, isActive }" :to="route.path" custom>
          <div :class="['route', { 'route--active': isActive }]">
            <span
              class="route__text"
              @click="!isActive && handleRouteClick(navigate)"
            >
              {{ route.text }}
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </OSidebar>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ['update:visible'],
  data() {
    return {
      routes: [
        { text: 'Inventário', path: '/inventories' },
        { text: 'Movimentos', path: '/movements' },
        { text: 'Peixes', path: '/fishes' },
        { text: 'Açudes', path: '/ponds' },
      ],
    }
  },
  computed: {
    visibleComputed: {
      get(): boolean {
        return this.visible
      },
      set(visible: boolean) {
        this.$emit('update:visible', visible)
      },
    },
    loggedIn(): boolean {
      return this.$store.getters.loggedIn
    },
    userName(): string {
      if (!this.loggedIn) {
        return ''
      }
      const { name } = this.$store.getters.session.user
      return name
    },
    userCapitalLetter(): string {
      return this.userName.substr(0, 1).toUpperCase()
    },
  },
  methods: {
    async handleSignout() {
      await this.$store.dispatch('signout')
      this.visibleComputed = false
      this.$router.push({ path: '/signin' })
    },
    async handleRouteClick(navigate: () => void) {
      navigate()
      this.visibleComputed = false
    },
  },
})
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  &__name {
    color: #fff;
    text-transform: capitalize;
  }

  &__action {
    padding: 6px 24px;
    color: #fff;
    font-size: 12px;
    border: solid 1px #fff;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;
  }
}

.separator {
  border-top: 1px solid white;
  margin-top: 38px;
  margin-bottom: 24px;
  opacity: 0.4;
}

.routes {
  background: var(--primary-color);
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  gap: 24px;

  .route {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    user-select: none;

    &__text {
      cursor: pointer;
      padding: 14px;
      font-size: 16px;
      letter-spacing: 2px;
    }

    &--active {
      color: var(--red-900);
      font-weight: bold;
    }
  }
}
</style>
