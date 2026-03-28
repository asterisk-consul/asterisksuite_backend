import { apiProxy } from '~~/server/utils/api-proxy'

function mapLocation(row: any) {
  return {
    ...row,
    postalCode: row.postal_code,
    createdAt: row.created_at
  }
}

export default defineEventHandler(async (event) => {
  const res = await apiProxy(event, '/locations')

  // array
  if (Array.isArray(res)) {
    return res.map(mapLocation)
  }

  // single object
  return mapLocation(res)
})
