-- Add Workspace Support
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_name TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add workspace_id to people table
ALTER TABLE people ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

-- 3. Add workspace_id to other key tables
ALTER TABLE family_relationships ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE migrations ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE sources ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

-- 4. Create indexes for workspace queries
CREATE INDEX IF NOT EXISTS idx_people_workspace ON people(workspace_id);
CREATE INDEX IF NOT EXISTS idx_family_rel_workspace ON family_relationships(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_workspace ON documents(workspace_id);

-- 5. Create the two initial workspaces
INSERT INTO workspaces (id, name, description, owner_name, is_default)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Johnson Colonial Research', 'Historical Johnson/Johnston families from colonial Virginia (Tony L. Johnson research)', 'Tony L. Johnson', true),
    ('22222222-2222-2222-2222-222222222222', 'Scott Johnson Family', 'Personal family tree for Scott Christopher Johnson', 'Scott Johnson', false);

-- 6. Assign all existing data to the Colonial Research workspace
UPDATE people SET workspace_id = '11111111-1111-1111-1111-111111111111' WHERE workspace_id IS NULL;
UPDATE family_relationships SET workspace_id = '11111111-1111-1111-1111-111111111111' WHERE workspace_id IS NULL;
UPDATE documents SET workspace_id = '11111111-1111-1111-1111-111111111111' WHERE workspace_id IS NULL;
UPDATE migrations SET workspace_id = '11111111-1111-1111-1111-111111111111' WHERE workspace_id IS NULL;
UPDATE sources SET workspace_id = '11111111-1111-1111-1111-111111111111' WHERE workspace_id IS NULL;

-- 7. Enable RLS on workspaces (optional, for future multi-user support)
-- ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Done! You should now have two workspaces.
-- Verify with: SELECT * FROM workspaces;
