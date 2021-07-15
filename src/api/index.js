import request from "../utils/request";

export const fetchData = (query) => {
  return request({
    url: "/posts",
    method: "get",
    params: query,
  });
};
export const submitData = (query) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: "/posts",
    method: "post",
    data: query,
  });
};
export const editData = (query,id) => {
    return request({
      url: "/posts/"+id,
      method: "PUT",
      data: query,
    });
  };
export const delData = (query) => {
  return request({
    url: "/posts/"+query,
    method: "delete", 
  });
};
