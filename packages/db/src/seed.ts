import { db } from './index';
import * as schema from './schema';
import type { ProgramStage, RubricCriterion } from './schema';

// Helper function to generate realistic names
const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
  'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateEmail(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
}

// Clear existing data
async function clearDatabase() {
  console.log('Clearing existing data...');

  await db.delete(schema.auditLogs);
  await db.delete(schema.reviews);
  await db.delete(schema.files);
  await db.delete(schema.applications);
  await db.delete(schema.programs);
  await db.delete(schema.users);

  console.log('Database cleared.');
}

// Seed users
async function seedUsers() {
  console.log('Seeding users...');

  const users = [
    {
      email: 'coordinator@cohortflow.org',
      name: 'Sarah Johnson',
      role: 'coordinator' as const,
    },
    {
      email: 'reviewer1@cohortflow.org',
      name: 'Dr. Michael Chen',
      role: 'reviewer' as const,
    },
    {
      email: 'reviewer2@cohortflow.org',
      name: 'Dr. Emily Rodriguez',
      role: 'reviewer' as const,
    },
  ];

  const insertedUsers = await db.insert(schema.users).values(users).returning();
  console.log(`Created ${insertedUsers.length} staff users.`);

  // Create 10 applicant users
  const applicants = [];
  for (let i = 0; i < 10; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    applicants.push({
      email: generateEmail(firstName, lastName),
      name: `${firstName} ${lastName}`,
      role: 'applicant' as const,
    });
  }

  const insertedApplicants = await db.insert(schema.users).values(applicants).returning();
  console.log(`Created ${insertedApplicants.length} applicant users.`);

  return {
    coordinator: insertedUsers[0],
    reviewers: [insertedUsers[1], insertedUsers[2]],
    applicants: insertedApplicants,
  };
}

// Seed programs
async function seedPrograms(coordinatorId: string) {
  console.log('Seeding programs...');

  const stages: ProgramStage[] = [
    {
      id: 'stage-1',
      name: 'Personal Information',
      description: 'Basic demographic and contact information',
      order: 1,
      fields: [
        {
          id: 'field-1-1',
          type: 'text',
          label: 'First Name',
          required: true,
        },
        {
          id: 'field-1-2',
          type: 'text',
          label: 'Last Name',
          required: true,
        },
        {
          id: 'field-1-3',
          type: 'email',
          label: 'Email Address',
          required: true,
        },
        {
          id: 'field-1-4',
          type: 'phone',
          label: 'Phone Number',
          required: true,
        },
        {
          id: 'field-1-5',
          type: 'date',
          label: 'Date of Birth',
          required: true,
        },
      ],
    },
    {
      id: 'stage-2',
      name: 'Address & Demographics',
      description: 'Residential information and background',
      order: 2,
      fields: [
        {
          id: 'field-2-1',
          type: 'text',
          label: 'Street Address',
          required: true,
        },
        {
          id: 'field-2-2',
          type: 'text',
          label: 'City',
          required: true,
        },
        {
          id: 'field-2-3',
          type: 'text',
          label: 'State',
          required: true,
        },
        {
          id: 'field-2-4',
          type: 'text',
          label: 'ZIP Code',
          required: true,
        },
        {
          id: 'field-2-5',
          type: 'select',
          label: 'Emergency Contact Relationship',
          required: true,
          options: ['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'],
        },
      ],
    },
    {
      id: 'stage-3',
      name: 'Medical History',
      description: 'Health background and conditions',
      order: 3,
      fields: [
        {
          id: 'field-3-1',
          type: 'multiselect',
          label: 'Pre-existing Conditions',
          required: false,
          options: ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'None'],
        },
        {
          id: 'field-3-2',
          type: 'textarea',
          label: 'Current Medications',
          required: false,
          placeholder: 'List all current medications...',
        },
        {
          id: 'field-3-3',
          type: 'checkbox',
          label: 'I consent to medical record release',
          required: true,
        },
      ],
    },
    {
      id: 'stage-4',
      name: 'Volunteer Experience',
      description: 'Previous volunteer work and skills',
      order: 4,
      fields: [
        {
          id: 'field-4-1',
          type: 'textarea',
          label: 'Describe previous volunteer experience',
          required: true,
          placeholder: 'Include organizations, roles, and duration...',
          validation: {
            min: 50,
            max: 1000,
          },
        },
        {
          id: 'field-4-2',
          type: 'multiselect',
          label: 'Skills',
          required: true,
          options: [
            'Patient Care',
            'Administrative',
            'Fundraising',
            'Event Planning',
            'Technology',
            'Translation',
            'Transportation',
          ],
        },
        {
          id: 'field-4-3',
          type: 'select',
          label: 'Availability',
          required: true,
          options: ['Weekdays', 'Weekends', 'Evenings', 'Flexible'],
        },
      ],
    },
    {
      id: 'stage-5',
      name: 'Motivation & Goals',
      description: 'Why you want to volunteer',
      order: 5,
      fields: [
        {
          id: 'field-5-1',
          type: 'textarea',
          label: 'Why do you want to volunteer with us?',
          required: true,
          placeholder: 'Share your motivation...',
          validation: {
            min: 100,
            max: 1000,
          },
        },
        {
          id: 'field-5-2',
          type: 'textarea',
          label: 'What do you hope to gain from this experience?',
          required: true,
          placeholder: 'Describe your goals...',
          validation: {
            min: 50,
            max: 500,
          },
        },
      ],
    },
    {
      id: 'stage-6',
      name: 'Documents & References',
      description: 'Upload required documents',
      order: 6,
      fields: [
        {
          id: 'field-6-1',
          type: 'file',
          label: 'Resume/CV',
          required: true,
        },
        {
          id: 'field-6-2',
          type: 'file',
          label: 'Background Check Authorization',
          required: true,
        },
        {
          id: 'field-6-3',
          type: 'text',
          label: 'Reference 1 Name',
          required: true,
        },
        {
          id: 'field-6-4',
          type: 'email',
          label: 'Reference 1 Email',
          required: true,
        },
        {
          id: 'field-6-5',
          type: 'text',
          label: 'Reference 2 Name',
          required: true,
        },
        {
          id: 'field-6-6',
          type: 'email',
          label: 'Reference 2 Email',
          required: true,
        },
      ],
    },
  ];

  const rubric: RubricCriterion[] = [
    {
      id: 'criterion-1',
      name: 'Relevant Experience',
      description: 'Quality and relevance of previous volunteer or healthcare experience',
      weight: 0.25,
      scale: {
        min: 1,
        max: 5,
        labels: {
          1: 'No experience',
          3: 'Some relevant experience',
          5: 'Extensive relevant experience',
        },
      },
    },
    {
      id: 'criterion-2',
      name: 'Motivation & Commitment',
      description: 'Demonstrated passion and long-term commitment',
      weight: 0.25,
      scale: {
        min: 1,
        max: 5,
        labels: {
          1: 'Unclear motivation',
          3: 'Good motivation',
          5: 'Exceptional passion and commitment',
        },
      },
    },
    {
      id: 'criterion-3',
      name: 'Skills Alignment',
      description: 'Match between applicant skills and program needs',
      weight: 0.20,
      scale: {
        min: 1,
        max: 5,
        labels: {
          1: 'Poor alignment',
          3: 'Moderate alignment',
          5: 'Perfect alignment',
        },
      },
    },
    {
      id: 'criterion-4',
      name: 'Communication Skills',
      description: 'Quality of written responses and clarity',
      weight: 0.15,
      scale: {
        min: 1,
        max: 5,
        labels: {
          1: 'Poor communication',
          3: 'Adequate communication',
          5: 'Excellent communication',
        },
      },
    },
    {
      id: 'criterion-5',
      name: 'Availability',
      description: 'Schedule flexibility and time commitment',
      weight: 0.15,
      scale: {
        min: 1,
        max: 5,
        labels: {
          1: 'Very limited availability',
          3: 'Moderate availability',
          5: 'Highly flexible availability',
        },
      },
    },
  ];

  const exportMapping = {
    'field-1-1': 'First Name',
    'field-1-2': 'Last Name',
    'field-1-3': 'Email',
    'field-1-4': 'Phone',
    'field-2-1': 'Address',
    'field-2-2': 'City',
    'field-2-3': 'State',
    'field-2-4': 'ZIP',
    'field-4-2': 'Skills',
    'field-4-3': 'Availability',
  };

  const program = {
    name: 'Community Health Volunteer Program 2026',
    description:
      'Join our team of dedicated volunteers making a difference in community health. This program connects passionate individuals with opportunities to support patients, families, and healthcare staff in various capacities.',
    stages,
    rubric,
    exportMapping,
    creatorId: coordinatorId,
    status: 'active' as const,
  };

  const [insertedProgram] = await db.insert(schema.programs).values(program).returning();
  console.log(`Created program: ${insertedProgram.name}`);

  return insertedProgram;
}

// Seed applications
async function seedApplications(
  programId: string,
  applicants: schema.User[]
) {
  console.log('Seeding applications...');

  const statuses: Array<schema.Application['status']> = [
    'submitted',
    'under_review',
    'under_review',
    'under_review',
    'accepted',
    'accepted',
    'rejected',
    'waitlisted',
    'draft',
    'submitted',
  ];

  const stages = [5, 6, 6, 6, 6, 6, 6, 6, 2, 4];

  const applications = applicants.map((applicant, index) => {
    const sampleData: Record<string, any> = {
      'field-1-1': applicant.name.split(' ')[0],
      'field-1-2': applicant.name.split(' ')[1],
      'field-1-3': applicant.email,
      'field-1-4': `(555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      'field-1-5': `19${Math.floor(Math.random() * 30 + 70)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
      'field-2-1': `${Math.floor(Math.random() * 9999 + 1)} ${getRandomItem(['Main', 'Oak', 'Maple', 'Pine', 'Cedar'])} St`,
      'field-2-2': getRandomItem(['Springfield', 'Riverside', 'Fairview', 'Georgetown', 'Madison']),
      'field-2-3': getRandomItem(['CA', 'NY', 'TX', 'FL', 'IL']),
      'field-2-4': String(Math.floor(Math.random() * 90000 + 10000)),
      'field-2-5': getRandomItem(['Spouse', 'Parent', 'Sibling', 'Friend']),
    };

    if (stages[index] >= 3) {
      sampleData['field-3-1'] = [getRandomItem(['Diabetes', 'Hypertension', 'None'])];
      sampleData['field-3-2'] = 'None currently';
      sampleData['field-3-3'] = true;
    }

    if (stages[index] >= 4) {
      sampleData['field-4-1'] = `I have volunteered at local hospitals and community centers for the past ${Math.floor(Math.random() * 5 + 1)} years. My experience includes patient companionship, administrative support, and event coordination.`;
      sampleData['field-4-2'] = [
        getRandomItem(['Patient Care', 'Administrative', 'Event Planning']),
        getRandomItem(['Technology', 'Translation', 'Transportation']),
      ];
      sampleData['field-4-3'] = getRandomItem(['Weekdays', 'Weekends', 'Flexible']);
    }

    if (stages[index] >= 5) {
      sampleData['field-5-1'] = 'I am passionate about healthcare and want to give back to my community. I believe everyone deserves access to compassionate care and support.';
      sampleData['field-5-2'] = 'I hope to gain practical experience in healthcare settings and develop my interpersonal skills while making a positive impact.';
    }

    if (stages[index] >= 6) {
      sampleData['field-6-1'] = 'resume.pdf';
      sampleData['field-6-2'] = 'background-check.pdf';
      sampleData['field-6-3'] = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
      sampleData['field-6-4'] = `reference1@example.com`;
      sampleData['field-6-5'] = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
      sampleData['field-6-6'] = `reference2@example.com`;
    }

    return {
      programId,
      applicantId: applicant.id,
      currentStage: stages[index],
      status: statuses[index],
      data: sampleData,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
    };
  });

  const insertedApplications = await db
    .insert(schema.applications)
    .values(applications)
    .returning();
  console.log(`Created ${insertedApplications.length} applications.`);

  return insertedApplications;
}

// Seed files
async function seedFiles(
  applications: schema.Application[],
  applicants: schema.User[]
) {
  console.log('Seeding files...');

  const files = [];

  for (const app of applications) {
    if (app.currentStage >= 6) {
      const applicant = applicants.find((a) => a.id === app.applicantId);
      if (applicant) {
        files.push(
          {
            applicationId: app.id,
            filename: 'resume.pdf',
            url: `https://storage.cohortflow.org/files/${app.id}/resume.pdf`,
            uploadedBy: applicant.id,
            createdAt: new Date(app.createdAt.getTime() + 1000 * 60 * 5), // 5 minutes after application
          },
          {
            applicationId: app.id,
            filename: 'background-check-authorization.pdf',
            url: `https://storage.cohortflow.org/files/${app.id}/background-check.pdf`,
            uploadedBy: applicant.id,
            createdAt: new Date(app.createdAt.getTime() + 1000 * 60 * 10), // 10 minutes after application
          }
        );
      }
    }
  }

  if (files.length > 0) {
    const insertedFiles = await db.insert(schema.files).values(files).returning();
    console.log(`Created ${insertedFiles.length} files.`);
    return insertedFiles;
  }

  return [];
}

// Seed reviews
async function seedReviews(
  applications: schema.Application[],
  reviewers: schema.User[]
) {
  console.log('Seeding reviews...');

  const reviews = [];

  // Get applications that are under review or already decided
  const reviewableApps = applications.filter(
    (app) =>
      app.status === 'under_review' ||
      app.status === 'accepted' ||
      app.status === 'rejected' ||
      app.status === 'waitlisted'
  );

  for (const app of reviewableApps) {
    // Each application gets 2-3 reviews
    const numReviews = Math.floor(Math.random() * 2) + 2;

    for (let i = 0; i < Math.min(numReviews, reviewers.length); i++) {
      const reviewer = reviewers[i];

      const scores = {
        'criterion-1': Math.floor(Math.random() * 3) + 3, // 3-5
        'criterion-2': Math.floor(Math.random() * 3) + 3,
        'criterion-3': Math.floor(Math.random() * 3) + 2, // 2-4
        'criterion-4': Math.floor(Math.random() * 3) + 3,
        'criterion-5': Math.floor(Math.random() * 3) + 2,
      };

      const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5;

      const comments = [
        'Strong candidate with relevant experience and excellent communication skills.',
        'Good motivation but limited availability may be a concern.',
        'Impressive background in community service. Would be a great addition to the team.',
        'Solid application overall. Some areas could use more detail.',
        'Exceptional candidate with clear passion for healthcare volunteering.',
        'Meets basic requirements but lacks standout qualities.',
      ];

      const status =
        app.status === 'under_review'
          ? getRandomItem(['completed', 'in_progress', 'pending'] as const)
          : ('completed' as const);

      reviews.push({
        applicationId: app.id,
        reviewerId: reviewer.id,
        scores,
        comments: avgScore > 3.5 ? comments[Math.floor(Math.random() * 3)] : comments[Math.floor(Math.random() * 3) + 3],
        status,
        createdAt: new Date(app.createdAt.getTime() + 1000 * 60 * 60 * 24 * (i + 1)), // 1-2 days after application
      });
    }
  }

  if (reviews.length > 0) {
    const insertedReviews = await db.insert(schema.reviews).values(reviews).returning();
    console.log(`Created ${insertedReviews.length} reviews.`);
    return insertedReviews;
  }

  return [];
}

// Seed audit logs
async function seedAuditLogs(
  users: schema.User[],
  program: schema.Program,
  applications: schema.Application[]
) {
  console.log('Seeding audit logs...');

  const logs = [];

  // Program creation log
  logs.push({
    userId: program.creatorId,
    action: 'create',
    resource: 'program',
    resourceId: program.id,
    metadata: { programName: program.name },
    createdAt: program.createdAt,
  });

  // Application submission logs
  for (const app of applications) {
    if (app.status !== 'draft') {
      logs.push({
        userId: app.applicantId,
        action: 'submit',
        resource: 'application',
        resourceId: app.id,
        metadata: { programId: app.programId, stage: app.currentStage },
        createdAt: app.createdAt,
      });

      // Status change logs
      if (app.status === 'accepted' || app.status === 'rejected' || app.status === 'waitlisted') {
        logs.push({
          userId: program.creatorId, // Coordinator made the decision
          action: 'status_change',
          resource: 'application',
          resourceId: app.id,
          metadata: { from: 'under_review', to: app.status },
          createdAt: new Date(app.updatedAt.getTime() + 1000 * 60 * 60 * 24 * 3), // 3 days after submission
        });
      }
    }
  }

  // User login logs (sample)
  for (const user of users) {
    const numLogins = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numLogins; i++) {
      logs.push({
        userId: user.id,
        action: 'login',
        resource: 'user',
        resourceId: user.id,
        metadata: { ip: `192.168.1.${Math.floor(Math.random() * 255)}` },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }
  }

  const insertedLogs = await db.insert(schema.auditLogs).values(logs).returning();
  console.log(`Created ${insertedLogs.length} audit log entries.`);

  return insertedLogs;
}

// Main seed function
async function seed() {
  console.log('Starting database seed...\n');

  try {
    await clearDatabase();

    const { coordinator, reviewers, applicants } = await seedUsers();
    const program = await seedPrograms(coordinator.id);
    const applications = await seedApplications(program.id, applicants);
    await seedFiles(applications, applicants);
    await seedReviews(applications, reviewers);

    const allUsers = [coordinator, ...reviewers, ...applicants];
    await seedAuditLogs(allUsers, program, applications);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Coordinator: ${coordinator.email}`);
    console.log(`Reviewer 1:  ${reviewers[0].email}`);
    console.log(`Reviewer 2:  ${reviewers[1].email}`);
    console.log(`Applicant:   ${applicants[0].email}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seed();
