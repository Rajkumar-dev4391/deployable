const supabase = require('../config/supabase');

class Message {
  static async create({ chatId, userId, role, content, model, toolsUsed = [], metadata = {} }) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        chat_id: chatId,
        user_id: userId,
        role,
        content,
        model,
        tools_used: toolsUsed,
        metadata,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  }

  static async findByChatId(chatId) {
    // Get messages first
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (messagesError) {
      throw messagesError;
    }
    
    // Get attachments for each message separately
    const messagesWithAttachments = await Promise.all(
      (messages || []).map(async (message) => {
        const { data: attachments, error: attachError } = await supabase
          .from('attachments')
          .select('id, filename, original_name, mime_type, file_size, storage_path')
          .eq('message_id', message.id);
        
        if (attachError) {
          console.error('Error loading attachments for message:', message.id, attachError);
          return { ...message, attachments: [] };
        }
        
        return { ...message, attachments: attachments || [] };
      })
    );
    
    return messagesWithAttachments;
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  }
}

module.exports = Message;