import { UpdateBson, UpdateData, UpdateComposite, IndexState } from './type';

const defaultState:IndexState = {
    bson: '',
    data: [],
    summary: '',
    composite1: [],
    composite2: []
}

type ConbinedAction = UpdateBson| UpdateData | UpdateComposite

export default function reducer(state: IndexState = defaultState, action: ConbinedAction): IndexState {
    switch (action.type) {
        case '@@index/UPDATE_BSON':
            return Object.assign({}, state, {
                bson: action.payload
            })
        case '@@index/UPDATE_DATA':
           return Object.assign({}, state, {
               data: action.payload
           })
        case '@@index/UPDATE_COMPOSITE':
           return Object.assign({}, state, action.payload)
        default:
            return state
    }
}