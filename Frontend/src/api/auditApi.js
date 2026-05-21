import axiosClient from './axiosClient'

// ── Audit Logs (system-generated, read-only for Health Admin) ──
export const getAllAuditLogs = () =>
  axiosClient.get('/api/v1/audit-logs')

export const getAuditLogById = (id) =>
  axiosClient.get(`/api/v1/audit-logs/${id}`)

export const getAuditLogsByUserId = (userId) =>
  axiosClient.get(`/api/v1/audit-logs/user/${userId}`)

// ── Audits (officer-managed records, used by Auditor role) ──
export const getAllAudits = () =>
  axiosClient.get('/api/v1/audits')

export const createAudit = (data) =>
  axiosClient.post('/api/v1/audits', data)

export const getAuditsByOfficerId = (officerId) =>
  axiosClient.get(`/api/v1/audits/officer/${officerId}`)

export const getAuditsByStatus = (status) =>
  axiosClient.get(`/api/v1/audits/status/${status}`)

export const updateAudit = (id, data) =>
  axiosClient.put(`/api/v1/audits/${id}`, data)
