-- ============================================================
-- PERSONAL CRM MONITOR — DATABASE SCHEMA
-- Run this in Supabase SQL Editor (supabase.com > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CONTACTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contacts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  company     TEXT,
  role        TEXT,
  status      TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'active', 'inactive')),
  notes       TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for contacts
CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON contacts(user_id);
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts(status);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts(email);

-- ============================================================
-- INTERACTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS interactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id  UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'other')),
  description TEXT NOT NULL,
  notes       TEXT,
  date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for interactions
CREATE INDEX IF NOT EXISTS interactions_contact_id_idx ON interactions(contact_id);
CREATE INDEX IF NOT EXISTS interactions_user_id_idx ON interactions(user_id);
CREATE INDEX IF NOT EXISTS interactions_date_idx ON interactions(date DESC);

-- ============================================================
-- REMINDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reminders (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id  UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  due_date    TIMESTAMPTZ NOT NULL,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for reminders
CREATE INDEX IF NOT EXISTS reminders_contact_id_idx ON reminders(contact_id);
CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON reminders(user_id);
CREATE INDEX IF NOT EXISTS reminders_due_date_idx ON reminders(due_date ASC);
CREATE INDEX IF NOT EXISTS reminders_completed_idx ON reminders(completed);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only access their own data
-- ============================================================

-- Enable RLS
ALTER TABLE contacts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders    ENABLE ROW LEVEL SECURITY;

-- ---- CONTACTS POLICIES ----
CREATE POLICY "contacts_select" ON contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "contacts_insert" ON contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contacts_update" ON contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "contacts_delete" ON contacts
  FOR DELETE USING (auth.uid() = user_id);

-- ---- INTERACTIONS POLICIES ----
CREATE POLICY "interactions_select" ON interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "interactions_insert" ON interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "interactions_update" ON interactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "interactions_delete" ON interactions
  FOR DELETE USING (auth.uid() = user_id);

-- ---- REMINDERS POLICIES ----
CREATE POLICY "reminders_select" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "reminders_insert" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reminders_update" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reminders_delete" ON reminders
  FOR DELETE USING (auth.uid() = user_id);
