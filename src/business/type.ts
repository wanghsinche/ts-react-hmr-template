import { IndexState, UpdateBson } from './index/type'
import { InnerState, UpdateComposite } from './inner/type'
import { GeneralState, LoginAction} from './general/type'
import { Dispatch } from 'redux'

export interface AppState {
    index: IndexState
    inner: InnerState
    general: GeneralState
}


export type AppAction = UpdateComposite | UpdateBson | LoginAction

export interface ConnectedProps<T extends AppAction> {
    dispatch: Dispatch<T>
}

