function startsWith(str:string, searchString:string) {
    return str.substr(0, searchString.length) === searchString;
}

function normalize(str:string, options:any) {

    if (startsWith(str, 'file://')) {

        // make sure file protocol has max three slashes
        str = str.replace(/(\/{0,3})\/*/g, '$1');
    } else {

        // make sure protocol is followed by two slashes
        str = str.replace(/:\//g, '://');

        // remove consecutive slashes
        str = str.replace(/([^:\s\%\3\A])\/+/g, '$1/');
    }

    // remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');

    // replace ? in parameters with &
    str = str.replace(/(\?.+)\?/g, '$1&');

    return str;
}

export function urljoin(...arg:any[]) {
    let input = arg;
    let options = {};

    if (typeof arg[0] === 'object') {
        // new syntax with array and options
        input = arg[0];
        options = arg[1] || {};
    }

    const joined = [].slice.call(input, 0).join('/');
    return normalize(joined, options);
}