import { combineReducers, Reducer } from 'redux'
import index from './index/reducer'
import inner from './inner/reducer'
import general from './general/reducer'

import {AppState} from './type'

export const appReducer: Reducer<AppState> = combineReducers<AppState>({ index, inner, general })

