import {Action} from 'redux';

export interface IndexState{
    bson: string
    data: any[]
}

export interface UpdateBson extends Action{
    type:'@@index/UPDATE_BSON'
    payload: string
}

export interface UpdateData extends Action{
    type:'@@index/UPDATE_DATA'
    payload: any[]
}

