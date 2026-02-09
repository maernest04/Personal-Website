'use client';

import { motion } from 'framer-motion';
import TileCard from '@/components/ui/TileCard';
import { RESUME, COLORS } from '@/lib/constants';

function ContactCard({
  contact,
  index,
}: {
  contact: (typeof RESUME.contact)[number];
  index: number;
}) {
  return (
    <motion.a
      href={contact.href}
      target={contact.type !== 'email' ? '_blank' : undefined}
      rel={contact.type !== 'email' ? 'noopener noreferrer' : undefined}
      className="block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.12 }}
    >
      <TileCard hoverable>
        <div className="flex items-center gap-4">
          {/* Dragon tile */}
          <div
            className="w-14 h-18 rounded-t-md rounded-b-sm flex items-center justify-center shrink-0"
            style={{
              width: 56,
              height: 72,
              background: COLORS.tileIvory,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              border: contact.dragon === '白' ? `2px solid ${COLORS.bambooBlue}` : 'none',
            }}
          >
            {contact.dragon !== '白' ? (
              <span
                className="cn-text text-3xl font-bold"
                style={{ color: contact.dragonColor }}
              >
                {contact.dragon}
              </span>
            ) : (
              <div
                className="w-8 h-10 rounded border-2"
                style={{ borderColor: COLORS.bambooBlue }}
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#8D6E63' }}>
              {contact.label}
            </p>
            <p className="text-base font-semibold mt-0.5 truncate" style={{ color: '#3E2723' }}>
              {contact.value}
            </p>
          </div>

          {/* Arrow */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8D6E63"
            strokeWidth="2"
            strokeLinecap="round"
            className="shrink-0"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </TileCard>
    </motion.a>
  );
}

export default function ContactSection() {
  return (
    <div>
      <motion.p
        className="text-sm mb-6"
        style={{ color: COLORS.textSecondary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        The three dragons — <span className="cn-text" style={{ color: COLORS.redDragon }}>中</span>{' '}
        <span className="cn-text" style={{ color: COLORS.greenDragon }}>發</span>{' '}
        <span className="cn-text" style={{ color: COLORS.bambooBlue }}>白</span> — each open a path to connect.
      </motion.p>

      <div className="grid gap-4">
        {RESUME.contact.map((contact, i) => (
          <ContactCard key={contact.type} contact={contact} index={i} />
        ))}
      </div>
    </div>
  );
}
