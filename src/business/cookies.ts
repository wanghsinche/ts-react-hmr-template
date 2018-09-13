export interface CookieAttribute {
    expires?: Date|number;
    path?: string;
    domain?: string;
    secure?: boolean;
}

export let defaultAttribute: CookieAttribute = {};

export function set(key: string, value: string, attributes: CookieAttribute){
    attributes = Object.assign({path: '/'}, defaultAttribute, attributes);

    if (typeof attributes.expires === 'number') {
        const expires = new Date();
        expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
        attributes.expires = expires;
    }

    value = encodeURIComponent(String(value))
        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

    key = encodeURIComponent(String(key));
    key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
    key = key.replace(/[\(\)]/g, encodeURI);

    return (document.cookie = [
        key, '=', value,
        attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        attributes.path ? '; path=' + attributes.path : '',
        attributes.domain ? '; domain=' + attributes.domain : '',
        attributes.secure ? '; secure' : ''
    ].join(''));
}

export function remove(key: string, attributes: CookieAttribute) {
    set(key, '', Object.assign(attributes, {expires: -1}));
}

const RDECODE = /(%[0-9A-Z]{2})+/g;

export function get(key: string): string|object|null {
    const cookies = document.cookie ? document.cookie.split('; ') : [];

    const result = {};
    for (const i of cookies) {
        const parts = i.split('=');
        let cookie = parts.slice(1).join('=');

        if (cookie.charAt(0) === '"') {
            cookie = cookie.slice(1, -1);
        }

        const name = parts[0].replace(RDECODE, decodeURIComponent);
        cookie = cookie.replace(RDECODE, decodeURIComponent);
        if (key === name) {
            return cookie;
        }
        if(!key) {
            result[name] = cookie;
        }
    }
    if(key) {
        return null;
    }
    return result;
}