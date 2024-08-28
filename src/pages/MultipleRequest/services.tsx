import { request, useRequest } from '@umijs/max';

export const getUsers = useRequest(() => {
  return request('/api/users');
});
