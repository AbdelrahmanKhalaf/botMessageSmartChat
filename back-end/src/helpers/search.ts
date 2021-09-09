export function ResponseMessage(response: any, array: Array<String>) {
  return array.some(function (res: any) {
    return res.toLocaleLowerCase().trim() == response.toLocaleLowerCase().trim()
  });
}
export function serchTitle(response: any, array: Array<String>) {
  return array.some(function (res: any) {
    return String(res.title) == String(response)
  });
}
export function Chacke(array: Array<any>) {
  var count:any = {};
  array.forEach(function(para:any) {
  count[para] = (count[para] || 0) + 1;
  });
  
  return count;

}

