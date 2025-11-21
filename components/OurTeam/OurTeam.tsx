'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './OurTeam.module.css';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
  skills?: string[];
  social?: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

interface OurTeamProps {
  sectionId?: string;
  title?: React.ReactNode;
  subtitle?: string;
  members?: TeamMember[];
}

const defaultMembers: TeamMember[] = [
  {
    name: 'Cristian Torres',
    role: 'Developer',
    image: '/images/portfolio/cris.jpg',
    bio: 'Desarrollador apasionado por crear soluciones digitales innovadoras y de alta calidad.',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js'],
    social: {
      linkedin: '#',
      github: '#',
      email: '#',
    },
  },
];

const OurTeam = ({
  sectionId = 'nuestro-equipo',
  title = (
    <>
      Nuestro <strong>Equipo</strong>
    </>
  ),
  subtitle = 'Conoce a los profesionales que hacen posible cada proyecto',
  members = defaultMembers,
}: OurTeamProps) => {
  return (
    <section id={sectionId} className={styles.ourTeam}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={styles.pill}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <i className="fas fa-users"></i>
          <span>Equipo Profesional</span>
        </motion.div>

        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>

        <motion.p
          className={styles.sectionSubtitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className={styles.teamGrid}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2, delay: 0.4 }}
        >
          {members.map((member, index) => (
            <motion.div
              key={index}
              className={styles.teamCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className={styles.memberImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
                <div className={styles.roleBadge}>
                  <i className="fas fa-code"></i>
                  <span>{member.role}</span>
                </div>
              </div>

              <div className={styles.memberInfo}>
                <h3 className={styles.memberName}>{member.name}</h3>
                {member.bio && <p className={styles.memberBio}>{member.bio}</p>}

                {member.skills && member.skills.length > 0 && (
                  <div className={styles.skillsContainer}>
                    {member.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {member.social && (
                  <div className={styles.socialLinks}>
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        aria-label="LinkedIn"
                      >
                        <i className="fab fa-linkedin"></i>
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        aria-label="GitHub"
                      >
                        <i className="fab fa-github"></i>
                      </a>
                    )}
                    {member.social.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        className={styles.socialLink}
                        aria-label="Email"
                      >
                        <i className="fas fa-envelope"></i>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OurTeam;

