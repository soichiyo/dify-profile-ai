import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  try {
    return new PrismaClient()
  } catch (error) {
    console.warn('Failed to initialize Prisma client:', error)
    // Return a mock client for build time
    return null as any
  }
}

export const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production')
  global.prisma = prisma

