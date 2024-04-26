import { defHttp } from '@/utils/http';
enum Api {
    getList = '/stall/getList',
    delete = '/stall/delete',
    updateStatus="/stall/updateStatus"
}

//列表数据
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//删除数据
export function delStall(params: object) {
    return defHttp.delete({ url: Api.delete, params:params}, { errorMessageMode: 'message' });
}


// 修改状态

export function updateStatus(params: object) {
    return defHttp.post({ url: Api.updateStatus, params:params}, { errorMessageMode: 'message' });
}
/**数据类型 */
export interface DataItem {
    id:number,
    name: string;
}
