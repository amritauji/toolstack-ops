import { NextResponse } from 'next/server';
import { apiAuth, checkRateLimit, rateLimitHeaders } from '@/lib/apiAuth';

export async function GET(request) {
  // Authenticate
  const authResult = await apiAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { profile, supabase } = authResult;
  
  // Check rate limit
  const rateLimit = await checkRateLimit(profile.id);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { 
        status: 429,
        headers: rateLimitHeaders(rateLimit)
      }
    );
  }
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const assignedTo = searchParams.get('assigned_to');
  const limit = parseInt(searchParams.get('limit') || '100');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  // Build query
  let query = supabase
    .from('tasks')
    .select('*, profiles:assigned_to(id, full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (status) query = query.eq('status', status);
  if (priority) query = query.eq('priority', priority);
  if (assignedTo) query = query.eq('assigned_to', assignedTo);
  
  const { data: tasks, error, count } = await query;
  
  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  return NextResponse.json(
    {
      data: tasks,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count
      }
    },
    { headers: rateLimitHeaders(rateLimit) }
  );
}

export async function POST(request) {
  // Authenticate
  const authResult = await apiAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { profile, supabase } = authResult;
  
  // Check rate limit
  const rateLimit = await checkRateLimit(profile.id);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  // Parse request body
  const body = await request.json();
  const { title, description, status, priority, assigned_to, due_date } = body;
  
  // Validate required fields
  if (!title) {
    return NextResponse.json(
      { error: 'Title is required' },
      { status: 400, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  // Create task
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      title,
      description: description || null,
      status: status || 'todo',
      priority: priority || 'medium',
      assigned_to: assigned_to || null,
      due_date: due_date || null,
      created_by: profile.id
    })
    .select('*, profiles:assigned_to(id, full_name, email)')
    .single();
  
  if (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  return NextResponse.json(
    { data: task },
    { status: 201, headers: rateLimitHeaders(rateLimit) }
  );
}
