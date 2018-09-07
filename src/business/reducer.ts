import { combineReducers } from 'redux'
import index from './index/reducer'
import inner from './inner/reducer'

import {IState as IIndex} from './index/reducer'
import {IState as IInner} from './inner/reducer'

export default combineReducers({ index, inner })
export interface IStore {
    index: IIndex,
    inner: IInner
}