import { UpdateComposite, InnerState } from './type';

const defaultState:InnerState = {
    composite1: [],
    composite2: []
}

type ConbinedAction = UpdateComposite

export default function reducer(state: InnerState = defaultState, action: ConbinedAction): InnerState {
    switch (action.type) {
        case '@@index/UPDATE_COMPOSITE':
           return Object.assign({}, state, action.payload)
        default:
            return state
    }
}