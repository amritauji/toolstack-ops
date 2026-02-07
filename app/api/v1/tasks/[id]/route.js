import { NextResponse } from 'next/server';
import { apiAuth, checkRateLimit, rateLimitHeaders } from '@/lib/apiAuth';

export async function GET(request, { params }) {
  const authResult = await apiAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { profile, supabase } = authResult;
  const rateLimit = await checkRateLimit(profile.id);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  const { data: task, error } = await supabase
    .from('tasks')
    .select('*, profiles:assigned_to(id, full_name, email)')
    .eq('id', params.id)
    .single();
  
  if (error || !task) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  return NextResponse.json(
    { data: task },
    { headers: rateLimitHeaders(rateLimit) }
  );
}

export async function PATCH(request, { params }) {
  const authResult = await apiAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { profile, supabase } = authResult;
  const rateLimit = await checkRateLimit(profile.id);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  const body = await request.json();
  const { title, description, status, priority, assigned_to, due_date } = body;
  
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (assigned_to !== undefined) updates.assigned_to = assigned_to;
  if (due_date !== undefined) updates.due_date = due_date;
  
  const { data: task, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', params.id)
    .select('*, profiles:assigned_to(id, full_name, email)')
    .single();
  
  if (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  return NextResponse.json(
    { data: task },
    { headers: rateLimitHeaders(rateLimit) }
  );
}

export async function DELETE(request, { params }) {
  const authResult = await apiAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { profile, supabase } = authResult;
  const rateLimit = await checkRateLimit(profile.id);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', params.id);
  
  if (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  return NextResponse.json(
    { message: 'Task deleted successfully' },
    { headers: rateLimitHeaders(rateLimit) }
  );
}
