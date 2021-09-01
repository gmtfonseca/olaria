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
            label="Data"
            :invalid="v$.form.datetime.$invalid && submitted"
            :loading="loading"
            invalid-message="Data inválida."
          >
            <OCalendar
              v-model="form.datetime"
              :class="{ 'p-invalid': v$.form.datetime.$invalid && submitted }"
              show-icon
              placeholder="Data"
              touch-u-i
              data-test="datetime"
            />
          </FormField>

          <FormField
            label="Peixe"
            :invalid="v$.form.fish.$invalid && submitted"
            :loading="loading"
            invalid-message="Peixe inválido."
            data-test="fieldFish"
          >
            <SelectFish
              v-model="form.fish"
              v-focus="!hasQueryString"
              :class="{ 'p-invalid': v$.form.fish.$invalid && submitted }"
              data-test="fish"
            />
          </FormField>

          <FormField
            label="Açude"
            :invalid="v$.form.pond.$invalid && submitted"
            :loading="loading"
            invalid-message="Açude inválido."
            data-test="fieldPond"
          >
            <SelectPond
              v-model="form.pond"
              :class="{ 'p-invalid': v$.form.pond.$invalid && submitted }"
              data-test="pond"
            />
          </FormField>

          <FormField
            label="Tipo"
            :loading="loading"
            invalid-message="Tipo inválido."
          >
            <div id="action" class="action">
              <div class="action__in">
                <ORadioButton
                  id="in"
                  v-model="form.action"
                  name="action"
                  value="IN"
                  data-test="actionIn"
                />
                <label class="action__label" for="in">Entrada</label>
              </div>

              <div class="action__out">
                <ORadioButton
                  id="out"
                  v-model="form.action"
                  name="action"
                  value="OUT"
                  data-test="actionOut"
                />
                <label class="action__label" for="out">Saída</label>
              </div>
            </div>
          </FormField>

          <FormField
            label="Quantidade"
            :invalid="v$.form.quantity.$invalid && submitted"
            :loading="loading"
            invalid-message="Quantidade inválida."
            data-test="fieldQuantity"
          >
            <OInputNumber
              v-model="form.quantity"
              v-focus="hasQueryString"
              inputmode="numeric"
              locale="pt-BR"
              placeholder="Quantidade"
              :class="{ 'p-invalid': v$.form.quantity.$invalid && submitted }"
              data-test="quantity"
            />
          </FormField>

          <FormField label="Observações" :loading="loading">
            <OTextarea
              v-model="form.notes"
              auto-resize
              placeholder="Observações"
              data-test="notes"
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

import { MovementRepositoryKey } from '@/data/injectables'
import { CreateMovementParams, MovementForm } from '@/data/movement/types'
import { UserLogData } from '@/data/auth/types'

import BlockUI from '@/components/BlockUI.vue'
import NavBar from '@/components/navbar/NavBar.vue'
import FormField from '@/components/FormField.vue'
import SelectFish from '@/components/selects/SelectFish.vue'
import SelectPond from '@/components/selects/SelectPond.vue'
import UserLog from '@/components/UserLog.vue'

export default defineComponent({
  components: { NavBar, FormField, SelectFish, SelectPond, BlockUI, UserLog },
  props: {
    movementId: {
      type: Number as PropType<number>,
      default: null,
    },
    fishId: {
      type: Number as PropType<number>,
      default: null,
    },
    pondId: {
      type: Number as PropType<number>,
      default: null,
    },
    action: {
      type: String as PropType<string>,
      default: null,
    },
  },
  setup: () => {
    const movementRepository = inject(MovementRepositoryKey)

    const toast = useToast()
    const { handleHttpError } = useHttpErrorHandler(toast)
    return {
      v$: useVuelidate(),
      movementRepository,
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
        datetime: new Date(),
        fish: this.fishId,
        pond: this.pondId,
        action: this.action || 'IN',
      } as MovementForm,
      userLog: {} as UserLogData,
      submitted: false,
    }
  },
  computed: {
    editing(): boolean {
      return !!this.movementId
    },
    title(): string {
      return this.editing ? 'Editar movimento' : 'Criar movimento'
    },
    busy(): boolean {
      return this.loading || this.saving || this.deleting
    },
    hasQueryString(): boolean {
      return Boolean(this.pondId && this.fishId && this.action)
    },
  },
  validations() {
    return {
      form: {
        datetime: {
          required,
        },
        fish: {
          required,
        },
        pond: {
          required,
        },
        quantity: {
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
        await this.updateMovement()
      } else {
        await this.createMovement()
      }
      this.saving = false
    },
    async handleDelete(): Promise<void> {
      this.$confirm.require({
        message: 'Confirma a deleção do movimento?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          await this.deleteMovement()
        },
      })
    },
    async updateMovement(): Promise<void> {
      try {
        await this.movementRepository?.updateMovement(
          this.movementId,
          this.form
        )
        this.showSuccess({
          title: 'Tudo certo',
          detail: 'Movimento editado com sucesso.',
        })
        this.$router.back()
      } catch (e) {
        this.handleHttpError(e.data)
      }
    },
    async createMovement(): Promise<void> {
      try {
        await this.movementRepository?.createMovement(
          this.form as CreateMovementParams
        )
        this.showSuccess({
          title: 'Tudo certo',
          detail: 'Movimento criado com sucesso.',
        })
        this.$router.back()
      } catch (e) {
        this.handleHttpError(e.data)
      }
    },
    async deleteMovement(): Promise<void> {
      try {
        this.deleting = true
        await this.movementRepository?.deleteMovement(this.movementId)
        this.showSuccess({
          title: 'Tudo certo',
          detail: 'Movimento deletado com sucesso.',
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
          (await this.movementRepository?.getMovement(this.movementId)) || {}
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

      .action {
        display: flex;

        &__label {
          margin-left: 10px;
        }

        &__in {
          display: flex;
          margin-right: 30px;
          align-items: center;
          font-size: 14px;
        }

        &__out {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
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
