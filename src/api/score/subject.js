import request from '@/utils/request'

// 查询学科管理列表
export function listSubject(query) {
  return request({
    url: '/score/subject/list',
    method: 'get',
    params: query
  })
}

// 查询学科管理详细
export function getSubject(subjectId) {
  return request({
    url: '/score/subject/' + subjectId,
    method: 'get'
  })
}

// 新增学科管理
export function addSubject(data) {
  return request({
    url: '/score/subject',
    method: 'post',
    data: data
  })
}

// 修改学科管理
export function updateSubject(data) {
  return request({
    url: '/score/subject',
    method: 'put',
    data: data
  })
}

// 删除学科管理
export function delSubject(subjectId) {
  return request({
    url: '/score/subject/' + subjectId,
    method: 'delete'
  })
}
