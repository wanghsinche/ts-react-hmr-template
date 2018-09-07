import { ChangeNameAction, ChangeTimeAction, IndexState } from './type';

const defaultState:IndexState = {
    name: '',
    time: new Date()
}

type ConbinedAction = ChangeNameAction|ChangeTimeAction

export default function reducer(state: IndexState = defaultState, action: ConbinedAction): IndexState {
    switch (action.type) {
        case '@@index/CHANGE_NAME':
            return Object.assign({}, state, {
                name: action.payload
            })
        case '@@index/CHANGE_TIME':
            return Object.assign({}, state, {
                time: action.payload
            })
        default:
            return state
    }
}