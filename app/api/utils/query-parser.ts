export const parseQueryParams = (url: string, defaults: Record<string, any> = {}) => {
  const { searchParams } = new URL(url)
  const result: Record<string, any> = {}
  
  Object.entries(defaults).forEach(([key, defaultValue]) => {
    const value = searchParams.get(key)
    if (typeof defaultValue === 'number') {
      result[key] = value ? Number(value) : defaultValue
    } else if (typeof defaultValue === 'boolean') {
      result[key] = value === 'true' || (value !== 'false' && defaultValue)
    } else {
      result[key] = value || defaultValue
    }
  })
  
  return result
}

export const buildWhereClause = (params: Record<string, any>) => {
  const where: Record<string, any> = {}
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      where[key] = value
    }
  })
  
  return Object.keys(where).length > 0 ? where : {}
}