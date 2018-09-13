import { UpdateBson, UpdateData, UpdateComposite } from './type'
export function updateBsonAction(data: string): UpdateBson {
    return {
        type: '@@index/UPDATE_BSON',
        payload: data
    }
}
export function updateDataAction(data: any[]): UpdateData {
    return {
        type: '@@index/UPDATE_DATA',
        payload: data
    }
}
export function updateCompositeAction(data: {
    composite1: any[],
    composite2: any[]
}): UpdateComposite {
    return {
        type: '@@index/UPDATE_COMPOSITE',
        payload: data
    }
}
