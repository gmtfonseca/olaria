<template>
  <div class="main">
    <BlockUI :blocked="busy">
      <NavBar navigation="back">
        <template #body>
          <div class="nav__title">{{ title }}</div>
        </template>
      </NavBar>

      <div class="body">
        <div class="form">
          <FormField
            label="Nome"
            :invalid="v$.form.name.$invalid && submitted"
            :loading="loading"
            invalid-message="Nome inválido."
            data-test="fieldName"
          >
            <OInputText
              v-model="form.name"
              v-uppercase
              v-focus
              data-test="name"
              :class="{ 'p-invalid': v$.form.name.$invalid && submitted }"
            />
          </FormField>

          <FormField label="Inativo" :loading="loading">
            <OCheckbox
              v-model="form.inactive"
              :binary="true"
              data-test="inactive"
            />
          </FormField>
        </div>

        <UserLog class="user-log" :data="userLog" />

        <div class="actions">
          <OButton
            class="p-button-primary"
            icon-pos="right"
            label="SALVAR"
            :loading="saving"
            data-test="save"
            @click="handleSave"
          />
          <OButton
            v-if="editing"
            class="p-button-danger p-button-outlined"
            icon-pos="right"
            label="DELETAR"
            :loading="deleting"
            data-test="delete"
            @click="handleDelete"
          />
        </div>
      </div>
    </BlockUI>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from 'vue'
import { required } from '@vuelidate/validators'

import { useVuelidate } from '@vuelidate/core'
import { useToast } from '@/util/toast'
import { useHttpErrorHandler } from '@/util/http-error-handler'

import { PondRepositoryKey } from '@/data/injectables'
import { CreatePondParams, PondForm } from '@/data/pond/types'
import { UserLogData } from '@/data/auth/types'

import FormField from '@/components/FormField.vue'
import NavBar from '@/components/navbar/NavBar.vue'
import BlockUI from '@/components/BlockUI.vue'
import UserLog from '@/components/UserLog.vue'

export default defineComponent({
  components: { NavBar, FormField, BlockUI, UserLog },
  props: {
    pondId: {
      type: Number as PropType<number>,
      default: null,
    },
  },
  setup: () => {
    const pondRepository = inject(PondRepositoryKey)
    const toast = useToast()
    const { handleHttpError } = useHttpErrorHandler(toast)
    return {
      v$: useVuelidate(),
      pondRepository,
      handleHttpError,
      ...toast,
    }
  },
  data() {
    return {
      saving: false,
      deleting: false,
      loading: false,
      form: {
        name: '',
        inactive: false,
      } as PondForm,
      userLog: {} as UserLogData,
      submitted: false,
    }
  },
  computed: {
    editing(): boolean {
      return !!this.pondId
    },
    title(): string {
      return this.editing ? 'Editar açude' : 'Criar açude'
    },
    busy(): boolean {
      return this.loading || this.saving || this.deleting
    },
  },
  validations() {
    return {
      form: {
        name: {
          required,
        },
      },
    }
  },
  created() {
    if (this.editing) {
      this.loadFormAndUserLog()
    }
  },
  methods: {
    async handleSave(): Promise<void> {
      this.submitted = true
      if (this.v$.$invalid) return

      this.saving = true
      if (this.editing) {
        await this.updatePond()
      } else {
        await this.createPond()
      }
      this.saving = false
    },
    async handleDelete(): Promise<void> {
      this.$confirm.require({
        message: 'Confirma a deleção do açude?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          await this.deletePond()
        },
      })
    },
    async updatePond(): Promise<void> {
      try {
        await this.pondRepository?.updatePond(this.pondId, this.form)
        this.showSuccess({
          title: 'Tudo certo',
          detail: 'Açude editado com sucesso.',
        })
        this.$router.back()
      } catch (e) {
        this.handleHttpError(e.data)
      }
    },
    async createPond(): Promise<void> {
      try {
        await this.pondRepository?.createPond(this.form as CreatePondParams)
        this.showSuccess({
          title: 'Tudo certo',
          detail: 'Açude criado com sucesso.',
        })
        this.$router.back()
      } catch (e) {
        this.handleHttpError(e.data)
      }
    },
    async deletePond(): Promise<void> {
      try {
        this.deleting = true
        await this.pondRepository?.deletePond(this.pondId)
        this.showSuccess({
          title: 'Tudo certo',
          detail: 'Açude deletado com sucesso.',
        })
        this.$router.back()
      } catch (e) {
        this.handleHttpError(e.data)
      } finally {
        this.deleting = false
      }
    },
    async loadFormAndUserLog(): Promise<void> {
      try {
        this.loading = true
        const { createdBy, modifiedBy, ...form } =
          (await this.pondRepository?.getPond(this.pondId)) || {}

        this.form = form
        this.userLog = {
          createdBy,
          modifiedBy,
        }
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
.main {
  min-height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;

  .body {
    padding: 16px;

    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .user-log {
      margin: 16px 0;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
