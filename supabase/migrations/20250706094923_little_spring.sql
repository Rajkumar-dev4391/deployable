/*
  # Create feedback table for user testimonials

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `user_name` (text)
      - `user_image` (text, URL to profile image)
      - `message` (text, feedback content)
      - `rating` (integer, 1-5 stars)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `feedback` table
    - Add policy for public read access (for displaying on login page)
    - Add policy for authenticated users to create feedback
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_image text,
  message text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow public read access for displaying feedback on login page
CREATE POLICY "Anyone can read feedback"
  ON feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to create feedback
CREATE POLICY "Authenticated users can create feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert some sample feedback data
INSERT INTO feedback (user_name, user_image, message, rating) VALUES
  ('Sarah Johnson', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 'This AI chatbot has revolutionized how I manage my Google Workspace. The integration is seamless!', 5),
  ('Michael Chen', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 'Amazing tool for productivity. I can create documents, schedule meetings, and manage emails all in one place.', 5),
  ('Emily Rodriguez', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 'The MCP integration is incredible. It understands context and helps me work more efficiently than ever.', 4),
  ('David Kim', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 'Best AI assistant I''ve used. The Google Drive integration alone saves me hours every week.', 5),
  ('Lisa Thompson', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 'Intuitive interface and powerful features. This is the future of workplace productivity tools.', 5);