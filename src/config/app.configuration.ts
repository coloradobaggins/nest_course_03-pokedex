export const appConfiguration = ()=> ({
  environment: process.env.environment || 'dev',
  mongodbStr: process.env.MONGODB_STR,
  mongodbName: process.env.MONGODB_NAME,
  port: process.env.PORT || 3001,
  paginationDefaultLimit: process.env.PAGINATION_DEFAULT_LIMIT,
  paginationDefaultOffset: process.env.PAGINATION_DEFAULT_OFFSET,
})