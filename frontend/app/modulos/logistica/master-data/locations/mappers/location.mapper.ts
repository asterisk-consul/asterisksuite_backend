export function mapLocationFromApi(row: any) {
  return {
    ...row,
    postalCode: row.postal_code,
    createdAt: row.created_at
  }
}
