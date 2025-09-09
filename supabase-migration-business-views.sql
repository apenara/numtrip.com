-- Migration: Create business_views table for tracking page views
-- Execute this in Supabase SQL Editor

-- Create the business_views table
CREATE TABLE IF NOT EXISTS public.business_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  viewer_ip INET,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_views_business_id ON public.business_views(business_id);
CREATE INDEX IF NOT EXISTS idx_business_views_viewed_at ON public.business_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_business_views_ip_business ON public.business_views(viewer_ip, business_id);

-- Create a function to get most viewed businesses
CREATE OR REPLACE FUNCTION get_most_viewed_businesses(limit_count INTEGER DEFAULT 10, days_back INTEGER DEFAULT 30)
RETURNS TABLE(
  business_id UUID,
  view_count BIGINT,
  name TEXT,
  category public.business_category,
  city_name TEXT,
  verified BOOLEAN,
  description TEXT,
  address TEXT,
  latest_view TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as business_id,
    COUNT(bv.id) as view_count,
    b.name,
    b.category,
    c.name as city_name,
    COALESCE(b.verified, false) as verified,
    b.description,
    b.address,
    MAX(bv.viewed_at) as latest_view
  FROM public.businesses b
  LEFT JOIN public.business_views bv ON b.id = bv.business_id 
    AND bv.viewed_at >= (NOW() - INTERVAL '%s days', days_back)
  LEFT JOIN public.cities c ON b.city_id = c.id
  WHERE b.verified IS NOT FALSE -- Include verified and null (unknown) businesses
  GROUP BY b.id, b.name, b.category, c.name, b.verified, b.description, b.address
  HAVING COUNT(bv.id) > 0 -- Only businesses with views
  ORDER BY view_count DESC, latest_view DESC
  LIMIT limit_count;
END;
$$;

-- Create a function to safely record a business view (with rate limiting)
CREATE OR REPLACE FUNCTION record_business_view(
  p_business_id UUID,
  p_viewer_ip INET,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  recent_view_count INTEGER;
BEGIN
  -- Check if the same IP has viewed this business in the last hour
  SELECT COUNT(*) INTO recent_view_count
  FROM public.business_views 
  WHERE business_id = p_business_id 
    AND viewer_ip = p_viewer_ip 
    AND viewed_at >= (NOW() - INTERVAL '1 hour');
  
  -- If no recent views from this IP, record the view
  IF recent_view_count = 0 THEN
    INSERT INTO public.business_views (business_id, viewer_ip, user_agent, referrer)
    VALUES (p_business_id, p_viewer_ip, p_user_agent, p_referrer);
    RETURN TRUE;
  END IF;
  
  -- Return false if view was not recorded (rate limited)
  RETURN FALSE;
END;
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.business_views ENABLE ROW LEVEL SECURITY;

-- Create policies for business_views table
CREATE POLICY "Anyone can view business_views" ON public.business_views
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert business_views" ON public.business_views
  FOR INSERT WITH CHECK (true);

-- Only allow delete/update for authenticated users (for potential admin functionality)
CREATE POLICY "Only authenticated users can delete business_views" ON public.business_views
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update business_views" ON public.business_views
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.business_views TO anon;
GRANT ALL ON public.business_views TO authenticated;
GRANT EXECUTE ON FUNCTION get_most_viewed_businesses TO anon;
GRANT EXECUTE ON FUNCTION get_most_viewed_businesses TO authenticated;
GRANT EXECUTE ON FUNCTION record_business_view TO anon;
GRANT EXECUTE ON FUNCTION record_business_view TO authenticated;

-- Create a view for easy access to business view stats
CREATE OR REPLACE VIEW public.business_view_stats AS
SELECT 
  b.id as business_id,
  b.name,
  b.category,
  b.verified,
  COUNT(bv.id) as total_views,
  COUNT(CASE WHEN bv.viewed_at >= (NOW() - INTERVAL '7 days') THEN 1 END) as views_last_7_days,
  COUNT(CASE WHEN bv.viewed_at >= (NOW() - INTERVAL '30 days') THEN 1 END) as views_last_30_days,
  MAX(bv.viewed_at) as last_viewed_at,
  MIN(bv.viewed_at) as first_viewed_at
FROM public.businesses b
LEFT JOIN public.business_views bv ON b.id = bv.business_id
GROUP BY b.id, b.name, b.category, b.verified;

-- Grant access to the view
GRANT SELECT ON public.business_view_stats TO anon;
GRANT SELECT ON public.business_view_stats TO authenticated;

COMMENT ON TABLE public.business_views IS 'Tracks page views for business profiles with rate limiting and analytics';
COMMENT ON FUNCTION get_most_viewed_businesses IS 'Returns most viewed businesses within specified days with view counts';
COMMENT ON FUNCTION record_business_view IS 'Safely records a business view with IP-based rate limiting (1 hour cooldown)';
COMMENT ON VIEW public.business_view_stats IS 'Aggregated view statistics for businesses';