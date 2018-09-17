import { UpdateBson, UpdateData } from './type'
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

