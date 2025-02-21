


export async function mongodb(){
    console.log("mongodb");
}

import { supabase } from './supabase';

export async function saveTranscript(data: {
  text: string;
  analysis: any;
  date: Date;
}) {
  try {
    const { data: result, error } = await supabase
      .from('transcripts')
      .insert([
        {
          text: data.text,
          analysis: data.analysis,
          created_at: data.date.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return result;
  } catch (error) {
    console.error('Error saving transcript:', error);
    throw error;
  }
}

export async function getTranscripts() {
  try {
    const { data, error } = await supabase
      .from('transcripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error getting transcripts:', error);
    throw error;
  }
}

export async function saveTask(task: {
  title: string;
  dueDate: string;
  priority: string;
}) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: task.title,
        due_date: task.dueDate,
        priority: task.priority,
        completed: false,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving task:', error);
    throw error;
  }
}

export async function getTasks() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
}

export async function updateTask(id: string, updates: { completed?: boolean }) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}