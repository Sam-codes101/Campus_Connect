const User = require('../models/User');
const Resource = require('../models/Resource');
const LostFound = require('../models/LostFound');
const Post = require('../models/Post');
const CampusUpdate = require('../models/CampusUpdate');

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Already seeded
    }

    console.log('🌱 Seeding initial campus data for project presentation...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'Dr. S. K. Sharma (HOD CSE)',
      email: 'admin@college.edu',
      password: 'admin123',
      branch: 'CSE',
      year: 'Faculty',
      section: 'Staff',
      role: 'admin',
      bio: 'Head of Computer Science & Engineering Department. Campus administrator.',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
      interests: ['Academic Administration', 'Curriculum Design', 'Research'],
    });

    // 2. Create Students
    const student1 = await User.create({
      name: 'Soumya Chaudhary',
      email: 'student@college.edu',
      password: 'student123',
      branch: 'CSE',
      year: '2nd Year',
      section: 'A',
      role: 'student',
      bio: '2nd year CSE student enthusiastic about Full-stack development and Web technologies.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      interests: ['React', 'Node.js', 'System Design', 'Hackathons'],
    });

    const student2 = await User.create({
      name: 'Rahul Sen',
      email: 'rahul.cse@college.edu',
      password: 'rahul123',
      branch: 'CSE',
      year: '3rd Year',
      section: 'B',
      role: 'student',
      bio: 'Competitive programmer and open source contributor. GDSC lead.',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
      interests: ['Algorithms', 'Python', 'Competitive Coding'],
    });

    // 3. Create Campus Updates
    await CampusUpdate.create([
      {
        title: '📢 End Semester Examination Schedule Announced (Nov-Dec 2026)',
        description: 'The tentative timetable for 3rd and 4th year B.Tech examinations is now available on the department notice board and online portal. Please clear all fee dues before 20th Oct.',
        category: 'Notices',
        date: '2026-10-15',
        attachment: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        createdBy: admin._id,
      },
      {
        title: '🚀 Annual Hackathon: HackCampus 2026 Registrations Open',
        description: '36-hour offline hackathon on Web3, AI in Education, and Smart Campus solutions. Cash prizes worth ₹1,00,000 for top 3 teams. Register with your team of 2-4 members.',
        category: 'Hackathons',
        date: '2026-11-05',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        createdBy: admin._id,
      },
      {
        title: '💡 Workshop: Hands-on Docker & Kubernetes with Industry Mentors',
        description: 'Department of CSE is hosting a weekend bootcamp on DevOps fundamentals. Certificate of completion will be provided for all attendees.',
        category: 'Workshops',
        date: '2026-10-22',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
        createdBy: admin._id,
      },
      {
        title: '⚠️ Last Date to Submit Mini Project Synopsis & Team Details',
        description: 'All 5th semester CSE student teams must upload project synopsis signed by their respective project guides before 5:00 PM.',
        category: 'Deadlines',
        date: '2026-10-18',
        createdBy: admin._id,
      },
    ]);

    // 4. Create Library Resources
    await Resource.create([
      {
        title: 'Database Management Systems Complete Unit 1-5 Lecture Notes',
        description: 'Comprehensive handwritten and digitized notes covering Relational Algebra, SQL, Normalization (1NF to BCNF), and Transaction Processing (ACID).',
        subject: 'Database Management Systems',
        branch: 'CSE',
        semester: 'Semester 5',
        type: 'Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: student1._id,
      },
      {
        title: 'Operating Systems Previous 5 Years Question Papers (Solved)',
        description: 'Collection of university PYQs from 2021 to 2025 with step-by-step solutions for CPU Scheduling, Deadlock banker algorithm, and Paging.',
        subject: 'Operating Systems',
        branch: 'CSE',
        semester: 'Semester 4',
        type: 'PYQs',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: student2._id,
      },
      {
        title: 'Computer Networks Socket Programming Lab Record & Output',
        description: 'Includes C / Python code for TCP Client-Server, UDP Chat application, CRC checksum, and Wireshark packet capture analysis.',
        subject: 'Computer Networks',
        branch: 'CSE',
        semester: 'Semester 5',
        type: 'Lab Files',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: student1._id,
      },
      {
        title: 'Design and Analysis of Algorithms Assignment 1 & 2 Solutions',
        description: 'Asymptotic notation analysis, Divide & Conquer algorithms, Greedy Knapsack, and Dynamic Programming Matrix Chain Multiplication.',
        subject: 'Design and Analysis of Algorithms',
        branch: 'CSE',
        semester: 'Semester 4',
        type: 'Assignments',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: student2._id,
      },
    ]);

    // 5. Create Lost & Found Items
    await LostFound.create([
      {
        title: 'Casio fx-991EX Scientific Calculator',
        description: 'Left in Central Library 2nd floor reading hall table #14 yesterday around 4 PM. Has a small sticker with initials "SV" on the back cover.',
        type: 'Lost',
        category: 'Electronics',
        location: 'Central Library, 2nd Floor',
        date: '2026-10-07',
        contact: 'soumya.v@college.edu / +91 98765 43210',
        status: 'Active',
        postedBy: student1._id,
      },
      {
        title: 'Blue Water Bottle & College ID Card',
        description: 'Found on the bench near the Canteen garden. Belonged to 2nd year IT student. Kept safely with security cabin desk.',
        type: 'Found',
        category: 'Documents',
        location: 'Canteen Garden Bench',
        date: '2026-10-08',
        contact: 'rahul.cse@college.edu / Security Guard Desk',
        status: 'Active',
        postedBy: student2._id,
      },
      {
        title: 'Black HP 65W Laptop Charger',
        description: 'Misplaced in CSE Lab 3 near Terminal 22 during the afternoon lab session.',
        type: 'Lost',
        category: 'Electronics',
        location: 'CSE Lab 3, Terminal 22',
        date: '2026-10-06',
        contact: 'student@college.edu',
        status: 'Resolved',
        postedBy: student1._id,
      },
    ]);

    // 6. Create Community Posts
    const post1 = await Post.create({
      author: student1._id,
      content: 'Hey everyone! Is anyone forming a team for the upcoming HackCampus 2026? We need 1 backend developer proficient in Express/MongoDB and 1 UI/UX designer. Drop a comment if interested!',
      category: 'Opportunities',
      likes: [student2._id],
      comments: [
        {
          user: student2._id,
          text: 'Hey Soumya! I am interested. Let me know when we can meet at the library to brainstorm ideas.',
          createdAt: new Date(),
        },
      ],
    });

    await Post.create({
      author: student2._id,
      content: 'Pro tip for 3rd semester students appearing for Data Structures viva next week: focus thoroughly on Tree Traversals, AVL rotations, and QuickSort worst-case recurrence relations! All the best!',
      category: 'Academics',
      likes: [student1._id, admin._id],
      comments: [],
    });

    console.log('✅ Initial demo data seeded successfully!');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

module.exports = seedInitialData;
