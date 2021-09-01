<template>
  <BlockUI :blocked="busy">
    <NavBar navigation="back">
      <template #body>
        <div class="nav__title">Transferência</div>
      </template>
    </NavBar>
    <div class="content">
      <div class="form">
        <FormField
          label="Data"
          :invalid="v$.form.datetime.$invalid && submitted"
          invalid-message="Data inválida."
        >
          <OCalendar
            v-model="form.datetime"
            :class="{ 'p-invalid': v$.form.datetime.$invalid && submitted }"
            show-icon
            placeholder="Data"
            touch-u-i
          />
        </FormField>

        <FormField
          label="Peixe"
          :invalid="v$.form.fish.$invalid && submitted"
          invalid-message="Peixe inválido."
        >
          <SelectFish
            v-model="form.fish"
            :class="{ 'p-invalid': v$.form.fish.$invalid && submitted }"
          />
        </FormField>

        <FormField
          label="Açude origem"
          :invalid="v$.form.pondOrigin.$invalid && submitted"
          invalid-message="Açude origem inválido."
        >
          <SelectPond
            v-model="form.pondOrigin"
            :class="{ 'p-invalid': v$.form.pondOrigin.$invalid && submitted }"
          />
        </FormField>

        <FormField
          label="Açude destino"
          :invalid="v$.form.pondDest.$invalid && submitted"
          invalid-message="Açude destino inválido."
        >
          <SelectPond
            v-model="form.pondDest"
            v-focus
            :class="{ 'p-invalid': v$.form.pondDest.$invalid && submitted }"
          />
        </FormField>

        <FormField
          label="Quantidade"
          :invalid="v$.form.quantity.$invalid && submitted"
          invalid-message="Quantidade inválida."
        >
          <OInputNumber
            v-model="form.quantity"
            locale="pt-BR"
            inputmode="numeric"
            placeholder="Quantidade"
            :class="{ 'p-invalid': v$.form.quantity.$invalid && submitted }"
          />
        </FormField>

        <FormField label="Observações">
          <OTextarea
            v-model="form.notes"
            auto-resize
            placeholder="Observações"
          />
        </FormField>
      </div>

      <div class="actions">
        <OButton
          class="p-button-primary"
          icon-pos="right"
          label="CRIAR TRANSFERÊNCIA"
          :loading="creating"
          @click="handleSave"
        />
      </div>
    </div>
  </BlockUI>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from 'vue'
import { required } from '@vuelidate/validators'

import { useVuelidate } from '@vuelidate/core'
import { useToast } from '@/util/toast'
import { useHttpErrorHandler } from '@/util/http-error-handler'

import { TransferRepositoryKey } from '@/data/injectables'
import { TransferForm, CreateTransferParams } from '@/data/transfer/types'

import NavBar from '@/components/navbar/NavBar.vue'
import BlockUI from '@/components/BlockUI.vue'
import FormField from '@/components/FormField.vue'
import SelectFish from '@/components/selects/SelectFish.vue'
import SelectPond from '@/components/selects/SelectPond.vue'
import { Pond } from '@/data/pond/types'

export default defineComponent({
  components: { NavBar, FormField, SelectFish, SelectPond, BlockUI },
  props: {
    fishId: {
      type: Number as PropType<number>,
      default: null,
    },
    pondOriginId: {
      type: Number as PropType<number>,
      default: null,
    },
    quantity: {
      type: Number as PropType<number>,
      default: null,
    },
  },
  setup: () => {
    const transferRepository = inject(TransferRepositoryKey)

    const toast = useToast()
    const { handleHttpError } = useHttpErrorHandler(toast)

    return {
      v$: useVuelidate(),
      transferRepository,
      handleHttpError,
      ...toast,
    }
  },
  data() {
    return {
      creating: false,
      form: {
        datetime: new Date(),
        fish: this.fishId,
        quantity: this.quantity,
        pondOrigin: this.pondOriginId,
        description: 'Transferência entre açudes.',
      } as TransferForm,
      submitted: false,
    }
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
        pondOrigin: {
          required,
        },
        pondDest: {
          required,
          diffThanOrigin: (val: number | Pond): boolean => {
            if (
              val &&
              typeof val !== 'number' &&
              typeof this.form.pondOrigin !== 'number'
            ) {
              return val.id !== this.form.pondOrigin?.id
            } else {
              return true
            }
          },
        },
        quantity: {
          required,
        },
      },
    }
  },
  computed: {
    busy(): boolean {
      return this.creating
    },
  },
  methods: {
    async handleSave(): Promise<void> {
      this.submitted = true
      if (this.v$.$invalid) {
        return
      }
      await this.createTransfer()
    },
    async createTransfer(): Promise<void> {
      try {
        this.creating = true
        await this.transferRepository?.create(this.form as CreateTransferParams)
        this.showSuccess({
          title: 'Tudo certo',
          detail: 'Transferência criada com sucesso.',
        })
        this.$router.back()
      } catch (e) {
        this.handleHttpError(e.data)
      } finally {
        this.creating = false
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
  padding: 16px;

  .form {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    gap: 16px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
