const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create wards
  const wards = await Promise.all([
    prisma.ward.create({
      data: {
        name: 'Ward 1',
        geojson: {
          type: 'Feature',
          properties: { name: 'Ward 1' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
          }
        }
      }
    }),
    prisma.ward.create({
      data: {
        name: 'Ward 2',
        geojson: {
          type: 'Feature',
          properties: { name: 'Ward 2' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[2, 0], [3, 0], [3, 1], [2, 1], [2, 0]]]
          }
        }
      }
    }),
    prisma.ward.create({
      data: {
        name: 'Ward 3',
        geojson: {
          type: 'Feature',
          properties: { name: 'Ward 3' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[4, 0], [5, 0], [5, 1], [4, 1], [4, 0]]]
          }
        }
      }
    })
  ])

  console.log('✓ Created 3 wards')

  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Water',
        slaHours: 24
      }
    }),
    prisma.department.create({
      data: {
        name: 'Roads',
        slaHours: 48
      }
    }),
    prisma.department.create({
      data: {
        name: 'Sanitation',
        slaHours: 12
      }
    })
  ])

  console.log('✓ Created 3 departments')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const officerPassword = await bcrypt.hash('officer123', 10)
  const citizenPassword = await bcrypt.hash('citizen123', 10)

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@civiccrm.gov',
      phone: '+1234567890',
      password: adminPassword, // NOTE: In production, use proper password hashing
      role: 'admin'
    }
  })

  const officerUser = await prisma.user.create({
    data: {
      fullName: 'John Officer',
      email: 'officer@civiccrm.gov',
      phone: '+1234567891',
      password: officerPassword, // NOTE: In production, use proper password hashing
      role: 'officer'
    }
  })

  const citizenUser = await prisma.user.create({
    data: {
      fullName: 'Jane Citizen',
      email: 'citizen@example.com',
      phone: '+1234567892',
      password: citizenPassword, // NOTE: In production, use proper password hashing
      role: 'citizen'
    }
  })

  console.log('✓ Created 3 users (admin, officer, citizen)')

  // Create officer linked to user
  const officer = await prisma.officer.create({
    data: {
      userId: officerUser.id,
      wardId: wards[0].id,
      departmentId: departments[0].id,
      workload: 0
    }
  })

  console.log('✓ Created officer record')

  // Create sample complaints
  await prisma.complaint.create({
    data: {
      citizenId: citizenUser.id,
      wardId: wards[0].id,
      departmentId: departments[0].id,
      description: 'Water supply has been interrupted for the past 2 days. No water in taps.',
      location: '123 Main Street, Ward 1',
      latitude: 40.7128,
      longitude: -74.0060,
      category: 'Water Supply',
      sentiment: 'negative',
      priorityScore: 8.5,
      status: 'submitted',
      assignedOfficer: officer.id,
      assignedAt: new Date()
    }
  })

  await prisma.complaint.create({
    data: {
      citizenId: citizenUser.id,
      wardId: wards[1].id,
      departmentId: departments[1].id,
      description: 'Large pothole on the main road causing traffic issues.',
      location: '456 Oak Avenue, Ward 2',
      latitude: 40.7580,
      longitude: -73.9855,
      category: 'Road Damage',
      sentiment: 'negative',
      priorityScore: 7.0,
      status: 'in_progress'
    }
  })

  console.log('✓ Created sample complaints')

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      actorId: adminUser.id,
      action: 'CREATE',
      targetType: 'User',
      targetId: officerUser.id,
      metadata: {
        role: 'officer',
        department: 'Water'
      }
    }
  })

  await prisma.auditLog.create({
    data: {
      actorId: citizenUser.id,
      action: 'CREATE',
      targetType: 'Complaint',
      metadata: {
        category: 'Water Supply',
        status: 'submitted'
      }
    }
  })

  console.log('✓ Created audit logs')

  console.log('Database seeding completed successfully!')
  console.log('\nLogin credentials:')
  console.log('Admin: admin@civiccrm.gov / admin123')
  console.log('Officer: officer@civiccrm.gov / officer123')
  console.log('Citizen: citizen@example.com / citizen123')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
