-- Migration: Mystery Surnames table
-- Task: DNA-010, DNA-011, DNA-012

CREATE TABLE IF NOT EXISTS mystery_surnames (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    surname TEXT NOT NULL,
    match_count INTEGER DEFAULT 0,
    total_shared_cm DECIMAL(10,2) DEFAULT 0,
    in_tree BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Each surname is unique per workspace
    UNIQUE(workspace_id, surname)
);

-- Indexes for common queries
CREATE INDEX idx_mystery_surnames_workspace ON mystery_surnames(workspace_id);
CREATE INDEX idx_mystery_surnames_in_tree ON mystery_surnames(workspace_id, in_tree);
CREATE INDEX idx_mystery_surnames_priority ON mystery_surnames(workspace_id, priority);
CREATE INDEX idx_mystery_surnames_total_cm ON mystery_surnames(workspace_id, total_shared_cm DESC);

-- Trigger for updated_at
CREATE TRIGGER update_mystery_surnames_updated_at 
    BEFORE UPDATE ON mystery_surnames
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS policies
ALTER TABLE mystery_surnames ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (adjust based on auth requirements)
CREATE POLICY "Allow all operations on mystery_surnames"
    ON mystery_surnames
    FOR ALL
    USING (true)
    WITH CHECK (true);
