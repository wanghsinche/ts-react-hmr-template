import { UpdateComposite } from './type'

export function updateCompositeAction(data: {
    composite1: any[],
    composite2: any[]
}): UpdateComposite {
    return {
        type: '@@index/UPDATE_COMPOSITE',
        payload: data
    }
}
