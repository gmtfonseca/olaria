import { ActionContext } from 'vuex'
import jwtDecode from 'jwt-decode'

import { SiginParams } from '@/data/session/types'
import { AuthState, StoreState } from '@/store/types'

import { httpService } from '@/util/http'
import SessionRepository from '@/data/session/repository'
import { AuthSession, AuthTokenDecoded } from '@/data/auth/types'

const TOKEN_KEY = 'olaria_token'

const state = {
  token: localStorage.getItem(TOKEN_KEY),
}

const mutations = {
  setToken: function (state: AuthState, token: string): void {
    state.token = token
    localStorage.setItem(TOKEN_KEY, state.token)
  },
  deleteToken: function (state: AuthState): void {
    state.token = ''
    localStorage.removeItem(TOKEN_KEY)
  },
}

const getters = {
  token: (state: AuthState): string => `Bearer ${state.token}`,
  loggedIn: (state: AuthState): boolean => !!state.token,
  session: (state: AuthState): AuthSession | null => {
    if (!state.token) {
      return null
    }
    const { id, name, iat, expiresIn } = jwtDecode(
      state.token
    ) as AuthTokenDecoded
    const session = {
      user: {
        id,
        name,
      },
      iat,
      expiresIn,
    }
    return session
  },
}

const actions = {
  sigin: async (
    context: ActionContext<unknown, StoreState>,
    params: SiginParams
  ): Promise<void> => {
    try {
      const sessionRepository = new SessionRepository(httpService)
      const token = await sessionRepository.createSession(params)
      context.commit('setToken', token)
    } catch (e) {
      context.commit('deleteToken')
      throw e
    }
  },
  signout: function (context: ActionContext<unknown, StoreState>): void {
    context.commit('deleteToken')
  },
}

export default {
  state,
  mutations,
  getters,
  actions,
}
