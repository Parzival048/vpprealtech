-- VPP Realtech Supabase Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    price_range VARCHAR(255),
    developer VARCHAR(255),
    rera_id VARCHAR(100),
    possession VARCHAR(100),
    configurations TEXT[] DEFAULT '{}',
    sizes VARCHAR(255),
    amenities TEXT[] DEFAULT '{}',
    overview TEXT,
    highlights TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    budget_category VARCHAR(50),
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(100),
    author VARCHAR(255) DEFAULT 'VPP Realtech',
    featured_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    source_link TEXT,
    reading_time INTEGER DEFAULT 1,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    project_id UUID REFERENCES projects(id),
    project_name VARCHAR(255),
    message TEXT,
    source VARCHAR(100) DEFAULT 'website',
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published projects
CREATE POLICY "Public can view published projects" ON projects
    FOR SELECT USING (published = true);

-- Policy: Authenticated users can do anything with projects
CREATE POLICY "Authenticated users can manage projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy: Anyone can read published blogs
CREATE POLICY "Public can view published blogs" ON blogs
    FOR SELECT USING (published = true);

-- Policy: Authenticated users can do anything with blogs
CREATE POLICY "Authenticated users can manage blogs" ON blogs
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy: Anyone can insert leads (contact forms)
CREATE POLICY "Anyone can submit leads" ON leads
    FOR INSERT WITH CHECK (true);

-- Policy: Authenticated users can view/manage leads
CREATE POLICY "Authenticated users can manage leads" ON leads
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy: Anyone can insert contact messages
CREATE POLICY "Anyone can submit contact messages" ON contacts
    FOR INSERT WITH CHECK (true);

-- Policy: Authenticated users can view/manage contacts
CREATE POLICY "Authenticated users can manage contacts" ON contacts
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert Sample Projects
INSERT INTO projects (slug, title, location, address, type, status, price_range, developer, rera_id, possession, configurations, sizes, amenities, overview, highlights, images, published, featured, budget_category) VALUES
('skyline-towers', 'Skyline Towers', 'Baner', 'Survey No. 45, Near Balewadi High Street, Baner, Pune 411045', 'Residential', 'ongoing', '₹85 Lakhs - ₹1.5 Crore', 'Premium Developers', 'P52100034567', 'December 2025', ARRAY['2 BHK', '3 BHK', '4 BHK'], '850 - 2200 sq.ft.', ARRAY['Swimming Pool', 'Gym', 'Clubhouse', 'Children Play Area', 'Jogging Track', '24x7 Security'], 'Skyline Towers is a premium residential project located in the heart of Baner.', ARRAY['Prime location in Baner', 'Vastu-compliant floor plans', 'Premium specifications'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'], true, true, '1cr-2cr'),
('tech-park-plaza', 'Tech Park Plaza', 'Hinjewadi', 'Hinjewadi Phase 1, Near Infosys Campus, Pune 411057', 'Commercial', 'ready', '₹1.2 Crore - ₹3.5 Crore', 'Vista Corp', 'P52100045678', 'Ready to Move', ARRAY['Office Spaces', 'Retail Shops', 'Showrooms'], '500 - 5000 sq.ft.', ARRAY['High-speed Elevators', 'Central AC', 'Power Backup', 'Ample Parking'], 'Tech Park Plaza is a Grade A commercial development in the IT corridor of Hinjewadi.', ARRAY['Located in Pune IT hub', 'Modern architecture', 'Flexible floor plates'], ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'], true, true, '2cr-5cr'),
('green-valley-villas', 'Green Valley Villas', 'Kharadi', 'Near EON IT Park, Kharadi, Pune 411014', 'Residential', 'upcoming', '₹2.5 Crore - ₹4 Crore', 'Greenscape Homes', 'P52100056789', 'June 2027', ARRAY['4 BHK Villa', '5 BHK Villa'], '3500 - 5500 sq.ft.', ARRAY['Private Garden', 'Swimming Pool', 'Clubhouse', 'Tennis Court'], 'Green Valley Villas offers luxurious independent villas in Kharadi.', ARRAY['Independent luxury villas', 'Private gardens', 'Smart home features'], ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'], true, true, '2cr-5cr');

-- Create Storage Bucket for Images (run this in SQL or use the Supabase dashboard)
-- Note: This should be done via the Supabase Dashboard -> Storage -> Create Bucket
-- Bucket name: images
-- Make it public for read access
