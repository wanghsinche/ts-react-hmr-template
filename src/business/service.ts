import axios from 'axios'
import * as $cookies from './cookies'
import {urljoin} from './urljoin'
import {transformSearchBlobResponse} from '../lib/helper'

const $$ = axios.create({
    baseURL: '/mock'
})

export function getData(param: {
    name: string, product: string
    start: number, end: number
}){
    const config = {
        method: 'GET',
        url: `/product_indicator/searchblob?end=${param.end}&name=${param.name}&product=${param.product}&start=${param.start}`,
        headers: {'Content-Type': 'text/html; charset=UTF-8'},
        transformResponse: [transformSearchBlobResponse]
    }
    return $$(config)
}

export function getComposite(param:{
    product: string
    start: number, end: number
}, name1: string, name2: string){
    const {product, start, end} = param
    return Promise.all([getData({
        name:name1, product, start, end
    }), getData({
        name:name2, product, start, end
    })])
}

// 登陆是老代码抄过来的
export function getUsername(){
    const cookieName = 'admin_account'
    return $cookies.get(cookieName)||void(0)
}

export function login(){
    const ONE_URL = 'https://one.ejoy.com'
    const PRODUCT = 'AF'
    const OAUTH_CB_URL = urljoin(location.origin, 'one_cb.html');

    function serialize (data:any) {
        return '?' + Object.keys(data).map((keyName)=>{
            return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName]);
        }).join('&');
    };

    const nonce = Math.round(Math.random() * 100000).toString();
    const params = {
        product_code: PRODUCT,
        redirect_uri: OAUTH_CB_URL,
        scope: 'acl',
        state: 'login',
        nonce,
    };
    let user = getUsername()
    if (user) {
        return Promise.resolve(user)
    }
    return new Promise((resolve, reject)=>{
        const url = urljoin(ONE_URL,  'oauth', serialize(params));
        let counter = 0
        const win = window.open(url, 'OneOAuth');
        const timer = setInterval(()=>{
            counter ++
            if (!(win && win.closed)) {
                return
            }
            if(counter > 120){
                clearInterval(timer)
                return reject(new Error('超时'))
            }
            
            clearInterval(timer)

            user = getUsername()
            if(user){
                setTimeout(() => {
                    resolve(user)
                }, 1000);
            }
            else{
                setTimeout(() => {
                    reject(new Error('登陆失败'))
                }, 1000);
            }
        }, 1000)
    })
}