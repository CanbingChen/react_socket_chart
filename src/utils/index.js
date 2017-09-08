import is from './is'
import queryString from 'query-string';
function leftPar(num) {
    if (parseInt(num) < 10)
        return `0${num}`;
    return num;
}

export function timeStampToDate(timeStamp) {
    let date = new Date(timeStamp)
    return `${leftPar(date.getMonth() + 1)}月${leftPar(date.getDate())}日`
}
export function removeUnit(str) {
    return str.replace('元', '');
}

export function emptyFilter(str) {
    if (is.empty(str))
        return '--';
    return str;
}
export function splitString(str, len) {
    if (str.length <= len)
        return str;
    return str.substring(0, len) + '...'
}
export function paramsObject(str) {
    return queryString.parse(str);
}
export function paramsString(obj) {
    return queryString.stringify(obj);
}
export function changeBodyTile(title) {
    let body = document.body;
    document.title = title;
    let iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.onload = function() {
        setTimeout(function() {
            document.body.removeChild(iframe);
        }, 0);
    };
    document.body.appendChild(iframe);

}
