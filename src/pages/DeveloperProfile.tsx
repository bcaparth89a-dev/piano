import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePianoStore } from '../store/settings';
import { 
  FiArrowLeft, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiLinkedin, 
  FiAward, 
  FiDownload, 
  FiHeart, 
  FiSmile,
  FiCode,
  FiDatabase,
  FiGlobe,
  FiCheckCircle,
  FiActivity
} from 'react-icons/fi';

export const DeveloperProfile: React.FC = () => {
  const setActivePage = usePianoStore((s) => s.setActivePage);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as any },
    },
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-[#C5A059] selection:text-black">
      
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <button
            onClick={() => setActivePage('piano')}
            className="flex items-center space-x-2 text-sm font-bold text-[#C5A059] hover:text-white transition-colors duration-200 group"
          >
            <FiArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to RaagAnubhuti</span>
          </button>

          <div className="flex items-center space-x-4">
            <a
              href="https://www.linkedin.com/in/parth-pawar-143682307"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#C5A059] transition-colors"
            >
              <FiLinkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:pawarparth233@gmail.com"
              className="text-zinc-400 hover:text-[#C5A059] transition-colors"
            >
              <FiMail className="h-5 w-5" />
            </a>
            <a
              href="/Parth_Pawar_Resume.pdf"
              download="Parth_Pawar_Resume.pdf"
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-black font-extrabold rounded-xl hover:opacity-90 transition-all text-xs"
            >
              <FiDownload className="h-3.5 w-3.5" />
              <span>Download Resume</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Wrap */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          
          {/* 1. Hero / Header Banner */}
          <motion.div 
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#141416]/60 p-8 md:p-12 shadow-2xl backdrop-blur-xl"
          >
            {/* Soft background gold glow */}
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#C5A059]/10 blur-[120px]" />
            <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-amber-600/5 blur-[120px]" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              
              {/* Profile Image - Elegant Circular Frame */}
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F3E5AB] opacity-75 blur-md group-hover:opacity-100 transition duration-300" />
                <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-2 border-[#C5A059] bg-[#1c1c1f]">
                  <img
                    src="/path.png"
                    alt="Parth Pawar"
                    className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to absolute local asset if needed
                      e.currentTarget.src = '/parth.png';
                    }}
                  />
                </div>
              </div>

              {/* Identity & Badges */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 font-sans">
                    Parth Pawar
                  </h1>
                  <p className="text-[#C5A059] font-bold text-sm md:text-base uppercase tracking-wider">
                    Surat, Gujarat, India
                  </p>
                </div>

                {/* Subtitle Roles */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                  {[
                    'Computer Application Student',
                    'Full Stack Web Developer',
                    'MERN Stack Developer',
                    'Java Developer',
                    'AI Enthusiast',
                  ].map((role) => (
                    <span 
                      key={role} 
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                {/* About Brief */}
                <p className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed">
                  I'm a passionate BCA (Hons.) student focused on web development and database management. 
                  I enjoy building user-friendly applications, exploring new technologies, collaborating with teams, 
                  and continuously improving my technical and professional skills to excel in the IT industry.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2. Grid Details: Contact & Profile Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Contact Details Card */}
            <motion.div 
              variants={cardVariants}
              className="md:col-span-4 rounded-3xl border border-white/5 bg-[#141416]/50 p-6 md:p-8 backdrop-blur-md flex flex-col justify-between"
            >
              <h3 className="text-lg font-extrabold text-white mb-6 flex items-center">
                <span className="h-5 w-1 bg-[#C5A059] rounded-full mr-2.5" />
                Contact Info
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start space-x-3.5">
                  <FiMapPin className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-300">Location</p>
                    <p className="text-zinc-400">Adajan, Surat, Gujarat – 395005</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <FiPhone className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-300">Phone</p>
                    <p className="text-zinc-400">7990101983</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <FiMail className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-300">Email</p>
                    <a href="mailto:pawarparth233@gmail.com" className="text-zinc-400 hover:text-[#C5A059] underline decoration-[#C5A059]/30 transition-colors">
                      pawarparth233@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <FiLinkedin className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-300">LinkedIn</p>
                    <a 
                      href="https://www.linkedin.com/in/parth-pawar-143682307" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-zinc-400 hover:text-[#C5A059] underline decoration-[#C5A059]/30 transition-colors break-all"
                    >
                      linkedin.com/in/parth-pawar-143682307
                    </a>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-white/5" />

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Spoken Languages</p>
                <div className="flex flex-wrap gap-2">
                  {['Gujarati', 'Hindi', 'English', 'Marathi'].map((lang) => (
                    <span key={lang} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-zinc-300">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Timelines & Details: Education */}
            <motion.div 
              variants={cardVariants}
              className="md:col-span-8 rounded-3xl border border-white/5 bg-[#141416]/50 p-6 md:p-8 backdrop-blur-md"
            >
              <h3 className="text-lg font-extrabold text-white mb-6 flex items-center">
                <span className="h-5 w-1 bg-[#C5A059] rounded-full mr-2.5" />
                Education History
              </h3>

              <div className="relative border-l border-white/10 pl-6 ml-2 space-y-8">
                
                {/* Current Education */}
                <div className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#C5A059] ring-4 ring-[#C5A059]/20" />
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] font-bold text-xs">
                      2023 – Present
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      Maharaja Sayajirao University of Vadodara
                    </h4>
                    <p className="text-sm font-semibold text-zinc-300">
                      Bachelor of Computer Application (BCA Hons.)
                    </p>
                    <p className="text-xs text-zinc-400 font-medium">
                      Current Grade: <span className="text-white font-extrabold">CGPA 8.09</span> (Till Sixth Semester)
                    </p>
                  </div>
                </div>

                {/* HSC Education */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-zinc-700 ring-4 ring-zinc-700/20" />
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold text-xs">
                      HSC Board Exam
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      Sanskar Bharti Vidhyalaya, Surat
                    </h4>
                    <p className="text-sm font-semibold text-zinc-300">
                      Commerce Stream (GHSEB)
                    </p>
                    <p className="text-xs text-zinc-400 font-medium">
                      Performance: <span className="text-white font-extrabold">99.47 Percentile</span>
                    </p>
                  </div>
                </div>

                {/* SSC Education */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-zinc-700 ring-4 ring-zinc-700/20" />
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold text-xs">
                      SSC Board Exam
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      Sanskar Bharti Vidhyalaya, Surat
                    </h4>
                    <p className="text-sm font-semibold text-zinc-300">
                      Commerce Stream (GHSEB)
                    </p>
                    <p className="text-xs text-zinc-400 font-medium">
                      Performance: <span className="text-white font-extrabold">93.26 Percentile</span>
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>

          {/* 3. Skill Matrices Section */}
          <motion.div 
            variants={cardVariants}
            className="rounded-3xl border border-white/5 bg-[#141416]/50 p-6 md:p-8 backdrop-blur-md"
          >
            <h3 className="text-lg font-extrabold text-white mb-8 flex items-center">
              <span className="h-5 w-1 bg-[#C5A059] rounded-full mr-2.5" />
              Technical & Professional Skills
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Programming Languages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[#C5A059] font-bold text-sm uppercase tracking-wider mb-2">
                  <FiCode className="h-5 w-5" />
                  <span>Programming Skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'C',
                    'C++',
                    'Python',
                    'Java',
                    'Kotlin',
                    'Data Structures & Algorithms',
                    'Object-Oriented Programming',
                  ].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-white/5 border border-white/15 rounded-xl text-xs font-semibold text-zinc-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Web Technologies */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[#C5A059] font-bold text-sm uppercase tracking-wider mb-2">
                  <FiGlobe className="h-5 w-5" />
                  <span>Web Technologies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'HTML',
                    'CSS',
                    'JavaScript',
                    'jQuery',
                    'PHP',
                    'React.js',
                    'Node.js',
                    'Express.js',
                    'Bootstrap',
                    'Tailwind CSS',
                    'Git',
                    'GitHub',
                  ].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-[#C5A059]/5 border border-[#C5A059]/15 rounded-xl text-xs font-semibold text-[#C5A059]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Databases & Others */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[#C5A059] font-bold text-sm uppercase tracking-wider mb-2">
                  <FiDatabase className="h-5 w-5" />
                  <span>Databases, Cloud & Pro</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-zinc-500 mb-2">Databases & Cloud</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['MySQL', 'DBMS', 'Firebase', 'MongoDB', 'Cloudinary'].map((db) => (
                        <span key={db} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-zinc-300">
                          {db}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-zinc-500 mb-2">Professional Competencies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Leadership', 'Teaching', 'Self Learning', 'Management', 'Team Collaboration'].map((skill) => (
                        <span key={skill} className="px-2.5 py-1 bg-zinc-800 border border-white/5 rounded-lg text-xs font-medium text-zinc-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

          {/* 4. Professional Experience */}
          <motion.div 
            variants={cardVariants}
            className="rounded-3xl border border-white/5 bg-[#141416]/50 p-6 md:p-8 backdrop-blur-md"
          >
            <h3 className="text-lg font-extrabold text-white mb-8 flex items-center">
              <span className="h-5 w-1 bg-[#C5A059] rounded-full mr-2.5" />
              Professional Experience
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Internship 1 */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C5A059]/20 hover:bg-white/[0.04] transition-all duration-300 group">
                <span className="text-xs font-bold text-[#C5A059] tracking-wider uppercase">
                  12 May 2025 – 12 July 2025
                </span>
                <h4 className="text-base font-extrabold text-white mt-1 group-hover:text-[#C5A059] transition-colors">
                  Web Application Development Intern
                </h4>
                <p className="text-xs font-bold text-zinc-400 mb-4">
                  Faculty of Science – Summer Internship Program
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Worked with React.js, Tailwind CSS, Firebase, EmailJS, Cloudinary, WhatsApp API, PDF generation, 
                  authentication modules, and collaborative Git workflows in a team structure.
                </p>
              </div>

              {/* Internship 2 */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C5A059]/20 hover:bg-white/[0.04] transition-all duration-300 group">
                <span className="text-xs font-bold text-[#C5A059] tracking-wider uppercase">
                  6 Oct 2025 – 6 Dec 2025
                </span>
                <h4 className="text-base font-extrabold text-white mt-1 group-hover:text-[#C5A059] transition-colors">
                  Web Application Development Intern
                </h4>
                <p className="text-xs font-bold text-zinc-400 mb-4">
                  Prism I.T. Systems, Surat
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Developed a robust PG Finder web platform equipped with detailed search filters, user favorite lists, 
                  owner dashboard panels, custom booking schedules, and review/feedback modules using React.js and Firebase.
                </p>
              </div>

              {/* Internship 3 */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C5A059]/20 hover:bg-white/[0.04] transition-all duration-300 group">
                <span className="text-xs font-bold text-[#C5A059] tracking-wider uppercase">
                  March 2026
                </span>
                <h4 className="text-base font-extrabold text-white mt-1 group-hover:text-[#C5A059] transition-colors">
                  Web Application Development Intern
                </h4>
                <p className="text-xs font-bold text-zinc-400 mb-4">
                  GB Innovation, Ahmedabad
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Developed a complete Food Ordering System integrating customer menus, interactive cart state, orders tracking system, admin dashboards, and comprehensive feedback management panels.
                </p>
              </div>

              {/* Internship 4 */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C5A059]/20 hover:bg-white/[0.04] transition-all duration-300 group">
                <span className="text-xs font-bold text-[#C5A059] tracking-wider uppercase">
                  Full Stack Internships
                </span>
                <h4 className="text-base font-extrabold text-white mt-1 group-hover:text-[#C5A059] transition-colors">
                  Java & Android Application Intern
                </h4>
                <p className="text-xs font-bold text-zinc-400 mb-4">
                  System Tron, Vadodara
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Built Java-based apps including calculators, custom checklists, and portfolio assets using Java, Spring Boot, Spring Framework, JavaFX, and Jetpack Compose. Developed Android applications using modern design architectures.
                </p>
              </div>

              {/* Internship 5 */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C5A059]/20 hover:bg-white/[0.04] transition-all duration-300 group md:col-span-2">
                <span className="text-xs font-bold text-[#C5A059] tracking-wider uppercase">
                  Enterprise Web Internship
                </span>
                <h4 className="text-base font-extrabold text-white mt-1 group-hover:text-[#C5A059] transition-colors">
                  Web Application Development Intern
                </h4>
                <p className="text-xs font-bold text-zinc-400 mb-4">
                  Niyaans Gallery, Surat
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Developed a professional interior designing company website using Java and Spring Boot. 
                  Included beautiful service listings, structured project showcases, customer query submission portals, and a complete admin management system.
                </p>
              </div>

            </div>
          </motion.div>

          {/* 5. Certifications & Extra-Curriculars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Certifications Card */}
            <motion.div 
              variants={cardVariants}
              className="rounded-3xl border border-white/5 bg-[#141416]/50 p-6 md:p-8 backdrop-blur-md"
            >
              <h3 className="text-lg font-extrabold text-white mb-6 flex items-center">
                <FiAward className="text-[#C5A059] mr-2.5 h-5 w-5" />
                Certifications
              </h3>

              <ul className="space-y-4">
                {[
                  { name: 'Web Development Remedial Course', issuer: 'Maharaja Sayajirao University (2023)' },
                  { name: 'Front-End Development Course', issuer: 'Udemy (2024)' },
                  { name: 'IoT Workshop – Basics of IoT', issuer: 'IoT Committee (2024)' },
                  { name: 'Code Revolution: Mastering Modern Software Development', issuer: 'IT Conference (2025)' },
                  { name: 'IBM SkillsBuild Project-Based Learning Program – Agentic AI Architecture', issuer: 'IBM SkillsBuild (2025)' },
                  { name: 'Unlocking Generative AI', issuer: 'Coursera / AI Alliance (2025)' },
                ].map((cert, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm">
                    <FiCheckCircle className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-zinc-200">{cert.name}</p>
                      <p className="text-xs text-zinc-500 font-medium">{cert.issuer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Activities & Hobbies Card */}
            <motion.div 
              variants={cardVariants}
              className="rounded-3xl border border-white/5 bg-[#141416]/50 p-6 md:p-8 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-white flex items-center">
                  <FiActivity className="text-[#C5A059] mr-2.5 h-5 w-5" />
                  Non-Academic & Hobbies
                </h3>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Social Activities & Contributions</h4>
                  <ul className="space-y-2 text-sm text-zinc-300 font-medium">
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                      <span>National Cadet Corps (NCC) – Cadet (Till A Certificate)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                      <span>Pathshala Vadodara NGO – Active Volunteer</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Hobbies</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Listening to Music', 'Watching Movies', 'Personal Development'].map((hby) => (
                      <span key={hby} className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-zinc-300">
                        {hby}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decoration quote */}
              <div className="pt-6 border-t border-white/5 mt-6 text-center text-xs italic text-zinc-500 flex items-center justify-center gap-1.5">
                <FiSmile />
                <span>Coding with passion and continuous self-learning.</span>
              </div>
            </motion.div>

          </div>

          {/* 6. Professional Declaration */}
          <motion.div 
            variants={cardVariants}
            className="rounded-3xl border border-white/5 bg-[#141416]/40 p-6 md:p-8 backdrop-blur-md text-center max-w-2xl mx-auto space-y-4"
          >
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Declaration</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              I hereby declare that all the information provided above is correct and true to the best of my knowledge and belief.
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 border border-dashed border-white/10 rounded-xl text-xs font-bold text-white bg-white/5">
                Parth Pawar
              </span>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* Profile Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-zinc-500 bg-[#09090b]">
        <div className="flex items-center justify-center space-x-1.5 mb-1 text-zinc-400">
          <span>RaagAnubhuti Portfolio</span>
          <span className="h-1 w-1 bg-zinc-600 rounded-full" />
          <span className="flex items-center text-[#C5A059] font-semibold">
            Made with <FiHeart className="mx-1 text-[#C5A059] fill-[#C5A059]" /> by Parth Pawar
          </span>
        </div>
        <p>© {new Date().getFullYear()} RaagAnubhuti (રાગઅનુભૂતિ). All rights reserved.</p>
      </footer>
    </div>
  );
};
export default DeveloperProfile;
