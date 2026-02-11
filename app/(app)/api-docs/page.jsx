import { createSupabaseServer } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ApiDocsClient from './ApiDocsClient';

export const metadata = {
  title: 'API Documentation - ToolStack Ops',
  description: 'REST API documentation and key management',
};

export default async function ApiDocsPage() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return (
      <div style={{ padding: '24px' }}>
        <DashboardHeader profile={profile} />
        <ApiDocsClient profile={profile} />
      </div>
    );
  } catch (error) {
    console.error('API docs page error:', error);
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Failed to load API docs</h2>
        <p>{error.message}</p>
      </div>
    );
  }
}