import { defHttp } from '@/utils/http';
enum Api {
    getList = '/beijingEntryPermit/getList',
    save = '/beijingEntryPermit/save',  
    del = '/beijingEntryPermit/del',
    upStatus='/beijingEntryPermit/upStatus' 
}

//列表数据
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}


export function save(params: object) {
  return defHttp.post({ url: Api.save, params:params }, { errorMessageMode: 'none' });
}

export function del(params: object) {
  return defHttp.delete({ url: Api.del, params:params }, { errorMessageMode: 'none' });
}

export function upStatus(params: object){
  return defHttp.post({ url: Api.upStatus, params:params }, { errorMessageMode: 'none' });
}