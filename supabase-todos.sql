-- Tables pour la To-Do List RedPill
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- Table des projets (to-do principale)
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  added_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tâches (sous-tâches d'un projet)
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);

-- RLS pour projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete projects" ON projects FOR DELETE USING (true);

-- RLS pour tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete tasks" ON tasks FOR DELETE USING (true);
