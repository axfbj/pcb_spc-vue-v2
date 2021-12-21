import http from './http.js'
export default {
  menu_list(data) {
    return http.post('/spc/menu/list', data)
  },
  menu_tree(data) {
    return http.post('/spc/menu/tree', data)
  },
  menu_save(data) {
    return http.post('/spc/menu/save', data)
  },
  menu_update(data) {
    return http.post('/spc/menu/update', data)
  },
  menu_info(data) {
    return http.post(`/spc/menu/info/${data.id}`, data, 'form')
  },
  menu_delete(data) {
    return http.post('/spc/menu/delete', data)
  }
}
