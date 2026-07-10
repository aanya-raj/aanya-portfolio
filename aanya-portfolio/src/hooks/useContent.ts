import { useAdmin } from '@/lib/admin-context';

/**
 * Hook that returns content from admin state (localStorage-persisted).
 * All pages should use this instead of directly importing from data/*.
 */
export function useContent() {
  const { state } = useAdmin();
  return state;
}
