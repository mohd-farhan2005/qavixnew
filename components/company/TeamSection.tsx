'use client';

import React, { useEffect, useState } from 'react';
import { fetchTeamMembers, resolveMemberImage, type ApiTeamMember } from '@/lib/blog-api';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  image: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Zack Hill',
    role: 'Founder & CEO',
    email: 'zack@qavyx.com',
    image: '/images/team/team_zack.webp',
  },
  {
    id: '2',
    name: 'Arlton Lowry',
    role: 'Partner & CCO',
    email: 'arlton@qavyx.com',
    image: '/images/team/team_arlton.webp',
  },
  {
    id: '3',
    name: 'Sarah Devine',
    role: 'Director of Projects',
    email: 'sarah@qavyx.com',
    image: '/images/team/team_sarah.webp',
  },
  {
    id: '4',
    name: 'Will Carter',
    role: 'Director of Accounts',
    email: 'will@qavyx.com',
    image: '/images/team/team_will.webp',
  },
  {
    id: '5',
    name: 'Calvin Bramlett',
    role: 'Creative & Design Director',
    email: 'calvin@qavyx.com',
    image: '/images/team/team_calvin.webp',
  },
];

export function mapApiToTeamMembers(apiMembers: ApiTeamMember[]): TeamMember[] {
  const activeMembers = apiMembers.filter((m) => m.is_active !== false);
  const sorted = (activeMembers.length > 0 ? activeMembers : apiMembers).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  return sorted.map((m) => ({
    id: String(m.id),
    name: m.name,
    role: m.position || m.role || '',
    email: m.email || '',
    image: resolveMemberImage(m.name, m.photo_url || m.photo || m.image),
  }));
}

function TeamCard({ member, isAutoScroll = false }: { member: TeamMember; isAutoScroll?: boolean }) {
  return (
    <div
      className={`group relative flex flex-col justify-end select-none ${
        isAutoScroll
          ? 'w-[215px] xs:w-[230px] sm:w-[245px] shrink-0 h-[350px] xs:h-[370px] sm:h-[390px]'
          : 'w-full max-w-[230px] h-[340px] xs:h-[365px] sm:h-[390px] lg:h-[410px]'
      }`}
    >
      {/* Left Half Green Pillar (cut in half to ~52% width, matching exact reference) */}
      <div className="absolute left-0 top-0 bottom-0 w-[52%] sm:w-[54%] rounded-tl-[40px] xs:rounded-tl-[48px] sm:rounded-tl-[54px] rounded-tr-none rounded-b-none bg-gradient-to-b from-[#2ABD00] via-[#1a7a0e] to-[#072403] overflow-hidden shadow-[0_8px_25px_rgba(42,189,0,0.2)] transition-all duration-300 group-hover:shadow-[0_12px_35px_rgba(42,189,0,0.4)]">
        {/* Vertical Outlined "DIRECTORS" Watermark Text on the Left Green Half */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 -rotate-90 origin-center text-2xl xs:text-3xl sm:text-[34px] font-black uppercase tracking-[0.25em] pointer-events-none select-none whitespace-nowrap opacity-40"
          style={{
            WebkitTextStroke: '1.4px rgba(255, 255, 255, 0.85)',
            color: 'transparent',
          }}
        >
          DIRECTORS
        </span>

        {/* Subtle top ambient light on the green strip */}
        <div
          aria-hidden="true"
          className="absolute -top-8 -left-8 w-24 h-24 bg-[#86ff66]/20 rounded-full blur-lg pointer-events-none"
        />

        {/* Bottom dark gradient fade for text legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none"
        />
      </div>

      {/* Bottom full-width dark gradient for legible text across both halves */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/85 to-transparent z-15 pointer-events-none"
      />

      {/* Team Member Cutout (Enlarged character prominently filling card, breaking out of green strip) */}
      <div className="relative z-20 w-full h-[80%] sm:h-[82%] flex items-end justify-center pointer-events-none pb-0.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-contain object-bottom scale-105 sm:scale-110 transition-transform duration-300 group-hover:scale-115 drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
          loading="eager"
        />
      </div>

      {/* Name, Role & Email Content at the Bottom */}
      <div className="relative z-30 px-2.5 sm:px-3 pb-3 pt-1 text-left">
        <h3 className="text-base sm:text-lg font-bold text-white font-sans leading-tight tracking-tight group-hover:text-[#2ABD00] transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {member.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-[#A0A0A0] font-sans leading-tight mt-1 font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {member.role}
        </p>
        <a
          href={`mailto:${member.email}`}
          className="inline-block text-[10px] sm:text-[11px] text-[#2ABD00] hover:text-[#86ff66] font-sans leading-tight mt-1 hover:underline transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
        >
          {member.email}
        </a>
      </div>
    </div>
  );
}

export interface TeamSectionProps {
  initialApiMembers?: ApiTeamMember[] | null;
  initialMembers?: TeamMember[];
}

export function TeamSection({ initialApiMembers, initialMembers }: TeamSectionProps) {
  const [members, setMembers] = useState<TeamMember[]>(() => {
    if (initialMembers && initialMembers.length > 0) return initialMembers;
    if (initialApiMembers && initialApiMembers.length > 0) {
      return mapApiToTeamMembers(initialApiMembers);
    }
    return TEAM_MEMBERS;
  });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTeam() {
      try {
        const data = await fetchTeamMembers();
        if (isMounted && data && data.length > 0) {
          setMembers(mapApiToTeamMembers(data));
        }
      } catch (err) {
        console.warn('Failed to load team from API, using fallback:', err);
      }
    }

    loadTeam();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="qx-team-showcase"
      aria-labelledby="qx-team-heading"
      className="relative w-full py-12 sm:py-16 md:py-20 bg-black select-none overflow-hidden"
    >
      {/* Keyframe animation for smooth auto-scroll on mobile/tablet */}
      <style>{`
        @keyframes qx-team-slide {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .qx-team-autoscroll-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: qx-team-slide 22s linear infinite;
        }
      `}</style>

      <div className="mx-auto max-w-[var(--qx-shell)] px-3 sm:px-6">
        {/* Header: Meet the Team */}
        <div className="mb-6 sm:mb-8 md:mb-10 flex items-center justify-between text-left">
          <p
            id="qx-team-heading"
            className="font-mono text-2xs uppercase tracking-[0.28em] text-[#919A94]"
          >
            Meet the Team
          </p>

          {/* Mobile Auto-Scroll Active Indicator */}
          <div className="lg:hidden flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ABD00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2ABD00]"></span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#2ABD00]/90">
              {isPaused ? 'Paused' : 'Auto-Scrolling'}
            </span>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MOBILE / TABLET (< lg): SMOOTH AUTO-SCROLLING CONTINUOUS LOOP
            ------------------------------------------------------------- */}
        <div
          className="lg:hidden relative w-full overflow-hidden -mx-3 sm:-mx-6 px-3 sm:px-6 py-2"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="qx-team-autoscroll-track gap-3.5 sm:gap-4"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {/* First Set */}
            {members.map((member) => (
              <TeamCard key={`orig-${member.id}`} member={member} isAutoScroll />
            ))}
            {/* Duplicated Second Set for Seamless Infinite Loop */}
            {members.map((member) => (
              <TeamCard key={`clone-${member.id}`} member={member} isAutoScroll />
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------------
            DESKTOP (>= lg): 5 CARDS IN A SINGLE GRID ROW
            ------------------------------------------------------------- */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-3.5 xl:gap-4 justify-items-center">
          {members.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
