-- ============================================================================
-- COURSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT,
    semester VARCHAR(50),
    instructor VARCHAR(255),
    credits INTEGER CHECK (credits > 0 AND credits <= 12),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    category VARCHAR(20) NOT NULL CHECK (category IN ('Midterm', 'Final', 'Others')),
    title VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    uploader_id UUID NOT NULL,
    download_count INTEGER DEFAULT 0 CHECK (download_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- DOWNLOAD TRACKING TABLE (Optional - for analytics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ADMIN ACTIVITY LOG (Optional - for audit trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
-- Courses indexes
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);

-- Files indexes
CREATE INDEX IF NOT EXISTS idx_files_course_id ON files(course_id);
CREATE INDEX IF NOT EXISTS idx_files_category ON files(category);
CREATE INDEX IF NOT EXISTS idx_files_uploader_id ON files(uploader_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_download_count ON files(download_count DESC);

-- Downloads indexes
CREATE INDEX IF NOT EXISTS idx_downloads_file_id ON downloads(file_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON downloads(downloaded_at DESC);

-- Admin activity indexes
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity(created_at DESC);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - COURSES TABLE
-- ============================================================================

-- Everyone can view courses (public access)
DROP POLICY IF EXISTS "Public courses are viewable by everyone" ON courses;
CREATE POLICY "Anyone can view courses"
    ON courses FOR SELECT
    USING (true);

-- Only authenticated admins can insert courses
DROP POLICY IF EXISTS "Authenticated users can insert courses" ON courses;
CREATE POLICY "Authenticated users can insert courses"
    ON courses FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Only authenticated admins can update courses
CREATE POLICY "Authenticated users can update courses"
    ON courses FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Only authenticated admins can delete courses
CREATE POLICY "Authenticated users can delete courses"
    ON courses FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- RLS POLICIES - FILES TABLE
-- ============================================================================

-- Everyone can view files (public access)
DROP POLICY IF EXISTS "Public files are viewable by everyone" ON files;
CREATE POLICY "Anyone can view files"
    ON files FOR SELECT
    USING (true);

-- Only authenticated admins can insert files
DROP POLICY IF EXISTS "Authenticated users can insert files" ON files;
CREATE POLICY "Authenticated users can insert files"
    ON files FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Only authenticated admins can update files
CREATE POLICY "Authenticated users can update files"
    ON files FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Only authenticated admins can delete files
CREATE POLICY "Authenticated users can delete files"
    ON files FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- RLS POLICIES - DOWNLOADS TABLE
-- ============================================================================

-- Everyone can insert downloads (tracking)
CREATE POLICY "Anyone can record downloads"
    ON downloads FOR INSERT
    WITH CHECK (true);

-- Only authenticated admins can view download stats
CREATE POLICY "Authenticated users can view downloads"
    ON downloads FOR SELECT
    TO authenticated
    USING (true);

-- Only authenticated admins can delete download records
CREATE POLICY "Authenticated users can delete downloads"
    ON downloads FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- RLS POLICIES - ADMIN ACTIVITY TABLE
-- ============================================================================

-- Only authenticated admins can insert activity logs
CREATE POLICY "Authenticated users can insert activity"
    ON admin_activity FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = admin_id);

-- Only authenticated admins can view activity logs
CREATE POLICY "Authenticated users can view activity"
    ON admin_activity FOR SELECT
    TO authenticated
    USING (true);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for courses table
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for files table
DROP TRIGGER IF EXISTS update_files_updated_at ON files;
CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE files 
    SET download_count = download_count + 1 
    WHERE id = NEW.file_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment download count
DROP TRIGGER IF EXISTS auto_increment_download ON downloads;
CREATE TRIGGER auto_increment_download
    AFTER INSERT ON downloads
    FOR EACH ROW
    EXECUTE FUNCTION increment_download_count();

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO admin_activity (admin_id, action, entity_type, entity_id, details)
        VALUES (
            auth.uid(),
            'CREATE',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO admin_activity (admin_id, action, entity_type, entity_id, details)
        VALUES (
            auth.uid(),
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO admin_activity (admin_id, action, entity_type, entity_id, details)
        VALUES (
            auth.uid(),
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            row_to_json(OLD)
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for activity logging (optional - comment out if not needed)
-- DROP TRIGGER IF EXISTS log_courses_activity ON courses;
-- CREATE TRIGGER log_courses_activity
--     AFTER INSERT OR UPDATE OR DELETE ON courses
--     FOR EACH ROW
--     EXECUTE FUNCTION log_admin_activity();

-- DROP TRIGGER IF EXISTS log_files_activity ON files;
-- CREATE TRIGGER log_files_activity
--     AFTER INSERT OR UPDATE OR DELETE ON files
--     FOR EACH ROW
--     EXECUTE FUNCTION log_admin_activity();

-- Insert all courses
INSERT INTO courses (code, name, department) VALUES
    -- Computer Science Core Courses
    ('CSC 1101', 'Introduction to Computer Studies', 'COMPUTER SCIENCE'),
    ('CSC 1102', 'Introduction to Programming Language', 'COMPUTER SCIENCE'),
    ('CSC 1103', 'Introduction to Programming Language Lab', 'COMPUTER SCIENCE'),
    ('CSC 1204', 'Discrete Mathematics', 'COMPUTER SCIENCE'),
    ('CSC 1205', 'Object Oriented Programming 1', 'COMPUTER SCIENCE'),
    ('CSC 2106', 'Data Structure', 'COMPUTER SCIENCE'),
    ('CSC 2107', 'Data Structure Lab', 'COMPUTER SCIENCE'),
    ('CSC 2108', 'Introduction to Database', 'COMPUTER SCIENCE'),
    ('CSC 2209', 'Object Oriented Analysis and Design', 'COMPUTER SCIENCE'),
    ('CSC 2210', 'Object Oriented Programming 2', 'COMPUTER SCIENCE'),
    ('CSC 2211', 'Algorithms', 'COMPUTER SCIENCE'),
    ('CSC 3112', 'Software Engineering', 'COMPUTER SCIENCE'),
    ('CSC 3113', 'Theory of Computation', 'COMPUTER SCIENCE'),
    ('CSC 3214', 'Operating Systems', 'COMPUTER SCIENCE'),
    ('CSC 3215', 'Web Technologies', 'COMPUTER SCIENCE'),
    ('CSC 3216', 'Compiler Design', 'COMPUTER SCIENCE'),
    ('CSC 3217', 'Artificial Intelligence and Expert System', 'COMPUTER SCIENCE'),
    ('CSC 4118', 'Computer Graphics', 'COMPUTER SCIENCE'),
    
    -- Computer Science Advanced & Electives
    ('CSC 4125', 'Computer Science Mathematics', 'COMPUTER SCIENCE'),
    ('CSC 4126', 'Basic Graph Theory', 'COMPUTER SCIENCE'),
    ('CSC 4127', 'Advanced Algorithm Techniques', 'COMPUTER SCIENCE'),
    ('CSC 4128', 'Linear Programming', 'COMPUTER SCIENCE'),
    ('CSC 4144', 'Multimedia Systems', 'COMPUTER SCIENCE'),
    ('CSC 4160', 'Software Requirement Engineering', 'COMPUTER SCIENCE'),
    ('CSC 4180', 'Introduction to Data Science', 'COMPUTER SCIENCE'),
    ('CSC 4181', 'Advance Database Management Systems', 'COMPUTER SCIENCE'),
    ('CSC 4182', 'Human Computer Interaction', 'COMPUTER SCIENCE'),
    ('CSC 4183', 'Cyber Laws & Information Security', 'COMPUTER SCIENCE'),
    ('CSC 4197', 'Research Methodology', 'COMPUTER SCIENCE'),
    ('CSC 4230', 'Bioinformatics', 'COMPUTER SCIENCE'),
    ('CSC 4231', 'Parallel Computing', 'COMPUTER SCIENCE'),
    ('CSC 4232', 'Machine Learning', 'COMPUTER SCIENCE'),
    ('CSC 4233', 'Natural Language Processing', 'COMPUTER SCIENCE'),
    ('CSC 4251', 'Image Processing', 'COMPUTER SCIENCE'),
    ('CSC 4254', 'Computer Vision & Pattern Recognition', 'COMPUTER SCIENCE'),
    ('CSC 4261', 'Advanced Programming in Web Technologies', 'COMPUTER SCIENCE'),
    ('CSC 4262', 'Programming in Python', 'COMPUTER SCIENCE'),
    ('CSC 4263', 'Advanced Programming with JAVA', 'COMPUTER SCIENCE'),
    ('CSC 4264', 'Advanced Programming with .NET', 'COMPUTER SCIENCE'),
    ('CSC 4270', 'Software Development Project Management', 'COMPUTER SCIENCE'),
    ('CSC 4271', 'Software Quality and Testing', 'COMPUTER SCIENCE'),
    ('CSC 4272', 'Mobile Application Development', 'COMPUTER SCIENCE'),
    ('CSC 4273', 'Software Architecture & Design Patterns', 'COMPUTER SCIENCE'),
    ('CSC 4285', 'Data Warehouse and Data Mining', 'COMPUTER SCIENCE'),
    ('CSC 4298', 'Thesis/Project', 'COMPUTER SCIENCE'),
    ('CSC 4299', 'Internship', 'COMPUTER SCIENCE'),
    
    -- Electrical & Electronics Engineering
    ('EEE 2101', 'Basic Mechanical Engineering', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 2103', 'Electronic Devices', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 2104', 'Electronic Devices Lab', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 2108', 'Introduction to Electrical Circuits', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 2109', 'Introduction to Electrical Circuits Lab', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 2213', 'Signals and Linear Systems', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 2216', 'Engineering Ethics', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 3101', 'Digital Logic and Circuits', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 3102', 'Digital Logic and Circuits Lab', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 3103', 'Digital Signal Processing (DSP)', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 4209', 'Telecommunications Engineering', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 4217', 'VLSI Circuit Design', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 4233', 'Digital Design with System Verilog, VHDL & FPGAs', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    ('EEE 4241', 'Industrial Electronics, Drives & Instrumentation', 'ELECTRICAL & ELECTRONICS ENGINEERING'),
    
    -- Computer Engineering
    ('COE 3101', 'Data Communication', 'COMPUTER ENGINEERING'),
    ('COE 3102', 'Microprocessor and Embedded Systems', 'COMPUTER ENGINEERING'),
    ('COE 3203', 'Computer Organization & Architecture', 'COMPUTER ENGINEERING'),
    ('COE 3204', 'Computer Networks', 'COMPUTER ENGINEERING'),
    ('COE 4140', 'Advanced Operating Systems', 'COMPUTER ENGINEERING'),
    ('COE 4141', 'Advanced Computer Networks', 'COMPUTER ENGINEERING'),
    ('COE 4142', 'Network Resource Management & Organization', 'COMPUTER ENGINEERING'),
    ('COE 4143', 'Digital System Design', 'COMPUTER ENGINEERING'),
    ('COE 4250', 'Simulation and Modelling', 'COMPUTER ENGINEERING'),
    ('COE 4252', 'Network Security', 'COMPUTER ENGINEERING'),
    ('COE 4253', 'Wireless Sensor Network', 'COMPUTER ENGINEERING'),
    ('COE 4255', 'Robotics Engineering', 'COMPUTER ENGINEERING'),
    
    -- Mathematics
    ('MAT 1102', 'Differential Calculus and Coordinate Geometry', 'MATHEMATICS'),
    ('MAT 1205', 'Integral Calculus and Ordinary Differential Equations', 'MATHEMATICS'),
    ('MAT 2101', 'Complex Variables, Laplace and Z-transformations', 'MATHEMATICS'),
    ('MAT 2202', 'Matrices, Vectors and Fourier Analysis', 'MATHEMATICS'),
    ('MAT 3101', 'Numerical Methods for Science and Engineering', 'MATHEMATICS'),
    ('MAT 3103', 'Computational Statistics and Probability', 'MATHEMATICS'),
    
    -- Physics
    ('PHY 1101', 'Physics-1', 'PHYSICS'),
    ('PHY 1102', 'Physics 1 Lab', 'PHYSICS'),
    ('PHY 1203', 'Physics 2', 'PHYSICS'),
    ('PHY 1204', 'Physics 2 Lab', 'PHYSICS'),
    
    -- Chemistry
    ('CHEM 1101', 'Chemistry', 'CHEMISTRY'),
    
    -- English
    ('ENG 1101', 'English Reading Skills and Public Speaking', 'ENGLISH'),
    ('ENG 1202', 'English Writing Skills and Communication', 'ENGLISH'),
    ('ENG 2103', 'Business Communication', 'ENGLISH'),
    
    -- Business & Management
    ('BBA 1102', 'Principles of Accounting', 'BUSINESS ADMINISTRATION'),
    ('MGT 3202', 'Engineering Management', 'MANAGEMENT'),
    ('ECO 3150', 'Principles of Economics', 'ECONOMICS'),
    ('BAS 2101', 'Bangladesh Studies', 'GENERAL'),
    ('BAE 2101', 'Computer Aided Design & Drafting Lab', 'ENGINEERING'),
    
    -- Management Information Systems
    ('MIS 3101', 'Management Information Systems', 'MANAGEMENT INFORMATION SYSTEMS'),
    ('MIS 4007', 'Digital Marketing', 'MANAGEMENT INFORMATION SYSTEMS'),
    ('MIS 4011', 'Enterprise Resource Planning', 'MANAGEMENT INFORMATION SYSTEMS'),
    ('MIS 4012', 'E-Commerce, E-Governance & E-Series', 'MANAGEMENT INFORMATION SYSTEMS'),
    ('MIS 4014', 'Business Intelligence and Decision Support System', 'MANAGEMENT INFORMATION SYSTEMS')
ON CONFLICT DO NOTHING;
