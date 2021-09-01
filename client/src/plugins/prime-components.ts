import { App } from 'vue'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import Skeleton from 'primevue/skeleton'
import Calendar from 'primevue/calendar'
import RadioButton from 'primevue/radiobutton'
import InputNumber from 'primevue/inputnumber'
import AutoComplete from 'primevue/autocomplete'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Textarea from 'primevue/textarea'
import Password from 'primevue/password'
import Tag from 'primevue/tag'
import Chip from 'primevue/chip'
import Sidebar from 'primevue/sidebar'
import SelectButton from 'primevue/selectbutton'
import Avatar from 'primevue/avatar'

// import 'primevue/resources/themes/saga-blue/theme.css'
import '@/assets/theme.scss'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const locale = {
  startsWith: 'Começa com',
  contains: 'Contém',
  notContains: 'Não contém',
  endsWith: 'Termina com',
  equals: 'Igual',
  notEquals: 'Diferente',
  noFilter: 'Sem filtro',
  lt: 'Menor que',
  lte: 'Menor ou igual à',
  gt: 'Maior que',
  gte: 'Maior ou igual à',
  dateIs: 'Data é',
  dateIsNot: 'Data não é',
  dateBefore: 'Data é antes',
  dateAfter: 'Data é depois',
  clear: 'Limpar',
  apply: 'Aplicar',
  matchAll: 'Corresponde a tudo',
  matchAny: 'Corresponde a qualquer',
  addRule: 'Adicionar regra',
  removeRule: 'Remover regra',
  accept: 'Sim',
  reject: 'Não',
  cancel: 'Cancelar',
  dayNames: [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  today: 'Hoje',
  weekHeader: 'Semana',
  dateFormat: 'dd/mm/yy',
  firstDayOfWeek: 0,
  weak: 'Fraco',
  medium: 'Médio',
  strong: 'Forte',
  passwordPrompt: 'Informe uma senha',
  emptyFilterMessage: 'Sem resultados',
  emptyMessage: 'Nenhuma opção disponível',
}

export default {
  install: (app: App<Element>): void => {
    app.use(PrimeVue, {
      locale,
    })
    app.use(ToastService)
    app.use(ConfirmationService)

    app.component('OButton', Button)
    app.component('OInputText', InputText)
    app.component('OInputSwitch', InputSwitch)
    app.component('OCheckbox', Checkbox)
    app.component('OToast', Toast)
    app.component('OConfirmDialog', ConfirmDialog)
    app.component('OSkeleton', Skeleton)
    app.component('OCalendar', Calendar)
    app.component('ORadioButton', RadioButton)
    app.component('OInputNumber', InputNumber)
    app.component('OAutoComplete', AutoComplete)
    app.component('ODialog', Dialog)
    app.component('OProgressSpinner', ProgressSpinner)
    app.component('OTextarea', Textarea)
    app.component('OPassword', Password)
    app.component('OTag', Tag)
    app.component('OChip', Chip)
    app.component('OSidebar', Sidebar)
    app.component('OSelectButton', SelectButton)
    app.component('OAvatar', Avatar)
  },
}
