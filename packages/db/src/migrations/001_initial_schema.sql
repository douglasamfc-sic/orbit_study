-- Migration 001 — Schema inicial do Orbit Study
-- Hierarquia: Objetivo → Ciclo → Disciplina → Sessão

CREATE TABLE IF NOT EXISTS _migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version INTEGER NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  executada_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS objetivos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  status TEXT DEFAULT 'ativo' CHECK(status IN ('ativo', 'pausado', 'concluido')),
  data_inicio TEXT NOT NULL,
  data_fim TEXT,
  deleted_at TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ciclos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  objetivo_id INTEGER REFERENCES objetivos(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  observacoes TEXT DEFAULT '',
  status TEXT DEFAULT 'ativo' CHECK(status IN ('ativo', 'pausado', 'concluido')),
  modo_planejado INTEGER DEFAULT 0,
  deleted_at TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rodadas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ciclo_id INTEGER REFERENCES ciclos(id) ON DELETE SET NULL,
  numero INTEGER NOT NULL DEFAULT 1,
  status TEXT DEFAULT 'em_andamento' CHECK(status IN ('em_andamento', 'concluida')),
  iniciada_em TEXT NOT NULL DEFAULT (datetime('now')),
  concluida_em TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS disciplinas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cor_hex TEXT DEFAULT '#0079bf',
  objetivo_id INTEGER REFERENCES objetivos(id) ON DELETE SET NULL,
  ordem INTEGER DEFAULT 0,
  deleted_at TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ciclo_disciplina_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ciclo_id INTEGER REFERENCES ciclos(id) ON DELETE SET NULL,
  disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE SET NULL,
  meta_minutos INTEGER DEFAULT 120,
  ordem INTEGER DEFAULT 0,
  UNIQUE(ciclo_id, disciplina_id)
);

CREATE TABLE IF NOT EXISTS sessoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE SET NULL,
  assunto TEXT NOT NULL,
  metodo TEXT NOT NULL CHECK(metodo IN ('pdf', 'video_aula', 'livro', 'exercicios', 'revisao', 'outro')),
  status TEXT DEFAULT 'CONCLUIDA' CHECK(status IN ('PENDENTE', 'CONCLUIDA')),
  data TEXT,
  tempo_liquido INTEGER DEFAULT 0,
  ciclo_id INTEGER REFERENCES ciclos(id) ON DELETE SET NULL,
  objetivo_id INTEGER REFERENCES objetivos(id) ON DELETE SET NULL,
  rodada_id INTEGER REFERENCES rodadas(id) ON DELETE SET NULL,
  material TEXT DEFAULT '',
  observacoes TEXT DEFAULT '',
  pagina_final INTEGER,
  relevancia INTEGER DEFAULT 3 CHECK(relevancia BETWEEN 1 AND 5),
  num_questoes INTEGER,
  num_acertos INTEGER,
  is_aproveitada INTEGER DEFAULT 0,
  sessao_raiz_id INTEGER REFERENCES sessoes(id) ON DELETE SET NULL,
  ordem_pendente INTEGER,
  deleted_at TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS metas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ciclo_id INTEGER NOT NULL UNIQUE REFERENCES ciclos(id) ON DELETE CASCADE,
  segunda REAL DEFAULT 4.0,
  terca REAL DEFAULT 4.0,
  quarta REAL DEFAULT 4.0,
  quinta REAL DEFAULT 4.0,
  sexta REAL DEFAULT 4.0,
  sabado REAL DEFAULT 4.0,
  domingo REAL DEFAULT 2.0
);

CREATE TABLE IF NOT EXISTS ciclo_eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ciclo_id INTEGER REFERENCES ciclos(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  data TEXT NOT NULL DEFAULT (date('now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS sessao_revisoes (
  sessao_revisao_id INTEGER NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
  sessao_original_id INTEGER NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
  PRIMARY KEY (sessao_revisao_id, sessao_original_id)
);

CREATE INDEX IF NOT EXISTS idx_sessoes_data ON sessoes(data);
CREATE INDEX IF NOT EXISTS idx_sessoes_ciclo ON sessoes(ciclo_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_disciplina ON sessoes(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_rodada ON sessoes(rodada_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_deleted ON sessoes(deleted_at);
CREATE INDEX IF NOT EXISTS idx_objetivos_deleted ON objetivos(deleted_at);
CREATE INDEX IF NOT EXISTS idx_ciclos_deleted ON ciclos(deleted_at);
