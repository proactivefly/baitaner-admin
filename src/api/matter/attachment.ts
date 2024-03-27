import { defHttp } from '@/utils/http';
import { join } from 'lodash';
enum Api {
    getList = '/matter/attachment/get_list',
    del = '/matter/attachment/del',
}

//列表数据
export function getList(params: object) {
if(params["createdTime"]){
    params["createdTime"]=join(params["createdTime"])
}
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//删除数据
export function del(params: object) {
    return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}
/**数据类型 */
export interface DataItem {
    id:number,
    name: string;
}
