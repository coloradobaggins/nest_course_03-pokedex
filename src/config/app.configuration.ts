export const appConfiguration = ()=> ({
  environment: process.env.environment || 'dev',
  mondodb: process.env.MONGODB,
  port: process.env.PORT || 3001,
  paginationDefaultLimit: process.env.PAGINATION_DEFAULT_LIMIT,
  paginationDefaultOffset: process.env.PAGINATION_DEFAULT_OFFSET,
})