import { UpdateBson, UpdateData, IndexState } from './type';

const defaultState:IndexState = {
    bson: '',
    data: []
}

type ConbinedAction = UpdateBson| UpdateData 

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
        default:
            return state
    }
}