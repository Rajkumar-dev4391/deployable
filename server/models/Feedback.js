const supabase = require('../config/supabase');

class Feedback {
  static async create({ userId, userName, userImage, message, rating }) {
    const { data, error } = await supabase
      .from('feedback')
      .insert([{
        user_id: userId,
        user_name: userName,
        user_image: userImage,
        message,
        rating,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
      .from('feedback')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  static async findPublicFeedback(limit = 10) {
    const { data, error } = await supabase
      .from('feedback')
      .select('id, user_name, user_image, message, rating, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from('feedback')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
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
      .from('feedback')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  }

  static async getStats() {
    const { data, error } = await supabase
      .from('feedback')
      .select('rating');
    
    if (error) {
      throw error;
    }
    
    const totalFeedback = data.length;
    const averageRating = totalFeedback > 0 
      ? data.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedback 
      : 0;
    
    const ratingDistribution = {
      1: data.filter(f => f.rating === 1).length,
      2: data.filter(f => f.rating === 2).length,
      3: data.filter(f => f.rating === 3).length,
      4: data.filter(f => f.rating === 4).length,
      5: data.filter(f => f.rating === 5).length,
    };
    
    return {
      totalFeedback,
      averageRating: Math.round(averageRating * 100) / 100,
      ratingDistribution
    };
  }
}

module.exports = Feedback;
