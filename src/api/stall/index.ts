import { defHttp } from '@/utils/http';
enum Api {
    getList = '/stall/getList',
    delete = '/stall/delete',
}

//列表数据
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//删除数据
export function delStall(params: object) {
    return defHttp.delete({ url: Api.delete, params:params}, { errorMessageMode: 'message' });
}

/**数据类型 */
export interface DataItem {
    id:number,
    name: string;
}
