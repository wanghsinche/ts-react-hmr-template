import { combineReducers, Dispatch, Reducer } from 'redux'
import index from './index/reducer'
import inner from './inner/reducer'

import { IndexState, ChangeNameAction, ChangeTimeAction } from './index/type'
import { InnerState, ChangeNumAction } from './inner/type'

export interface AppState {
    index: IndexState,
    inner: InnerState
}

export type AppAction = ChangeNameAction|ChangeTimeAction|ChangeNumAction

export const appReducer: Reducer<AppState> = combineReducers<AppState>({ index, inner })

export interface ConnectedProps<T extends AppAction>{
    dispatch: Dispatch<T>
}