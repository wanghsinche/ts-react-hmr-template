import {Action} from 'redux';

export interface InnerState{
    composite1: any[]
    composite2: any[]
}


export interface UpdateComposite extends Action{
    type:'@@index/UPDATE_COMPOSITE'
    payload: {
        composite1:any[]
        composite2:any[]
    }
}
