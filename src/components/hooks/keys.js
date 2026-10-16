export const leaseKeys = {
  all: ['leases'],
  lists: () => [...leaseKeys.all, 'list'],
  list: (filters = {}) => [...leaseKeys.lists(), filters],
  details: () => [...leaseKeys.all, 'detail'],
  detail: (leaseId) => [...leaseKeys.details(), leaseId],
  byUser: (userId) => [...leaseKeys.lists(), 'user', userId],
};

export const warehouseKeys = {
  all: ['warehouses'],
  lists: () => [...warehouseKeys.all, 'list'],
  list: (filters = {}) => [...warehouseKeys.lists(), filters],
  details: () => [...warehouseKeys.all, 'detail'],
  detail: (warehouseId) => [...warehouseKeys.details(), warehouseId],
  summary: () => [...warehouseKeys.all, 'summary'],
};