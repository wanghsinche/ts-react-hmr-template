import { IndexState, UpdateBson } from './index/type'
import { InnerState, ChangeNumAction } from './inner/type'
import { GeneralState, LoginAction} from './general/type'
import { Dispatch } from 'redux'

export interface AppState {
    index: IndexState
    inner: InnerState
    general: GeneralState
}


export type AppAction = ChangeNumAction | UpdateBson | LoginAction

export interface ConnectedProps<T extends AppAction> {
    dispatch: Dispatch<T>
}

