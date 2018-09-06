// import { changeName, changeTime } from './action';
interface IState {
    name: string,
    time: Date
}

interface IAction{
    type: string
}

export default function reducer(state: IState, action: IAction): void {
    console.log(1);
}