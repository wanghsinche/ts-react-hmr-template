import {Action} from 'redux';

export interface IndexState{
    bson: string
    data: any[]
    summary: ''
    composite1: any[]
    composite2: any[]
}

export interface UpdateBson extends Action{
    type:'@@index/UPDATE_BSON'
    payload: string
}

export interface UpdateData extends Action{
    type:'@@index/UPDATE_DATA'
    payload: any[]
}

export interface UpdateComposite extends Action{
    type:'@@index/UPDATE_COMPOSITE'
    payload: {
        composite1:any[]
        composite2:any[]
    }
}
