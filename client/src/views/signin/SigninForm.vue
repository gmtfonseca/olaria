<template>
  <div class="wrapper">
    <img class="logo" src="@/assets/koi.png" alt="" />
    <div class="form">
      <FormField
        label="Nome"
        :invalid="v$.form.name.$invalid && submitted"
        invalid-message="Informe um usuário."
        data-test="fieldName"
      >
        <OInputText
          v-model="form.name"
          v-focus
          :class="{ 'p-invalid': v$.form.name.$invalid && submitted }"
          data-test="name"
          @keyup.enter="handleSignin"
        />
      </FormField>

      <FormField
        label="Senha"
        :invalid="v$.form.password.$invalid && submitted"
        invalid-message="Informe uma senha."
        data-test="fieldPassword"
      >
        <OPassword
          v-model="form.password"
          toggle-mask
          :feedback="false"
          :class="{ 'p-invalid': v$.form.password.$invalid && submitted }"
          data-test="password"
          @keyup.enter="handleSignin"
        />
      </FormField>

      <OButton
        label="ENTRAR"
        :loading="loading"
        data-test="signin"
        @click="handleSignin"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useToast } from '@/util/toast'
import { useHttpErrorHandler } from '@/util/http-error-handler'

import FormField from '@/components/FormField.vue'

export default defineComponent({
  components: { FormField },
  setup() {
    const toast = useToast()
    const { handleHttpError } = useHttpErrorHandler(toast)
    return {
      v$: useVuelidate(),
      handleHttpError,
      ...toast,
    }
  },
  data() {
    return {
      submitted: false,
      loading: false,
      form: {
        name: '',
        password: '',
      },
    }
  },
  validations() {
    return {
      form: {
        name: {
          required,
        },
        password: {
          required,
        },
      },
    }
  },
  methods: {
    async handleSignin() {
      this.submitted = true
      if (this.v$.$invalid) return

      try {
        this.loading = true
        await this.$store.dispatch('sigin', this.form)
        this.$router.push({ path: '/inventories' })
      } catch (e) {
        this.handleHttpError(e.data)
      } finally {
        this.loading = false
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .logo {
    width: 150px;
    height: auto;
    margin-bottom: 32px;
  }

  .form {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 300px;
    width: 100%;
  }
}
</style>
