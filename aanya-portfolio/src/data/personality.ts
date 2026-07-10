import type { Personality } from '@/types';

export const personalities: Personality[] = [
  {
    archetype: 'The Intuitive',
    title: 'First Instinct',
    description:
      'She sees the pattern before the data finishes loading. Trusts the pull toward the right abstraction, and is usually right about it. Curiosity leads, proof follows shortly after.',
    emoji: '🌊',
  },
  {
    archetype: 'The Aesthete',
    title: 'Core Drive',
    description:
      'Cannot ship ugly things. Physically cannot. Every system, interface, and document gets the same attention to craft, because how something feels is part of how well it works.',
    emoji: '⚖️',
  },
  {
    archetype: 'The Builder',
    title: 'Hidden Fire',
    description:
      'Owns projects like they are personal, because to her they are. Once locked in, the intensity does not stop until it ships, and ships well. High standards are the default setting, not a stretch goal.',
    emoji: '🔥',
  },
];
