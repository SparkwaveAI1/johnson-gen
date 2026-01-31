-- Import family relationships for direct ancestors

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1968-WQ19', 'JOHN-ANC-1938-MHPY', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1938-MHPY', 'JOHN-ANC-1968-WQ19', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1968-WQ19', 'JOHN-ANC-1945-EWCN', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1945-EWCN', 'JOHN-ANC-1968-WQ19', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1938-MHPY', 'JOHN-ANC-1897-X18S', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1897-X18S', 'JOHN-ANC-1938-MHPY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1938-MHPY', 'JOHN-ANC-1909-2ZZJ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1909-2ZZJ', 'JOHN-ANC-1938-MHPY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1945-EWCN', 'SCHO-ANC-1913-A224', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1913-A224', 'JOHN-ANC-1945-EWCN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1945-EWCN', 'WORS-ANC-1911-WGJL', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WORS-ANC-1911-WGJL', 'JOHN-ANC-1945-EWCN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1897-X18S', 'JOHN-ANC-1872-73C7', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1872-73C7', 'JOHN-ANC-1897-X18S', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1897-X18S', 'JONE-ANC-1880-TF3A', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1880-TF3A', 'JOHN-ANC-1897-X18S', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1909-2ZZJ', 'ZACH-ANC-1873-H0TB', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ZACH-ANC-1873-H0TB', 'JOHN-ANC-1909-2ZZJ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1909-2ZZJ', 'REID-ANC-1881-CDW2', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REID-ANC-1881-CDW2', 'JOHN-ANC-1909-2ZZJ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1913-A224', 'SCHO-ANC-1880-H3EC', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1880-H3EC', 'SCHO-ANC-1913-A224', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1913-A224', 'POSN-ANC-1874-BRV1', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('POSN-ANC-1874-BRV1', 'SCHO-ANC-1913-A224', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WORS-ANC-1911-WGJL', 'SWAN-ANC-1886-HXS4', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1886-HXS4', 'WORS-ANC-1911-WGJL', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WORS-ANC-1911-WGJL', 'SWAN-ANC-1887-77LR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1887-77LR', 'WORS-ANC-1911-WGJL', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1872-73C7', 'JOHN-ANC-1852-ZQE9', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1852-ZQE9', 'JOHN-ANC-1872-73C7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1872-73C7', 'JOHN-ANC-1853-WU2J', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1853-WU2J', 'JOHN-ANC-1872-73C7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1880-TF3A', 'JANE-ANC-1853-TOJK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JANE-ANC-1853-TOJK', 'JONE-ANC-1880-TF3A', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1880-TF3A', 'WINN-ANC-1857-JIAE', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINN-ANC-1857-JIAE', 'JONE-ANC-1880-TF3A', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ZACH-ANC-1873-H0TB', 'OLSS-ANC-1828-KR0Q', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLSS-ANC-1828-KR0Q', 'ZACH-ANC-1873-H0TB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ZACH-ANC-1873-H0TB', 'JONA-ANC-1831-PPQW', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONA-ANC-1831-PPQW', 'ZACH-ANC-1873-H0TB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REID-ANC-1881-CDW2', 'REED-ANC-1846-HTU2', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REED-ANC-1846-HTU2', 'REID-ANC-1881-CDW2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REID-ANC-1881-CDW2', 'ROUL-ANC-1857-G5T3', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROUL-ANC-1857-G5T3', 'REID-ANC-1881-CDW2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1880-H3EC', 'SCHO-ANC-1856-51O3', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1856-51O3', 'SCHO-ANC-1880-H3EC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1880-H3EC', 'GERS-ANC-1855-ZTJQ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GERS-ANC-1855-ZTJQ', 'SCHO-ANC-1880-H3EC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('POSN-ANC-1874-BRV1', 'PRIE-ANC-1841-650O', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PRIE-ANC-1841-650O', 'POSN-ANC-1874-BRV1', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('POSN-ANC-1874-BRV1', 'PRIE-ANC-1849-WHJO', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PRIE-ANC-1849-WHJO', 'POSN-ANC-1874-BRV1', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1886-HXS4', 'SWAN-ANC-1843-PG2B', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1843-PG2B', 'SWAN-ANC-1886-HXS4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1886-HXS4', 'SWAN-ANC-1853-IN3Y', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1853-IN3Y', 'SWAN-ANC-1886-HXS4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1887-77LR', 'MYER-ANC-1854-IWS9', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MYER-ANC-1854-IWS9', 'SWAN-ANC-1887-77LR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1887-77LR', 'KROO-ANC-1867-MZYZ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1867-MZYZ', 'SWAN-ANC-1887-77LR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1852-ZQE9', 'LOON-ANC-1803-5KJD', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1803-5KJD', 'JOHN-ANC-1852-ZQE9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1853-WU2J', 'CART-ANC-1823-F1E7', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1823-F1E7', 'JOHN-ANC-1853-WU2J', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1853-WU2J', 'DERR-ANC-1825-BQ9Q', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERR-ANC-1825-BQ9Q', 'JOHN-ANC-1853-WU2J', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JANE-ANC-1853-TOJK', 'JONE-ANC-1817-WXBC', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1817-WXBC', 'JANE-ANC-1853-TOJK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JANE-ANC-1853-TOJK', 'LANG-ANC-1823-5X2T', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1823-5X2T', 'JANE-ANC-1853-TOJK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINN-ANC-1857-JIAE', 'WINE-ANC-1804-F2II', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1804-F2II', 'WINN-ANC-1857-JIAE', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINN-ANC-1857-JIAE', 'BEAN-ANC-1818-N9IQ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BEAN-ANC-1818-N9IQ', 'WINN-ANC-1857-JIAE', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLSS-ANC-1828-KR0Q', 'ZACH-ANC-1785-HOJP', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ZACH-ANC-1785-HOJP', 'OLSS-ANC-1828-KR0Q', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLSS-ANC-1828-KR0Q', 'JANS-ANC-UNK-P9N6', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JANS-ANC-UNK-P9N6', 'OLSS-ANC-1828-KR0Q', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONA-ANC-1831-PPQW', 'JONS-ANC-1789-1QEG', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1789-1QEG', 'JONA-ANC-1831-PPQW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONA-ANC-1831-PPQW', 'GUST-ANC-1789-IJBT', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUST-ANC-1789-IJBT', 'JONA-ANC-1831-PPQW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REED-ANC-1846-HTU2', 'REED-ANC-1820-SIGZ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REED-ANC-1820-SIGZ', 'REED-ANC-1846-HTU2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REED-ANC-1846-HTU2', 'UNK-ANC-1821-YEBR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1821-YEBR', 'REED-ANC-1846-HTU2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROUL-ANC-1857-G5T3', 'ROLO-ANC-1829-1VZK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROLO-ANC-1829-1VZK', 'ROUL-ANC-1857-G5T3', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROUL-ANC-1857-G5T3', 'CURT-ANC-1835-KM82', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CURT-ANC-1835-KM82', 'ROUL-ANC-1857-G5T3', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1856-51O3', 'SZEJ-ANC-1837-XGCC', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1837-XGCC', 'SCHO-ANC-1856-51O3', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1856-51O3', 'ROZE-ANC-1837-8Y8W', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROZE-ANC-1837-8Y8W', 'SCHO-ANC-1856-51O3', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PRIE-ANC-1841-650O', 'KOHA-ANC-1820-FOXA', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KOHA-ANC-1820-FOXA', 'PRIE-ANC-1841-650O', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PRIE-ANC-1849-WHJO', 'CUMM-ANC-1824-VZA7', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CUMM-ANC-1824-VZA7', 'PRIE-ANC-1849-WHJO', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PRIE-ANC-1849-WHJO', 'UNK-ANC-1826-2PJH', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1826-2PJH', 'PRIE-ANC-1849-WHJO', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1843-PG2B', 'PEHR-ANC-1829-5GK4', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1829-5GK4', 'SWAN-ANC-1843-PG2B', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1843-PG2B', 'LARS-ANC-1817-HSJR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1817-HSJR', 'SWAN-ANC-1843-PG2B', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1853-IN3Y', 'ANDE-ANC-1825-4PXN', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1825-4PXN', 'SWAN-ANC-1853-IN3Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1853-IN3Y', 'ANDE-ANC-1834-RBGQ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1834-RBGQ', 'SWAN-ANC-1853-IN3Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MYER-ANC-1854-IWS9', 'MEYR-ANC-1819-6YSK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYR-ANC-1819-6YSK', 'MYER-ANC-1854-IWS9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MYER-ANC-1854-IWS9', 'GEUT-ANC-1824-TT16', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1824-TT16', 'MYER-ANC-1854-IWS9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1867-MZYZ', 'KNOS-ANC-1830-94AH', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNOS-ANC-1830-94AH', 'KROO-ANC-1867-MZYZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1867-MZYZ', 'KNOS-ANC-1844-2R7U', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNOS-ANC-1844-2R7U', 'KROO-ANC-1867-MZYZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1803-5KJD', 'LOON-ANC-1785-DQX7', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1785-DQX7', 'LOON-ANC-1803-5KJD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1803-5KJD', 'BROW-ANC-1785-M9RW', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1785-M9RW', 'LOON-ANC-1803-5KJD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1823-F1E7', 'CART-ANC-1787-J897', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1787-J897', 'CART-ANC-1823-F1E7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1823-F1E7', 'CATE-ANC-1800-04AN', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1800-04AN', 'CART-ANC-1823-F1E7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERR-ANC-1825-BQ9Q', 'DERR-ANC-1783-IS3D', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERR-ANC-1783-IS3D', 'DERR-ANC-1825-BQ9Q', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERR-ANC-1825-BQ9Q', 'WINS-ANC-1789-BL09', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINS-ANC-1789-BL09', 'DERR-ANC-1825-BQ9Q', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1817-WXBC', 'JONE-ANC-1793-4DQZ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1793-4DQZ', 'JONE-ANC-1817-WXBC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1817-WXBC', 'KLEP-ANC-1801-JC3T', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1801-JC3T', 'JONE-ANC-1817-WXBC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1823-5X2T', 'LANG-ANC-1789-EV2X', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1789-EV2X', 'LANG-ANC-1823-5X2T', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1804-F2II', 'WINE-ANC-1782-4G8Y', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1782-4G8Y', 'WINE-ANC-1804-F2II', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1804-F2II', 'SHLU-ANC-1780-XL4Y', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHLU-ANC-1780-XL4Y', 'WINE-ANC-1804-F2II', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BEAN-ANC-1818-N9IQ', 'MYER-ANC-1800-KXHF', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MYER-ANC-1800-KXHF', 'BEAN-ANC-1818-N9IQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BEAN-ANC-1818-N9IQ', 'SMIT-ANC-1798-9244', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SMIT-ANC-1798-9244', 'BEAN-ANC-1818-N9IQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ZACH-ANC-1785-HOJP', 'SEGO-ANC-1734-5369', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1734-5369', 'ZACH-ANC-1785-HOJP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ZACH-ANC-1785-HOJP', 'ANDE-ANC-1744-DR3X', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1744-DR3X', 'ZACH-ANC-1785-HOJP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1789-1QEG', 'ANDE-ANC-1758-QL14', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1758-QL14', 'JONS-ANC-1789-1QEG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1789-1QEG', 'SEGO-ANC-1762-PR0D', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1762-PR0D', 'JONS-ANC-1789-1QEG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUST-ANC-1789-IJBT', 'NILS-ANC-1744-0TBC', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NILS-ANC-1744-0TBC', 'GUST-ANC-1789-IJBT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUST-ANC-1789-IJBT', 'ERSD-ANC-UNK-ZUTP', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ERSD-ANC-UNK-ZUTP', 'GUST-ANC-1789-IJBT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROLO-ANC-1829-1VZK', 'SAUV-ANC-1791-4AYE', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1791-4AYE', 'ROLO-ANC-1829-1VZK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROLO-ANC-1829-1VZK', 'LABR-ANC-1802-JOSM', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABR-ANC-1802-JOSM', 'ROLO-ANC-1829-1VZK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CURT-ANC-1835-KM82', 'EMER-ANC-1752-W5KY', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1752-W5KY', 'CURT-ANC-1835-KM82', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1837-XGCC', 'SZEJ-ANC-1812-6DZT', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1812-6DZT', 'SZEJ-ANC-1837-XGCC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1837-XGCC', 'SZE-ANC-1820-L072', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZE-ANC-1820-L072', 'SZEJ-ANC-1837-XGCC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROZE-ANC-1837-8Y8W', 'ROZE-ANC-1820-FN43', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROZE-ANC-1820-FN43', 'ROZE-ANC-1837-8Y8W', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROZE-ANC-1837-8Y8W', 'UNK-ANC-1820-6DB3', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1820-6DB3', 'ROZE-ANC-1837-8Y8W', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1829-5GK4', 'SWEN-ANC-1768-C7O2', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWEN-ANC-1768-C7O2', 'PEHR-ANC-1829-5GK4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1829-5GK4', 'PETT-ANC-1799-JUKI', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PETT-ANC-1799-JUKI', 'PEHR-ANC-1829-5GK4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1817-HSJR', 'BENG-ANC-1785-DVOW', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BENG-ANC-1785-DVOW', 'LARS-ANC-1817-HSJR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1817-HSJR', 'PEHR-ANC-1785-8PAM', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1785-8PAM', 'LARS-ANC-1817-HSJR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1825-4PXN', 'ANDE-ANC-1796-KBHP', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1796-KBHP', 'ANDE-ANC-1825-4PXN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1825-4PXN', 'JOHA-ANC-1805-3RO0', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHA-ANC-1805-3RO0', 'ANDE-ANC-1825-4PXN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1834-RBGQ', 'LARS-ANC-1811-GS79', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1811-GS79', 'ANDE-ANC-1834-RBGQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1834-RBGQ', 'LARS-ANC-1803-E6HR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1803-E6HR', 'ANDE-ANC-1834-RBGQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYR-ANC-1819-6YSK', 'MEYE-ANC-1791-HN7U', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYE-ANC-1791-HN7U', 'MEYR-ANC-1819-6YSK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYR-ANC-1819-6YSK', 'BARR-ANC-1795-MDAJ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BARR-ANC-1795-MDAJ', 'MEYR-ANC-1819-6YSK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1824-TT16', 'GEUT-ANC-1790-O3RR', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1790-O3RR', 'GEUT-ANC-1824-TT16', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1824-TT16', 'KNAU-ANC-1795-EQMG', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNAU-ANC-1795-EQMG', 'GEUT-ANC-1824-TT16', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNOS-ANC-1830-94AH', 'KROO-ANC-1795-LPRH', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1795-LPRH', 'KNOS-ANC-1830-94AH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNOS-ANC-1830-94AH', 'KROS-ANC-1820-377W', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROS-ANC-1820-377W', 'KNOS-ANC-1830-94AH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNOS-ANC-1844-2R7U', 'WEIC-ANC-1820-EZD6', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIC-ANC-1820-EZD6', 'KNOS-ANC-1844-2R7U', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1785-DQX7', 'LOON-ANC-1751-QGIK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1751-QGIK', 'LOON-ANC-1785-DQX7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1785-DQX7', 'LOON-ANC-1755-JRXR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1755-JRXR', 'LOON-ANC-1785-DQX7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1785-M9RW', 'BROW-ANC-1750-18KE', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1750-18KE', 'BROW-ANC-1785-M9RW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1785-M9RW', 'FEAM-ANC-1757-796U', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FEAM-ANC-1757-796U', 'BROW-ANC-1785-M9RW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1787-J897', 'CART-ANC-1755-ULYP', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1755-ULYP', 'CART-ANC-1787-J897', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1787-J897', 'ALLE-ANC-1764-2CC2', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALLE-ANC-1764-2CC2', 'CART-ANC-1787-J897', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1800-04AN', 'CATE-ANC-1768-CP76', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1768-CP76', 'CATE-ANC-1800-04AN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1800-04AN', 'ENYA-ANC-1762-0MTF', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYA-ANC-1762-0MTF', 'CATE-ANC-1800-04AN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERR-ANC-1783-IS3D', 'DERK-ANC-1740-XCZY', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERK-ANC-1740-XCZY', 'DERR-ANC-1783-IS3D', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERR-ANC-1783-IS3D', 'DUNK-ANC-1742-FX9H', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1742-FX9H', 'DERR-ANC-1783-IS3D', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1793-4DQZ', 'JONE-ANC-1770-NAP4', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1770-NAP4', 'JONE-ANC-1793-4DQZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1793-4DQZ', 'JONE-ANC-1772-2ETV', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1772-2ETV', 'JONE-ANC-1793-4DQZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1801-JC3T', 'KLEP-ANC-1771-F721', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1771-F721', 'KLEP-ANC-1801-JC3T', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1801-JC3T', 'GILL-ANC-1771-U618', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1771-U618', 'KLEP-ANC-1801-JC3T', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1789-EV2X', 'LANG-ANC-1761-PJD6', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1761-PJD6', 'LANG-ANC-1789-EV2X', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1789-EV2X', 'EPPE-ANC-1770-0HH6', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1770-0HH6', 'LANG-ANC-1789-EV2X', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1782-4G8Y', 'WINE-ANC-1745-EAOA', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1745-EAOA', 'WINE-ANC-1782-4G8Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1782-4G8Y', 'DUNK-ANC-1740-8YTX', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1740-8YTX', 'WINE-ANC-1782-4G8Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHLU-ANC-1780-XL4Y', 'SCHL-ANC-1750-2VGV', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1750-2VGV', 'SHLU-ANC-1780-XL4Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHLU-ANC-1780-XL4Y', 'JOHN-ANC-1762-M7TY', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1762-M7TY', 'SHLU-ANC-1780-XL4Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MYER-ANC-1800-KXHF', 'MARI-ANC-1759-4NNR', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARI-ANC-1759-4NNR', 'MYER-ANC-1800-KXHF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MYER-ANC-1800-KXHF', 'PELL-ANC-1761-0489', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PELL-ANC-1761-0489', 'MYER-ANC-1800-KXHF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SMIT-ANC-1798-9244', 'SMIT-ANC-1768-HNDA', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SMIT-ANC-1768-HNDA', 'SMIT-ANC-1798-9244', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SMIT-ANC-1798-9244', 'LOUD-ANC-1772-KM5K', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOUD-ANC-1772-KM5K', 'SMIT-ANC-1798-9244', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1734-5369', 'OLSS-ANC-1690-B6CF', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLSS-ANC-1690-B6CF', 'SEGO-ANC-1734-5369', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1734-5369', 'BORJ-ANC-1700-3VFF', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BORJ-ANC-1700-3VFF', 'SEGO-ANC-1734-5369', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1744-DR3X', 'SEGO-ANC-1703-W4EX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1703-W4EX', 'ANDE-ANC-1744-DR3X', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1744-DR3X', 'TORE-ANC-1714-X6VL', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TORE-ANC-1714-X6VL', 'ANDE-ANC-1744-DR3X', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1758-QL14', 'ANDE-ANC-1721-555U', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1721-555U', 'ANDE-ANC-1758-QL14', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1758-QL14', 'BRJ-ANC-1729-UZZR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRJ-ANC-1729-UZZR', 'ANDE-ANC-1758-QL14', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1762-PR0D', 'PEHR-ANC-1726-4D4Y', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1726-4D4Y', 'SEGO-ANC-1762-PR0D', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1762-PR0D', 'BRAT-ANC-1733-RS77', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRAT-ANC-1733-RS77', 'SEGO-ANC-1762-PR0D', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1791-4AYE', 'SAUV-ANC-1759-BQJT', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1759-BQJT', 'SAUV-ANC-1791-4AYE', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1791-4AYE', 'RICH-ANC-1762-YS7I', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RICH-ANC-1762-YS7I', 'SAUV-ANC-1791-4AYE', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABR-ANC-1802-JOSM', 'LABR-ANC-1772-PFYP', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABR-ANC-1772-PFYP', 'LABR-ANC-1802-JOSM', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABR-ANC-1802-JOSM', 'LERO-ANC-1778-QUH5', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LERO-ANC-1778-QUH5', 'LABR-ANC-1802-JOSM', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1752-W5KY', 'EMER-ANC-1725-NQCG', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1725-NQCG', 'EMER-ANC-1752-W5KY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1752-W5KY', 'PELL-ANC-1752-R6ZA', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PELL-ANC-1752-R6ZA', 'EMER-ANC-1752-W5KY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1812-6DZT', 'SZEJ-ANC-1760-HEQB', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1760-HEQB', 'SZEJ-ANC-1812-6DZT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1812-6DZT', 'HERS-ANC-1761-0F7I', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HERS-ANC-1761-0F7I', 'SZEJ-ANC-1812-6DZT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROZE-ANC-1820-FN43', 'ROZE-ANC-1785-W6FK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROZE-ANC-1785-W6FK', 'ROZE-ANC-1820-FN43', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BENG-ANC-1785-DVOW', 'ANDE-ANC-1755-6PYK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1755-6PYK', 'BENG-ANC-1785-DVOW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BENG-ANC-1785-DVOW', 'JNS-ANC-1750-HG8B', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1750-HG8B', 'BENG-ANC-1785-DVOW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1785-8PAM', 'JNS-ANC-1751-2JQM', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1751-2JQM', 'PEHR-ANC-1785-8PAM', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1785-8PAM', 'EBBE-ANC-1757-RF8L', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EBBE-ANC-1757-RF8L', 'PEHR-ANC-1785-8PAM', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHA-ANC-1805-3RO0', 'LIND-ANC-1774-ZRGN', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LIND-ANC-1774-ZRGN', 'JOHA-ANC-1805-3RO0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1811-GS79', 'ANDE-ANC-1738-LJFD', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1738-LJFD', 'LARS-ANC-1811-GS79', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1811-GS79', 'ANDE-ANC-1770-8IZK', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1770-8IZK', 'LARS-ANC-1811-GS79', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYE-ANC-1791-HN7U', 'MEYE-ANC-1757-SMHF', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYE-ANC-1757-SMHF', 'MEYE-ANC-1791-HN7U', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYE-ANC-1791-HN7U', 'GERD-ANC-1779-P5WS', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GERD-ANC-1779-P5WS', 'MEYE-ANC-1791-HN7U', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1790-O3RR', 'GEUT-ANC-1745-Y0T9', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1745-Y0T9', 'GEUT-ANC-1790-O3RR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1790-O3RR', 'DOPP-ANC-1747-G72W', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DOPP-ANC-1747-G72W', 'GEUT-ANC-1790-O3RR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNAU-ANC-1795-EQMG', 'KNAU-ANC-1768-J4S9', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNAU-ANC-1768-J4S9', 'KNAU-ANC-1795-EQMG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNAU-ANC-1795-EQMG', 'RENN-ANC-1762-HM36', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RENN-ANC-1762-HM36', 'KNAU-ANC-1795-EQMG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1795-LPRH', 'KRUS-ANC-1763-YERU', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRUS-ANC-1763-YERU', 'KROO-ANC-1795-LPRH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1795-LPRH', 'MANG-ANC-1764-BTAU', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MANG-ANC-1764-BTAU', 'KROO-ANC-1795-LPRH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIC-ANC-1820-EZD6', 'WEIC-ANC-1776-E7BM', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIC-ANC-1776-E7BM', 'WEIC-ANC-1820-EZD6', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIC-ANC-1820-EZD6', 'RIEK-ANC-1784-0AML', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RIEK-ANC-1784-0AML', 'WEIC-ANC-1820-EZD6', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1751-QGIK', 'LOON-ANC-1729-OIJR', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1729-OIJR', 'LOON-ANC-1751-QGIK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1751-QGIK', 'MOOR-ANC-1729-JCA9', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1729-JCA9', 'LOON-ANC-1751-QGIK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1755-JRXR', 'CROS-ANC-1730-7OPQ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1730-7OPQ', 'LOON-ANC-1755-JRXR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1755-JRXR', 'COLE-ANC-1733-FFBY', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1733-FFBY', 'LOON-ANC-1755-JRXR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1755-ULYP', 'STUA-ANC-1730-V622', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STUA-ANC-1730-V622', 'CART-ANC-1755-ULYP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALLE-ANC-1764-2CC2', 'CART-ANC-1734-BJ3P', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1734-BJ3P', 'ALLE-ANC-1764-2CC2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALLE-ANC-1764-2CC2', 'HOBS-ANC-1745-UZJD', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOBS-ANC-1745-UZJD', 'ALLE-ANC-1764-2CC2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1768-CP76', 'CATE-ANC-1753-KOAV', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1753-KOAV', 'CATE-ANC-1768-CP76', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1768-CP76', 'LAWR-ANC-1753-YWJB', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWR-ANC-1753-YWJB', 'CATE-ANC-1768-CP76', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYA-ANC-1762-0MTF', 'ENYA-ANC-1739-XCZ0', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYA-ANC-1739-XCZ0', 'ENYA-ANC-1762-0MTF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYA-ANC-1762-0MTF', 'GRIF-ANC-1740-U92I', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GRIF-ANC-1740-U92I', 'ENYA-ANC-1762-0MTF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERK-ANC-1740-XCZY', 'TURK-ANC-1718-T1NX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1718-T1NX', 'DERK-ANC-1740-XCZY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERK-ANC-1740-XCZY', 'STAP-ANC-1721-YQMW', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1721-YQMW', 'DERK-ANC-1740-XCZY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1742-FX9H', 'DUNK-ANC-1705-9DWW', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1705-9DWW', 'DUNK-ANC-1742-FX9H', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1742-FX9H', 'HAUE-ANC-1720-B9SS', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1720-B9SS', 'DUNK-ANC-1742-FX9H', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1770-NAP4', 'JOHN-ANC-1742-4S52', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1742-4S52', 'JONE-ANC-1770-NAP4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1770-NAP4', 'EVAN-ANC-1749-4NZG', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1749-4NZG', 'JONE-ANC-1770-NAP4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1772-2ETV', 'LEWI-ANC-1750-S0Q4', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1750-S0Q4', 'JONE-ANC-1772-2ETV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1772-2ETV', 'BUSB-ANC-1752-YK68', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BUSB-ANC-1752-YK68', 'JONE-ANC-1772-2ETV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1771-F721', 'KLIP-ANC-1741-5R3K', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLIP-ANC-1741-5R3K', 'KLEP-ANC-1771-F721', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1771-F721', 'KLEP-ANC-1743-9WQ5', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1743-9WQ5', 'KLEP-ANC-1771-F721', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1771-U618', 'GILL-ANC-1750-5I5W', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1750-5I5W', 'GILL-ANC-1771-U618', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1771-U618', 'CLAN-ANC-1750-34IW', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CLAN-ANC-1750-34IW', 'GILL-ANC-1771-U618', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1761-PJD6', 'LANG-ANC-1740-ZEAV', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1740-ZEAV', 'LANG-ANC-1761-PJD6', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1761-PJD6', 'THOM-ANC-1721-PGIH', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1721-PGIH', 'LANG-ANC-1761-PJD6', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1770-0HH6', 'EPPE-ANC-1734-ADQX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1734-ADQX', 'EPPE-ANC-1770-0HH6', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1770-0HH6', 'EPPE-ANC-1734-RCJA', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1734-RCJA', 'EPPE-ANC-1770-0HH6', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1745-EAOA', 'WEIN-ANC-1715-GJOJ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIN-ANC-1715-GJOJ', 'WINE-ANC-1745-EAOA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1745-EAOA', 'GFEL-ANC-1721-DQP7', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GFEL-ANC-1721-DQP7', 'WINE-ANC-1745-EAOA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1740-8YTX', 'DUNK-ANC-1705-9DWW', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1705-9DWW', 'DUNK-ANC-1740-8YTX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1740-8YTX', 'HAUE-ANC-1720-B9SS', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1720-B9SS', 'DUNK-ANC-1740-8YTX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1750-2VGV', 'SCHL-ANC-1709-CJFJ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1709-CJFJ', 'SCHL-ANC-1750-2VGV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1750-2VGV', 'SCHL-ANC-1713-LIDG', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1713-LIDG', 'SCHL-ANC-1750-2VGV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1762-M7TY', 'JOHN-ANC-1742-4S52', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1742-4S52', 'JOHN-ANC-1762-M7TY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1762-M7TY', 'EVAN-ANC-1749-4NZG', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1749-4NZG', 'JOHN-ANC-1762-M7TY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARI-ANC-1759-4NNR', 'MARI-ANC-1721-1LXH', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARI-ANC-1721-1LXH', 'MARI-ANC-1759-4NNR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARI-ANC-1759-4NNR', 'BRUS-ANC-1735-F2ZA', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUS-ANC-1735-F2ZA', 'MARI-ANC-1759-4NNR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOUD-ANC-1772-KM5K', 'LOUD-ANC-1746-HOTD', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOUD-ANC-1746-HOTD', 'LOUD-ANC-1772-KM5K', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOUD-ANC-1772-KM5K', 'HOAR-ANC-1748-LDPS', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOAR-ANC-1748-LDPS', 'LOUD-ANC-1772-KM5K', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLSS-ANC-1690-B6CF', 'ENGE-ANC-1652-HFYP', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENGE-ANC-1652-HFYP', 'OLSS-ANC-1690-B6CF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLSS-ANC-1690-B6CF', 'ANDE-ANC-1659-WXVA', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1659-WXVA', 'OLSS-ANC-1690-B6CF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BORJ-ANC-1700-3VFF', 'BORG-ANC-UNK-AJM6', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BORG-ANC-UNK-AJM6', 'BORJ-ANC-1700-3VFF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BORJ-ANC-1700-3VFF', 'KIER-ANC-UNK-SKA4', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KIER-ANC-UNK-SKA4', 'BORJ-ANC-1700-3VFF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TORE-ANC-1714-X6VL', 'BJOR-ANC-1672-VJRW', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BJOR-ANC-1672-VJRW', 'TORE-ANC-1714-X6VL', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TORE-ANC-1714-X6VL', 'ANDE-ANC-1690-G0XJ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1690-G0XJ', 'TORE-ANC-1714-X6VL', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1721-555U', 'PERS-ANC-1684-YVWH', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1684-YVWH', 'ANDE-ANC-1721-555U', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1721-555U', 'OLOF-ANC-1693-8983', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLOF-ANC-1693-8983', 'ANDE-ANC-1721-555U', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRJ-ANC-1729-UZZR', 'HALF-ANC-1692-M1MW', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HALF-ANC-1692-M1MW', 'BRJ-ANC-1729-UZZR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRJ-ANC-1729-UZZR', 'RASM-ANC-1696-RMDM', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RASM-ANC-1696-RMDM', 'BRJ-ANC-1729-UZZR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1726-4D4Y', 'WAHL-ANC-1677-V1NS', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WAHL-ANC-1677-V1NS', 'PEHR-ANC-1726-4D4Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1726-4D4Y', 'LARS-ANC-1690-6JV6', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1690-6JV6', 'PEHR-ANC-1726-4D4Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRAT-ANC-1733-RS77', 'BRAT-ANC-1702-BX0P', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRAT-ANC-1702-BX0P', 'BRAT-ANC-1733-RS77', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRAT-ANC-1733-RS77', 'LABE-ANC-1703-PJSV', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABE-ANC-1703-PJSV', 'BRAT-ANC-1733-RS77', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1759-BQJT', 'SAUV-ANC-1728-WLJT', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1728-WLJT', 'SAUV-ANC-1759-BQJT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1759-BQJT', 'COUT-ANC-1728-KC8D', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COUT-ANC-1728-KC8D', 'SAUV-ANC-1759-BQJT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABR-ANC-1772-PFYP', 'LEBR-ANC-1737-0XC5', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEBR-ANC-1737-0XC5', 'LABR-ANC-1772-PFYP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABR-ANC-1772-PFYP', 'ROYE-ANC-1743-VO63', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROYE-ANC-1743-VO63', 'LABR-ANC-1772-PFYP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LERO-ANC-1778-QUH5', 'LERO-ANC-1722-HKBI', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LERO-ANC-1722-HKBI', 'LERO-ANC-1778-QUH5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LERO-ANC-1778-QUH5', 'GUY-ANC-1743-N9FN', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUY-ANC-1743-N9FN', 'LERO-ANC-1778-QUH5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1725-NQCG', 'EMER-ANC-1690-LQKG', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1690-LQKG', 'EMER-ANC-1725-NQCG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1725-NQCG', 'BRUN-ANC-1694-439G', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1694-439G', 'EMER-ANC-1725-NQCG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1760-HEQB', 'SZEJ-ANC-1738-TKKR', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1738-TKKR', 'SZEJ-ANC-1760-HEQB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1755-6PYK', 'CHRI-ANC-1734-3WNK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CHRI-ANC-1734-3WNK', 'ANDE-ANC-1755-6PYK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1755-6PYK', 'SAVE-ANC-1734-PX5P', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAVE-ANC-1734-PX5P', 'ANDE-ANC-1755-6PYK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1751-2JQM', 'JONS-ANC-1717-WCH5', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1717-WCH5', 'JNS-ANC-1751-2JQM', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1751-2JQM', 'JNS-ANC-1718-W5BE', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1718-W5BE', 'JNS-ANC-1751-2JQM', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EBBE-ANC-1757-RF8L', 'STR-ANC-1713-CB40', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STR-ANC-1713-CB40', 'EBBE-ANC-1757-RF8L', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1738-LJFD', 'ANDE-ANC-1714-IFZ9', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1714-IFZ9', 'ANDE-ANC-1738-LJFD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1770-8IZK', 'ISRA-ANC-1734-WPJ9', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ISRA-ANC-1734-WPJ9', 'ANDE-ANC-1770-8IZK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GERD-ANC-1779-P5WS', 'STR-ANC-1751-6YY1', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STR-ANC-1751-6YY1', 'GERD-ANC-1779-P5WS', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GERD-ANC-1779-P5WS', 'GERL-ANC-1756-2FS3', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GERL-ANC-1756-2FS3', 'GERD-ANC-1779-P5WS', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1745-Y0T9', 'GEUT-ANC-1722-2BBB', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1722-2BBB', 'GEUT-ANC-1745-Y0T9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1745-Y0T9', 'RAUT-ANC-1713-1K45', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RAUT-ANC-1713-1K45', 'GEUT-ANC-1745-Y0T9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DOPP-ANC-1747-G72W', 'DOPP-ANC-1716-9ICP', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DOPP-ANC-1716-9ICP', 'DOPP-ANC-1747-G72W', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DOPP-ANC-1747-G72W', 'MAED-ANC-UNK-OJXM', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MAED-ANC-UNK-OJXM', 'DOPP-ANC-1747-G72W', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNAU-ANC-1768-J4S9', 'KNAU-ANC-1743-M4MV', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNAU-ANC-1743-M4MV', 'KNAU-ANC-1768-J4S9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RENN-ANC-1762-HM36', 'RENN-ANC-UNK-ZJZP', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RENN-ANC-UNK-ZJZP', 'RENN-ANC-1762-HM36', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RENN-ANC-1762-HM36', 'BUCH-ANC-UNK-WVL5', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BUCH-ANC-UNK-WVL5', 'RENN-ANC-1762-HM36', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRUS-ANC-1763-YERU', 'KROO-ANC-1731-FGV0', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1731-FGV0', 'KRUS-ANC-1763-YERU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRUS-ANC-1763-YERU', 'VON-ANC-1743-QF9F', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VON-ANC-1743-QF9F', 'KRUS-ANC-1763-YERU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1729-OIJR', 'LOON-ANC-1692-UFPY', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1692-UFPY', 'LOON-ANC-1729-OIJR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1729-OIJR', 'BARB-ANC-1696-E9KK', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BARB-ANC-1696-E9KK', 'LOON-ANC-1729-OIJR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1729-JCA9', 'MOOR-ANC-1711-MZUB', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1711-MZUB', 'MOOR-ANC-1729-JCA9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1729-JCA9', 'WALK-ANC-1712-9R5X', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1712-9R5X', 'MOOR-ANC-1729-JCA9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1730-7OPQ', 'CROS-ANC-1700-RDBU', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1700-RDBU', 'CROS-ANC-1730-7OPQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1730-7OPQ', 'TRAC-ANC-1701-NU0H', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1701-NU0H', 'CROS-ANC-1730-7OPQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1733-FFBY', 'COLE-ANC-1691-EHNQ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1691-EHNQ', 'COLE-ANC-1733-FFBY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1733-FFBY', 'GILE-ANC-1718-6VNL', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILE-ANC-1718-6VNL', 'COLE-ANC-1733-FFBY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STUA-ANC-1730-V622', 'STEW-ANC-1710-DFDK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEW-ANC-1710-DFDK', 'STUA-ANC-1730-V622', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STUA-ANC-1730-V622', 'PACE-ANC-1710-A2HG', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PACE-ANC-1710-A2HG', 'STUA-ANC-1730-V622', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOBS-ANC-1745-UZJD', 'HOBS-ANC-1716-UA7B', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOBS-ANC-1716-UA7B', 'HOBS-ANC-1745-UZJD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOBS-ANC-1745-UZJD', 'LAWS-ANC-1721-1UTK', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWS-ANC-1721-1UTK', 'HOBS-ANC-1745-UZJD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1753-KOAV', 'CATE-ANC-1700-C50L', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1700-C50L', 'CATE-ANC-1753-KOAV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1753-KOAV', 'WYAT-ANC-1702-D9H8', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1702-D9H8', 'CATE-ANC-1753-KOAV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWR-ANC-1753-YWJB', 'LAWR-ANC-1733-GZ6W', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWR-ANC-1733-GZ6W', 'LAWR-ANC-1753-YWJB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWR-ANC-1753-YWJB', 'WOMA-ANC-1733-DPNK', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WOMA-ANC-1733-DPNK', 'LAWR-ANC-1753-YWJB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYA-ANC-1739-XCZ0', 'ENYE-ANC-1713-Y2NM', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYE-ANC-1713-Y2NM', 'ENYA-ANC-1739-XCZ0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYA-ANC-1739-XCZ0', 'BRIN-ANC-1716-4K11', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRIN-ANC-1716-4K11', 'ENYA-ANC-1739-XCZ0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1718-T1NX', 'TURK-ANC-1685-76KP', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1685-76KP', 'TURK-ANC-1718-T1NX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1718-T1NX', 'PAUL-ANC-1685-B4GV', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1685-B4GV', 'TURK-ANC-1718-T1NX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1721-YQMW', 'STAP-ANC-1690-83XD', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1690-83XD', 'STAP-ANC-1721-YQMW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1721-YQMW', 'TURK-ANC-1692-CEQ7', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1692-CEQ7', 'STAP-ANC-1721-YQMW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1705-9DWW', 'DUNK-ANC-1682-0P0M', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1682-0P0M', 'DUNK-ANC-1705-9DWW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1705-9DWW', 'GODS-ANC-1680-QZ6K', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GODS-ANC-1680-QZ6K', 'DUNK-ANC-1705-9DWW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1720-B9SS', 'HAUE-ANC-1698-RHZC', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1698-RHZC', 'HAUE-ANC-1720-B9SS', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1720-B9SS', 'STEI-ANC-1692-LBH5', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1692-LBH5', 'HAUE-ANC-1720-B9SS', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1742-4S52', 'JOUA-ANC-1726-DEWU', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOUA-ANC-1726-DEWU', 'JOHN-ANC-1742-4S52', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1742-4S52', 'TANN-ANC-1725-UPZB', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TANN-ANC-1725-UPZB', 'JOHN-ANC-1742-4S52', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1749-4NZG', 'EVAN-ANC-1721-1UM0', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1721-1UM0', 'EVAN-ANC-1749-4NZG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1749-4NZG', 'LEWI-ANC-1723-YK41', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1723-YK41', 'EVAN-ANC-1749-4NZG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1750-S0Q4', 'LEWI-ANC-1724-7MVN', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1724-7MVN', 'LEWI-ANC-1750-S0Q4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1750-S0Q4', 'MONT-ANC-1728-N5KD', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MONT-ANC-1728-N5KD', 'LEWI-ANC-1750-S0Q4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BUSB-ANC-1752-YK68', 'BROW-ANC-1720-B8X7', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1720-B8X7', 'BUSB-ANC-1752-YK68', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BUSB-ANC-1752-YK68', 'HARR-ANC-1723-1PZH', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARR-ANC-1723-1PZH', 'BUSB-ANC-1752-YK68', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLIP-ANC-1741-5R3K', 'KLIP-ANC-1715-PHYN', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLIP-ANC-1715-PHYN', 'KLIP-ANC-1741-5R3K', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLIP-ANC-1741-5R3K', 'HALF-ANC-1718-EGVT', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HALF-ANC-1718-EGVT', 'KLIP-ANC-1741-5R3K', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1750-5I5W', 'GILL-ANC-1719-MARU', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1719-MARU', 'GILL-ANC-1750-5I5W', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1750-5I5W', 'JOHN-ANC-1719-3QTY', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1719-3QTY', 'GILL-ANC-1750-5I5W', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CLAN-ANC-1750-34IW', 'CLAN-ANC-1709-58AL', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CLAN-ANC-1709-58AL', 'CLAN-ANC-1750-34IW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CLAN-ANC-1750-34IW', 'WYCH-ANC-1722-BK35', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYCH-ANC-1722-BK35', 'CLAN-ANC-1750-34IW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1740-ZEAV', 'LANK-ANC-1700-Q5A1', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1700-Q5A1', 'LANG-ANC-1740-ZEAV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1740-ZEAV', 'SHAR-ANC-1720-AZOF', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1720-AZOF', 'LANG-ANC-1740-ZEAV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1721-PGIH', 'THOM-ANC-1687-X9XN', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1687-X9XN', 'THOM-ANC-1721-PGIH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1721-PGIH', 'VIA-ANC-1687-BAWH', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VIA-ANC-1687-BAWH', 'THOM-ANC-1721-PGIH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1734-ADQX', 'EPPE-ANC-1703-UZ4P', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1703-UZ4P', 'EPPE-ANC-1734-ADQX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1734-ADQX', 'MIEH-ANC-1707-0G8Y', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MIEH-ANC-1707-0G8Y', 'EPPE-ANC-1734-ADQX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1734-RCJA', 'THOM-ANC-1687-X9XN', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1687-X9XN', 'EPPE-ANC-1734-RCJA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1734-RCJA', 'VIA-ANC-1687-BAWH', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VIA-ANC-1687-BAWH', 'EPPE-ANC-1734-RCJA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1709-CJFJ', 'SCHL-ANC-1663-V1M0', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1663-V1M0', 'SCHL-ANC-1709-CJFJ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1709-CJFJ', 'FREY-ANC-1678-69CU', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1678-69CU', 'SCHL-ANC-1709-CJFJ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1713-LIDG', 'WASC-ANC-1675-3DQG', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WASC-ANC-1675-3DQG', 'SCHL-ANC-1713-LIDG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1713-LIDG', 'ACHE-ANC-1673-AN8J', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ACHE-ANC-1673-AN8J', 'SCHL-ANC-1713-LIDG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARI-ANC-1721-1LXH', 'MARR-ANC-UNK-4OT6', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARR-ANC-UNK-4OT6', 'MARI-ANC-1721-1LXH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARI-ANC-1721-1LXH', 'HUBE-ANC-UNK-6WMY', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HUBE-ANC-UNK-6WMY', 'MARI-ANC-1721-1LXH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOUD-ANC-1746-HOTD', 'LAUT-ANC-1717-U0A1', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAUT-ANC-1717-U0A1', 'LOUD-ANC-1746-HOTD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOUD-ANC-1746-HOTD', 'KLEI-ANC-1722-650B', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEI-ANC-1722-650B', 'LOUD-ANC-1746-HOTD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENGE-ANC-1652-HFYP', 'SVEN-ANC-1600-H7BA', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SVEN-ANC-1600-H7BA', 'ENGE-ANC-1652-HFYP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1659-WXVA', 'ROTK-ANC-1620-QHKH', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROTK-ANC-1620-QHKH', 'ANDE-ANC-1659-WXVA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1659-WXVA', 'KARL-ANC-1625-EXAO', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KARL-ANC-1625-EXAO', 'ANDE-ANC-1659-WXVA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BJOR-ANC-1672-VJRW', 'NILS-ANC-1610-DXXS', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NILS-ANC-1610-DXXS', 'BJOR-ANC-1672-VJRW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BJOR-ANC-1672-VJRW', 'PERS-ANC-1620-UE3W', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1620-UE3W', 'BJOR-ANC-1672-VJRW', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1690-G0XJ', 'MICH-ANC-1642-YHH8', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1642-YHH8', 'ANDE-ANC-1690-G0XJ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1690-G0XJ', 'MATT-ANC-1655-UWDP', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MATT-ANC-1655-UWDP', 'ANDE-ANC-1690-G0XJ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1728-WLJT', 'SAUV-ANC-1683-AG5P', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1683-AG5P', 'SAUV-ANC-1728-WLJT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1728-WLJT', 'BARD-ANC-1691-2UV1', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BARD-ANC-1691-2UV1', 'SAUV-ANC-1728-WLJT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COUT-ANC-1728-KC8D', 'COUT-ANC-1698-KWY5', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COUT-ANC-1698-KWY5', 'COUT-ANC-1728-KC8D', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COUT-ANC-1728-KC8D', 'BOUF-ANC-1691-87BV', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOUF-ANC-1691-87BV', 'COUT-ANC-1728-KC8D', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUY-ANC-1743-N9FN', 'GUIL-ANC-1716-IKRR', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUIL-ANC-1716-IKRR', 'GUY-ANC-1743-N9FN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUY-ANC-1743-N9FN', 'RACI-ANC-1721-MT3J', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RACI-ANC-1721-MT3J', 'GUY-ANC-1743-N9FN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1690-LQKG', 'EMER-ANC-1643-R38D', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1643-R38D', 'EMER-ANC-1690-LQKG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1690-LQKG', 'FAVR-ANC-1672-EEJ2', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FAVR-ANC-1672-EEJ2', 'EMER-ANC-1690-LQKG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1694-439G', 'BRUN-ANC-1641-ILOC', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1641-ILOC', 'BRUN-ANC-1694-439G', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1694-439G', 'RICH-ANC-1662-TLX8', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RICH-ANC-1662-TLX8', 'BRUN-ANC-1694-439G', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1714-IFZ9', 'HKA-ANC-1655-D9OS', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HKA-ANC-1655-D9OS', 'ANDE-ANC-1714-IFZ9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ISRA-ANC-1734-WPJ9', 'MNS-ANC-1693-OF8N', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MNS-ANC-1693-OF8N', 'ISRA-ANC-1734-WPJ9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RAUT-ANC-1713-1K45', 'RUBS-ANC-1687-HLIP', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RUBS-ANC-1687-HLIP', 'RAUT-ANC-1713-1K45', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1731-FGV0', 'KROO-ANC-1693-WIVI', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1693-WIVI', 'KROO-ANC-1731-FGV0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1731-FGV0', 'KROO-ANC-1709-U2GC', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1709-U2GC', 'KROO-ANC-1731-FGV0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1711-MZUB', 'MOOR-ANC-1683-YO8T', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1683-YO8T', 'MOOR-ANC-1711-MZUB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1711-MZUB', 'FORS-ANC-1695-KBR8', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FORS-ANC-1695-KBR8', 'MOOR-ANC-1711-MZUB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1712-9R5X', 'WALK-ANC-1680-7LCT', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1680-7LCT', 'WALK-ANC-1712-9R5X', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1712-9R5X', 'RUTH-ANC-1682-C232', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RUTH-ANC-1682-C232', 'WALK-ANC-1712-9R5X', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1700-RDBU', 'CROS-ANC-1670-W7BZ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1670-W7BZ', 'CROS-ANC-1700-RDBU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1700-RDBU', 'BOUR-ANC-1680-9EQ3', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOUR-ANC-1680-9EQ3', 'CROS-ANC-1700-RDBU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1701-NU0H', 'TRAC-ANC-1674-CSB5', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1674-CSB5', 'TRAC-ANC-1701-NU0H', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1701-NU0H', 'HITC-ANC-1680-O0D2', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HITC-ANC-1680-O0D2', 'TRAC-ANC-1701-NU0H', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1691-EHNQ', 'COLE-ANC-1670-9OA2', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1670-9OA2', 'COLE-ANC-1691-EHNQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1691-EHNQ', 'GARR-ANC-1675-MZ9R', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GARR-ANC-1675-MZ9R', 'COLE-ANC-1691-EHNQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOBS-ANC-1716-UA7B', 'HOBS-ANC-1688-0FDD', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOBS-ANC-1688-0FDD', 'HOBS-ANC-1716-UA7B', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWS-ANC-1721-1UTK', 'LAWS-ANC-1690-Z5AE', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWS-ANC-1690-Z5AE', 'LAWS-ANC-1721-1UTK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWS-ANC-1721-1UTK', 'DEW-ANC-1700-DAZI', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DEW-ANC-1700-DAZI', 'LAWS-ANC-1721-1UTK', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1700-C50L', 'CATE-ANC-1667-H623', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1667-H623', 'CATE-ANC-1700-C50L', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1700-C50L', 'RAND-ANC-UNK-1YSZ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RAND-ANC-UNK-1YSZ', 'CATE-ANC-1700-C50L', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1702-D9H8', 'WYAT-ANC-1677-8ZLZ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1677-8ZLZ', 'WYAT-ANC-1702-D9H8', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1702-D9H8', 'NEWT-ANC-1685-9HUZ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEWT-ANC-1685-9HUZ', 'WYAT-ANC-1702-D9H8', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1685-76KP', 'TURK-ANC-1650-MO85', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1650-MO85', 'TURK-ANC-1685-76KP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1685-76KP', 'MUEL-ANC-1655-X6JY', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MUEL-ANC-1655-X6JY', 'TURK-ANC-1685-76KP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1685-B4GV', 'PAUL-ANC-1660-OH5Q', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1660-OH5Q', 'PAUL-ANC-1685-B4GV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1685-B4GV', 'KRM-ANC-1658-1L8H', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1658-1L8H', 'PAUL-ANC-1685-B4GV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1690-83XD', 'STAP-ANC-1644-4VI5', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1644-4VI5', 'STAP-ANC-1690-83XD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1690-83XD', 'GAGE-ANC-1665-FUR1', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GAGE-ANC-1665-FUR1', 'STAP-ANC-1690-83XD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1692-CEQ7', 'WEIG-ANC-1656-VY6D', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIG-ANC-1656-VY6D', 'TURK-ANC-1692-CEQ7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1692-CEQ7', 'UNK-ANC-1656-REJZ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1656-REJZ', 'TURK-ANC-1692-CEQ7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1682-0P0M', 'DUNC-ANC-1645-07RB', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1645-07RB', 'DUNK-ANC-1682-0P0M', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1682-0P0M', 'HART-ANC-1647-RNR2', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HART-ANC-1647-RNR2', 'DUNK-ANC-1682-0P0M', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GODS-ANC-1680-QZ6K', 'GODS-ANC-1631-IFNW', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GODS-ANC-1631-IFNW', 'GODS-ANC-1680-QZ6K', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GODS-ANC-1680-QZ6K', 'KIRS-ANC-1665-8BC0', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KIRS-ANC-1665-8BC0', 'GODS-ANC-1680-QZ6K', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1698-RHZC', 'HAUE-ANC-1670-5UK5', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1670-5UK5', 'HAUE-ANC-1698-RHZC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1698-RHZC', 'PETR-ANC-1670-GMZR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PETR-ANC-1670-GMZR', 'HAUE-ANC-1698-RHZC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1692-LBH5', 'STEI-ANC-1647-ZJ5N', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1647-ZJ5N', 'STEI-ANC-1692-LBH5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1692-LBH5', 'GUTB-ANC-1655-F0OQ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUTB-ANC-1655-F0OQ', 'STEI-ANC-1692-LBH5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOUA-ANC-1726-DEWU', 'JOUA-ANC-1691-E313', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOUA-ANC-1691-E313', 'JOUA-ANC-1726-DEWU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1721-1UM0', 'EVAN-ANC-1687-JGW7', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1687-JGW7', 'EVAN-ANC-1721-1UM0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1721-1UM0', 'MILE-ANC-1693-TB56', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MILE-ANC-1693-TB56', 'EVAN-ANC-1721-1UM0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1723-YK41', 'LEWI-ANC-1674-PJD0', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1674-PJD0', 'LEWI-ANC-1723-YK41', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1723-YK41', 'POWE-ANC-1679-MTGH', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('POWE-ANC-1679-MTGH', 'LEWI-ANC-1723-YK41', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1724-7MVN', 'LEWI-ANC-1694-LRJ9', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1694-LRJ9', 'LEWI-ANC-1724-7MVN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1724-7MVN', 'BUSB-ANC-1699-3XFJ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BUSB-ANC-1699-3XFJ', 'LEWI-ANC-1724-7MVN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1720-B8X7', 'BROW-ANC-1693-ZON0', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1693-ZON0', 'BROW-ANC-1720-B8X7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1720-B8X7', 'REYN-ANC-1697-6EW4', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REYN-ANC-1697-6EW4', 'BROW-ANC-1720-B8X7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARR-ANC-1723-1PZH', 'HARR-ANC-1696-A6ZW', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARR-ANC-1696-A6ZW', 'HARR-ANC-1723-1PZH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARR-ANC-1723-1PZH', 'GLEN-ANC-UNK-75MR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GLEN-ANC-UNK-75MR', 'HARR-ANC-1723-1PZH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLIP-ANC-1715-PHYN', 'KLEP-ANC-1693-2DQS', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1693-2DQS', 'KLIP-ANC-1715-PHYN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLIP-ANC-1715-PHYN', 'WAMB-ANC-1693-PX5D', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WAMB-ANC-1693-PX5D', 'KLIP-ANC-1715-PHYN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1719-MARU', 'GILL-ANC-1666-YKP7', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1666-YKP7', 'GILL-ANC-1719-MARU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1719-MARU', 'HENR-ANC-1690-5HL9', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HENR-ANC-1690-5HL9', 'GILL-ANC-1719-MARU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1719-3QTY', 'JOHN-ANC-1697-CRDN', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1697-CRDN', 'JOHN-ANC-1719-3QTY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1719-3QTY', 'COLL-ANC-1700-CSN2', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLL-ANC-1700-CSN2', 'JOHN-ANC-1719-3QTY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1700-Q5A1', 'LANK-ANC-1675-0PW8', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1675-0PW8', 'LANK-ANC-1700-Q5A1', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1700-Q5A1', 'WEST-ANC-1675-YL5Z', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1675-YL5Z', 'LANK-ANC-1700-Q5A1', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1720-AZOF', 'SHAR-ANC-1686-BZDR', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1686-BZDR', 'SHAR-ANC-1720-AZOF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1720-AZOF', 'WOOD-ANC-1691-3BCM', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WOOD-ANC-1691-3BCM', 'SHAR-ANC-1720-AZOF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1687-X9XN', 'THOM-ANC-1650-WW1X', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1650-WW1X', 'THOM-ANC-1687-X9XN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1687-X9XN', 'UNK-ANC-UNK-21FL', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-UNK-21FL', 'THOM-ANC-1687-X9XN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VIA-ANC-1687-BAWH', 'VIA-ANC-1664-HTLJ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VIA-ANC-1664-HTLJ', 'VIA-ANC-1687-BAWH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VIA-ANC-1687-BAWH', 'SPEN-ANC-1664-FSUA', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SPEN-ANC-1664-FSUA', 'VIA-ANC-1687-BAWH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1703-UZ4P', 'EPPE-ANC-1659-1KQX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1659-1KQX', 'EPPE-ANC-1703-UZ4P', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1703-UZ4P', 'ALEX-ANC-1653-3PJ3', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALEX-ANC-1653-3PJ3', 'EPPE-ANC-1703-UZ4P', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MIEH-ANC-1707-0G8Y', 'MICH-ANC-1672-VPGX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1672-VPGX', 'MIEH-ANC-1707-0G8Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MIEH-ANC-1707-0G8Y', 'ROCH-ANC-1667-6PA4', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1667-6PA4', 'MIEH-ANC-1707-0G8Y', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1663-V1M0', 'SCHL-ANC-1642-AUOA', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1642-AUOA', 'SCHL-ANC-1663-V1M0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1663-V1M0', 'SCHA-ANC-1643-C1WR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1643-C1WR', 'SCHL-ANC-1663-V1M0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1678-69CU', 'FREY-ANC-1650-MPEE', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1650-MPEE', 'FREY-ANC-1678-69CU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1678-69CU', 'RITT-ANC-1649-EFIA', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RITT-ANC-1649-EFIA', 'FREY-ANC-1678-69CU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WASC-ANC-1675-3DQG', 'WASC-ANC-1655-JI0I', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WASC-ANC-1655-JI0I', 'WASC-ANC-1675-3DQG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WASC-ANC-1675-3DQG', 'HALM-ANC-1657-NNS6', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HALM-ANC-1657-NNS6', 'WASC-ANC-1675-3DQG', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ACHE-ANC-1673-AN8J', 'ACHE-ANC-1637-6KHV', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ACHE-ANC-1637-6KHV', 'ACHE-ANC-1673-AN8J', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ACHE-ANC-1673-AN8J', 'WIRT-ANC-1641-D48N', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WIRT-ANC-1641-D48N', 'ACHE-ANC-1673-AN8J', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAUT-ANC-1717-U0A1', 'LAUT-ANC-1652-EYQU', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAUT-ANC-1652-EYQU', 'LAUT-ANC-1717-U0A1', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KARL-ANC-1625-EXAO', 'PERS-ANC-1605-XE4T', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1605-XE4T', 'KARL-ANC-1625-EXAO', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KARL-ANC-1625-EXAO', 'NILS-ANC-1607-ZIL9', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NILS-ANC-1607-ZIL9', 'KARL-ANC-1625-EXAO', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NILS-ANC-1610-DXXS', 'OLSS-ANC-1580-3UCU', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLSS-ANC-1580-3UCU', 'NILS-ANC-1610-DXXS', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1620-UE3W', 'HANS-ANC-1590-8Q1T', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HANS-ANC-1590-8Q1T', 'PERS-ANC-1620-UE3W', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1620-UE3W', 'ANDE-ANC-1600-YEES', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1600-YEES', 'PERS-ANC-1620-UE3W', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1641-ILOC', 'BRUN-ANC-1615-LVVU', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1615-LVVU', 'BRUN-ANC-1641-ILOC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1641-ILOC', 'BOUS-ANC-1615-ZKAS', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOUS-ANC-1615-ZKAS', 'BRUN-ANC-1641-ILOC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MNS-ANC-1693-OF8N', 'JONS-ANC-1659-EIZC', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1659-EIZC', 'MNS-ANC-1693-OF8N', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MNS-ANC-1693-OF8N', 'PERS-ANC-1662-QAHR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1662-QAHR', 'MNS-ANC-1693-OF8N', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RUBS-ANC-1687-HLIP', 'RBS-ANC-1660-ZXL5', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1660-ZXL5', 'RUBS-ANC-1687-HLIP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RUBS-ANC-1687-HLIP', 'HOFF-ANC-1668-616L', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOFF-ANC-1668-616L', 'RUBS-ANC-1687-HLIP', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FORS-ANC-1695-KBR8', 'FORS-ANC-1667-XKL3', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FORS-ANC-1667-XKL3', 'FORS-ANC-1695-KBR8', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FORS-ANC-1695-KBR8', 'LANC-ANC-1665-JMRG', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANC-ANC-1665-JMRG', 'FORS-ANC-1695-KBR8', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1680-7LCT', 'WALK-ANC-1655-99T9', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1655-99T9', 'WALK-ANC-1680-7LCT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1680-7LCT', 'MCKN-ANC-1650-3HUU', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MCKN-ANC-1650-3HUU', 'WALK-ANC-1680-7LCT', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOUR-ANC-1680-9EQ3', 'BOAR-ANC-UNK-ISCO', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOAR-ANC-UNK-ISCO', 'BOUR-ANC-1680-9EQ3', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOUR-ANC-1680-9EQ3', 'BEAR-ANC-1650-CCXF', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BEAR-ANC-1650-CCXF', 'BOUR-ANC-1680-9EQ3', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1674-CSB5', 'TRAC-ANC-1650-Z2QI', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1650-Z2QI', 'TRAC-ANC-1674-CSB5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1674-CSB5', 'WARN-ANC-UNK-GTW4', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WARN-ANC-UNK-GTW4', 'TRAC-ANC-1674-CSB5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1677-8ZLZ', 'WYAT-ANC-1645-U1PR', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1645-U1PR', 'WYAT-ANC-1677-8ZLZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1677-8ZLZ', 'PATE-ANC-1652-G93U', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PATE-ANC-1652-G93U', 'WYAT-ANC-1677-8ZLZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEWT-ANC-1685-9HUZ', 'NEWT-ANC-1657-PEPS', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEWT-ANC-1657-PEPS', 'NEWT-ANC-1685-9HUZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEWT-ANC-1685-9HUZ', 'ALLE-ANC-1664-9AZV', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALLE-ANC-1664-9AZV', 'NEWT-ANC-1685-9HUZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1650-MO85', 'DURK-ANC-1620-ZGHD', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DURK-ANC-1620-ZGHD', 'TURK-ANC-1650-MO85', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1650-MO85', 'TRK-ANC-1625-DHSF', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRK-ANC-1625-DHSF', 'TURK-ANC-1650-MO85', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1660-OH5Q', 'PAUL-ANC-1630-RKRX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1630-RKRX', 'PAUL-ANC-1660-OH5Q', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1660-OH5Q', 'PAUL-ANC-1640-A417', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1640-A417', 'PAUL-ANC-1660-OH5Q', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1658-1L8H', 'KRM-ANC-1625-87MC', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1625-87MC', 'KRM-ANC-1658-1L8H', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1658-1L8H', 'SCHW-ANC-1630-LHAE', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHW-ANC-1630-LHAE', 'KRM-ANC-1658-1L8H', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1644-4VI5', 'STAP-ANC-1603-O20E', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1603-O20E', 'STAP-ANC-1644-4VI5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1644-4VI5', 'LENN-ANC-1604-2722', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1604-2722', 'STAP-ANC-1644-4VI5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GAGE-ANC-1665-FUR1', 'GAGE-ANC-1647-KVY9', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GAGE-ANC-1647-KVY9', 'GAGE-ANC-1665-FUR1', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIG-ANC-1656-VY6D', 'WEYG-ANC-1634-CA70', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEYG-ANC-1634-CA70', 'WEIG-ANC-1656-VY6D', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIG-ANC-1656-VY6D', 'FADI-ANC-1617-95PU', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FADI-ANC-1617-95PU', 'WEIG-ANC-1656-VY6D', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1656-REJZ', 'SIEG-ANC-1624-2SFO', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SIEG-ANC-1624-2SFO', 'UNK-ANC-1656-REJZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1656-REJZ', 'RIEH-ANC-1632-RD58', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RIEH-ANC-1632-RD58', 'UNK-ANC-1656-REJZ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1645-07RB', 'DUNC-ANC-1606-1XS9', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1606-1XS9', 'DUNC-ANC-1645-07RB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1645-07RB', 'LISG-ANC-1610-BSNX', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LISG-ANC-1610-BSNX', 'DUNC-ANC-1645-07RB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HART-ANC-1647-RNR2', 'HART-ANC-1625-6YO4', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HART-ANC-1625-6YO4', 'HART-ANC-1647-RNR2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HART-ANC-1647-RNR2', 'STRI-ANC-1624-3RHR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STRI-ANC-1624-3RHR', 'HART-ANC-1647-RNR2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1670-5UK5', 'HAUE-ANC-1641-ER88', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1641-ER88', 'HAUE-ANC-1670-5UK5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1670-5UK5', 'STOB-ANC-1642-UJSB', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STOB-ANC-1642-UJSB', 'HAUE-ANC-1670-5UK5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1647-ZJ5N', 'STEI-ANC-1603-VC8U', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1603-VC8U', 'STEI-ANC-1647-ZJ5N', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1647-ZJ5N', 'MAIE-ANC-1605-OAJK', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MAIE-ANC-1605-OAJK', 'STEI-ANC-1647-ZJ5N', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUTB-ANC-1655-F0OQ', 'GUTB-ANC-1626-L20U', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUTB-ANC-1626-L20U', 'GUTB-ANC-1655-F0OQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUTB-ANC-1655-F0OQ', 'FROM-ANC-1631-BKS2', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FROM-ANC-1631-BKS2', 'GUTB-ANC-1655-F0OQ', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1674-PJD0', 'LEWI-ANC-1645-QFIX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1645-QFIX', 'LEWI-ANC-1674-PJD0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1674-PJD0', 'PROT-ANC-1649-97HP', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PROT-ANC-1649-97HP', 'LEWI-ANC-1674-PJD0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1694-LRJ9', 'LEWI-ANC-1680-AG5V', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1680-AG5V', 'LEWI-ANC-1694-LRJ9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1694-LRJ9', 'WALS-ANC-1680-AOB9', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALS-ANC-1680-AOB9', 'LEWI-ANC-1694-LRJ9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1693-2DQS', 'KLEP-ANC-1670-B94K', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1670-B94K', 'KLEP-ANC-1693-2DQS', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1666-YKP7', 'GILL-ANC-1630-62C2', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1630-62C2', 'GILL-ANC-1666-YKP7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1666-YKP7', 'HENS-ANC-1614-NXT4', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HENS-ANC-1614-NXT4', 'GILL-ANC-1666-YKP7', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1697-CRDN', 'JOHN-ANC-1648-YHB6', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1648-YHB6', 'JOHN-ANC-1697-CRDN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1697-CRDN', 'GRIF-ANC-1652-B1FQ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GRIF-ANC-1652-B1FQ', 'JOHN-ANC-1697-CRDN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1675-0PW8', 'LANK-ANC-1643-XTHV', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1643-XTHV', 'LANK-ANC-1675-0PW8', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1675-0PW8', 'JORD-ANC-1640-MV1R', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JORD-ANC-1640-MV1R', 'LANK-ANC-1675-0PW8', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1675-YL5Z', 'WEST-ANC-1650-E99O', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1650-E99O', 'WEST-ANC-1675-YL5Z', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1675-YL5Z', 'FLOW-ANC-1659-7BWZ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FLOW-ANC-1659-7BWZ', 'WEST-ANC-1675-YL5Z', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1686-BZDR', 'SHAR-ANC-1650-H8KF', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1650-H8KF', 'SHAR-ANC-1686-BZDR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1686-BZDR', 'HATC-ANC-1665-MPS4', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HATC-ANC-1665-MPS4', 'SHAR-ANC-1686-BZDR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1659-1KQX', 'EPER-ANC-1638-L7MN', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPER-ANC-1638-L7MN', 'EPPE-ANC-1659-1KQX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1659-1KQX', 'REMO-ANC-UNK-CILD', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REMO-ANC-UNK-CILD', 'EPPE-ANC-1659-1KQX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALEX-ANC-1653-3PJ3', 'ALEX-ANC-1627-6A0R', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALEX-ANC-1627-6A0R', 'ALEX-ANC-1653-3PJ3', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALEX-ANC-1653-3PJ3', 'VEBV-ANC-1631-QLF3', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VEBV-ANC-1631-QLF3', 'ALEX-ANC-1653-3PJ3', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1672-VPGX', 'MICH-ANC-1655-FH6B', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1655-FH6B', 'MICH-ANC-1672-VPGX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1672-VPGX', 'SEVE-ANC-1655-ZA84', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEVE-ANC-1655-ZA84', 'MICH-ANC-1672-VPGX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1667-6PA4', 'ROCH-ANC-1641-AMNX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1641-AMNX', 'ROCH-ANC-1667-6PA4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1667-6PA4', 'TRUF-ANC-1641-49SG', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRUF-ANC-1641-49SG', 'ROCH-ANC-1667-6PA4', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1642-AUOA', 'SCHL-ANC-1605-LN0N', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1605-LN0N', 'SCHL-ANC-1642-AUOA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1642-AUOA', 'SCHE-ANC-1607-2PA2', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1607-2PA2', 'SCHL-ANC-1642-AUOA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1643-C1WR', 'SCHA-ANC-1627-3YAO', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1627-3YAO', 'SCHA-ANC-1643-C1WR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1643-C1WR', 'SCHA-ANC-1628-XY55', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1628-XY55', 'SCHA-ANC-1643-C1WR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1650-MPEE', 'FREY-ANC-1599-G5F5', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1599-G5F5', 'FREY-ANC-1650-MPEE', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1650-MPEE', 'FREY-ANC-1608-3VFF', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1608-3VFF', 'FREY-ANC-1650-MPEE', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RITT-ANC-1649-EFIA', 'SCHM-ANC-1598-0T8C', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHM-ANC-1598-0T8C', 'RITT-ANC-1649-EFIA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RITT-ANC-1649-EFIA', 'KEIM-ANC-1607-D68V', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KEIM-ANC-1607-D68V', 'RITT-ANC-1649-EFIA', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WASC-ANC-1655-JI0I', 'WASC-ANC-1630-UY5C', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WASC-ANC-1630-UY5C', 'WASC-ANC-1655-JI0I', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NILS-ANC-1607-ZIL9', 'HALV-ANC-1580-9X0D', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HALV-ANC-1580-9X0D', 'NILS-ANC-1607-ZIL9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NILS-ANC-1607-ZIL9', 'LARS-ANC-1585-2X1H', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1585-2X1H', 'NILS-ANC-1607-ZIL9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1615-LVVU', 'BRUN-ANC-1575-MAKD', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1575-MAKD', 'BRUN-ANC-1615-LVVU', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1659-EIZC', 'BRG-ANC-1631-EY51', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRG-ANC-1631-EY51', 'JONS-ANC-1659-EIZC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1659-EIZC', 'TORS-ANC-1632-0AHX', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TORS-ANC-1632-0AHX', 'JONS-ANC-1659-EIZC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1660-ZXL5', 'RBS-ANC-1619-2I6O', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1619-2I6O', 'RBS-ANC-1660-ZXL5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1660-ZXL5', 'HEIL-ANC-1638-6GER', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1638-6GER', 'RBS-ANC-1660-ZXL5', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOFF-ANC-1668-616L', 'CONR-ANC-UNK-O2C0', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CONR-ANC-UNK-O2C0', 'HOFF-ANC-1668-616L', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1630-RKRX', 'KIRC-ANC-1608-HPVL', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KIRC-ANC-1608-HPVL', 'PAUL-ANC-1630-RKRX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1630-RKRX', 'GRET-ANC-1620-NA0Q', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GRET-ANC-1620-NA0Q', 'PAUL-ANC-1630-RKRX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1625-87MC', 'KRM-ANC-1600-LRAW', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1600-LRAW', 'KRM-ANC-1625-87MC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1625-87MC', 'MLL-ANC-1600-UZF0', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MLL-ANC-1600-UZF0', 'KRM-ANC-1625-87MC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHW-ANC-1630-LHAE', 'SCHW-ANC-1600-0NDU', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHW-ANC-1600-0NDU', 'SCHW-ANC-1630-LHAE', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1603-O20E', 'STAP-ANC-1574-WBMY', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1574-WBMY', 'STAP-ANC-1603-O20E', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1603-O20E', 'FOST-ANC-1586-WP83', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FOST-ANC-1586-WP83', 'STAP-ANC-1603-O20E', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1604-2722', 'LEON-ANC-1570-92NO', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEON-ANC-1570-92NO', 'LENN-ANC-1604-2722', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1604-2722', 'BAKE-ANC-1571-GXDA', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BAKE-ANC-1571-GXDA', 'LENN-ANC-1604-2722', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEYG-ANC-1634-CA70', 'WEIG-ANC-1582-9PU0', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIG-ANC-1582-9PU0', 'WEYG-ANC-1634-CA70', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEYG-ANC-1634-CA70', 'FISC-ANC-1590-92AJ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FISC-ANC-1590-92AJ', 'WEYG-ANC-1634-CA70', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1606-1XS9', 'DUNC-ANC-1586-FFU9', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1586-FFU9', 'DUNC-ANC-1606-1XS9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1606-1XS9', 'WECK-ANC-1584-JNN9', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WECK-ANC-1584-JNN9', 'DUNC-ANC-1606-1XS9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1641-ER88', 'HAUE-ANC-1615-BK6E', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1615-BK6E', 'HAUE-ANC-1641-ER88', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1641-ER88', 'SCHW-ANC-1620-N6RE', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHW-ANC-1620-N6RE', 'HAUE-ANC-1641-ER88', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1630-62C2', 'GILH-ANC-1594-UIDH', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILH-ANC-1594-UIDH', 'GILL-ANC-1630-62C2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1630-62C2', 'FOUN-ANC-1594-F0M2', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FOUN-ANC-1594-F0M2', 'GILL-ANC-1630-62C2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1648-YHB6', 'JOHN-ANC-1623-ES8H', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1623-ES8H', 'JOHN-ANC-1648-YHB6', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1643-XTHV', 'LANK-ANC-1620-3UK1', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1620-3UK1', 'LANK-ANC-1643-XTHV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1643-XTHV', 'MORR-ANC-1620-34H8', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MORR-ANC-1620-34H8', 'LANK-ANC-1643-XTHV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JORD-ANC-1640-MV1R', 'JORD-ANC-1600-EI0C', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JORD-ANC-1600-EI0C', 'JORD-ANC-1640-MV1R', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JORD-ANC-1640-MV1R', 'CORK-ANC-1604-A1AE', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CORK-ANC-1604-A1AE', 'JORD-ANC-1640-MV1R', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1650-E99O', 'WEST-ANC-UNK-HHNI', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-UNK-HHNI', 'WEST-ANC-1650-E99O', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1650-E99O', 'WEST-ANC-UNK-C2FE', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-UNK-C2FE', 'WEST-ANC-1650-E99O', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1650-H8KF', 'SHAR-ANC-1622-GKYW', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1622-GKYW', 'SHAR-ANC-1650-H8KF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1650-H8KF', 'SHAR-ANC-1626-FN6A', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1626-FN6A', 'SHAR-ANC-1650-H8KF', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1655-FH6B', 'MICH-ANC-1608-Y7PY', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1608-Y7PY', 'MICH-ANC-1655-FH6B', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1655-FH6B', 'GODI-ANC-1618-TOIR', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GODI-ANC-1618-TOIR', 'MICH-ANC-1655-FH6B', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1641-AMNX', 'ROCH-ANC-1615-URL4', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1615-URL4', 'ROCH-ANC-1641-AMNX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1641-AMNX', 'ROND-ANC-1615-7F6C', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROND-ANC-1615-7F6C', 'ROCH-ANC-1641-AMNX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1607-2PA2', 'SCHE-ANC-1594-ORO8', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1594-ORO8', 'SCHE-ANC-1607-2PA2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1607-2PA2', 'SCHE-ANC-1587-LNXZ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1587-LNXZ', 'SCHE-ANC-1607-2PA2', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1627-3YAO', 'SCHA-ANC-1600-45QO', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1600-45QO', 'SCHA-ANC-1627-3YAO', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1628-XY55', 'SCHA-ANC-UNK-FQIK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-UNK-FQIK', 'SCHA-ANC-1628-XY55', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHM-ANC-1598-0T8C', 'SCHM-ANC-1570-49TQ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHM-ANC-1570-49TQ', 'SCHM-ANC-1598-0T8C', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHM-ANC-1598-0T8C', 'SCHM-ANC-1580-EA9V', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHM-ANC-1580-EA9V', 'SCHM-ANC-1598-0T8C', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KEIM-ANC-1607-D68V', 'KEIM-ANC-1680-3IVS', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KEIM-ANC-1680-3IVS', 'KEIM-ANC-1607-D68V', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KEIM-ANC-1607-D68V', 'MARG-ANC-1681-7FEQ', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARG-ANC-1681-7FEQ', 'KEIM-ANC-1607-D68V', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HALV-ANC-1580-9X0D', 'LARS-ANC-1555-VVGK', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1555-VVGK', 'HALV-ANC-1580-9X0D', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1575-MAKD', 'BRUN-ANC-1540-C7UR', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1540-C7UR', 'BRUN-ANC-1575-MAKD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1575-MAKD', 'BERT-ANC-1545-ETRN', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BERT-ANC-1545-ETRN', 'BRUN-ANC-1575-MAKD', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRG-ANC-1631-EY51', 'JONS-ANC-1596-XCQY', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1596-XCQY', 'BRG-ANC-1631-EY51', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRG-ANC-1631-EY51', 'SIGG-ANC-1605-PO0Q', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SIGG-ANC-1605-PO0Q', 'BRG-ANC-1631-EY51', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1619-2I6O', 'RBS-ANC-1594-7LT7', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1594-7LT7', 'RBS-ANC-1619-2I6O', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1619-2I6O', 'KERC-ANC-1597-NG3E', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KERC-ANC-1597-NG3E', 'RBS-ANC-1619-2I6O', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1638-6GER', 'HEIL-ANC-1598-TZAX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1598-TZAX', 'HEIL-ANC-1638-6GER', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1638-6GER', 'KREC-ANC-1600-4CM1', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KREC-ANC-1600-4CM1', 'HEIL-ANC-1638-6GER', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CONR-ANC-UNK-O2C0', 'KREC-ANC-1612-43YN', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KREC-ANC-1612-43YN', 'CONR-ANC-UNK-O2C0', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FOST-ANC-1586-WP83', 'FOST-ANC-UNK-JOAE', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FOST-ANC-UNK-JOAE', 'FOST-ANC-1586-WP83', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEON-ANC-1570-92NO', 'LEON-ANC-1544-XM2E', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEON-ANC-1544-XM2E', 'LEON-ANC-1570-92NO', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEON-ANC-1570-92NO', 'FIEN-ANC-1540-PU9M', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1540-PU9M', 'LEON-ANC-1570-92NO', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1586-FFU9', 'UFER-ANC-1566-CIMD', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UFER-ANC-1566-CIMD', 'DUNC-ANC-1586-FFU9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1586-FFU9', 'DUNK-ANC-1566-BDAA', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1566-BDAA', 'DUNC-ANC-1586-FFU9', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILH-ANC-1594-UIDH', 'GILL-ANC-1565-67UA', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1565-67UA', 'GILH-ANC-1594-UIDH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILH-ANC-1594-UIDH', 'DENN-ANC-1542-AFQH', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DENN-ANC-1542-AFQH', 'GILH-ANC-1594-UIDH', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1620-3UK1', 'LANK-ANC-1597-93NT', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1597-93NT', 'LANK-ANC-1620-3UK1', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1620-3UK1', 'READ-ANC-1605-CBZU', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('READ-ANC-1605-CBZU', 'LANK-ANC-1620-3UK1', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JORD-ANC-1600-EI0C', 'JORD-ANC-1580-RRR8', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JORD-ANC-1580-RRR8', 'JORD-ANC-1600-EI0C', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1608-Y7PY', 'MICH-ANC-1580-TEUA', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1580-TEUA', 'MICH-ANC-1608-Y7PY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1608-Y7PY', 'SURI-ANC-1580-NF96', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SURI-ANC-1580-NF96', 'MICH-ANC-1608-Y7PY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1594-ORO8', 'SCHE-ANC-1577-THE1', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1577-THE1', 'SCHE-ANC-1594-ORO8', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1594-ORO8', 'WILL-ANC-1577-55R3', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WILL-ANC-1577-55R3', 'SCHE-ANC-1594-ORO8', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1540-C7UR', 'BRUN-ANC-1525-W5LR', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1525-W5LR', 'BRUN-ANC-1540-C7UR', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1596-XCQY', 'MNS-ANC-1570-WXBL', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MNS-ANC-1570-WXBL', 'JONS-ANC-1596-XCQY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1596-XCQY', 'HRD-ANC-1560-ECOL', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HRD-ANC-1560-ECOL', 'JONS-ANC-1596-XCQY', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KERC-ANC-1597-NG3E', 'KERC-ANC-1542-69SV', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KERC-ANC-1542-69SV', 'KERC-ANC-1597-NG3E', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KERC-ANC-1597-NG3E', 'RULO-ANC-1560-ETWX', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RULO-ANC-1560-ETWX', 'KERC-ANC-1597-NG3E', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1598-TZAX', 'HEIL-ANC-1574-ODQ3', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1574-ODQ3', 'HEIL-ANC-1598-TZAX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1598-TZAX', 'HEIL-ANC-1563-NKEM', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1563-NKEM', 'HEIL-ANC-1598-TZAX', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KREC-ANC-1600-4CM1', 'KRAE-ANC-1560-7RJX', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRAE-ANC-1560-7RJX', 'KREC-ANC-1600-4CM1', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEON-ANC-1544-XM2E', 'LENN-ANC-1508-S9AV', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1508-S9AV', 'LEON-ANC-1544-XM2E', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEON-ANC-1544-XM2E', 'HARM-ANC-1520-I4RB', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1520-I4RB', 'LEON-ANC-1544-XM2E', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1540-PU9M', 'FIEN-ANC-1516-TI9A', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1516-TI9A', 'FIEN-ANC-1540-PU9M', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1540-PU9M', 'NEVI-ANC-1520-GUIC', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1520-GUIC', 'FIEN-ANC-1540-PU9M', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MNS-ANC-1570-WXBL', 'KR-ANC-1555-978X', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KR-ANC-1555-978X', 'MNS-ANC-1570-WXBL', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MNS-ANC-1570-WXBL', 'JNS-ANC-1550-2NUC', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1550-2NUC', 'MNS-ANC-1570-WXBL', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HRD-ANC-1560-ECOL', 'PEDE-ANC-1530-8141', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEDE-ANC-1530-8141', 'HRD-ANC-1560-ECOL', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1574-ODQ3', 'HEIL-ANC-1540-GJEL', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1540-GJEL', 'HEIL-ANC-1574-ODQ3', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1563-NKEM', 'HEIL-ANC-1522-U2SQ', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1522-U2SQ', 'HEIL-ANC-1563-NKEM', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1508-S9AV', 'LENN-ANC-1479-QDVB', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1479-QDVB', 'LENN-ANC-1508-S9AV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1508-S9AV', 'WEST-ANC-1484-MJ2S', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1484-MJ2S', 'LENN-ANC-1508-S9AV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1520-I4RB', 'HARM-ANC-1488-83GN', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1488-83GN', 'HARM-ANC-1520-I4RB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1520-I4RB', 'BOTE-ANC-1490-RM7Y', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOTE-ANC-1490-RM7Y', 'HARM-ANC-1520-I4RB', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1516-TI9A', 'FIEN-ANC-1495-XXJG', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1495-XXJG', 'FIEN-ANC-1516-TI9A', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1516-TI9A', 'SUTT-ANC-1490-Q7PY', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SUTT-ANC-1490-Q7PY', 'FIEN-ANC-1516-TI9A', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1520-GUIC', 'NEVI-ANC-1469-LGXC', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1469-LGXC', 'NEVI-ANC-1520-GUIC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1520-GUIC', 'STAF-ANC-1495-4K9D', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAF-ANC-1495-4K9D', 'NEVI-ANC-1520-GUIC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KR-ANC-1555-978X', 'KRAA-ANC-1535-6YA8', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRAA-ANC-1535-6YA8', 'KR-ANC-1555-978X', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEDE-ANC-1530-8141', 'JONS-ANC-1505-C49S', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1505-C49S', 'PEDE-ANC-1530-8141', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEDE-ANC-1530-8141', 'PEDE-ANC-1510-CZJ4', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEDE-ANC-1510-CZJ4', 'PEDE-ANC-1530-8141', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1488-83GN', 'HARM-ANC-1455-Z6X8', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1455-Z6X8', 'HARM-ANC-1488-83GN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1488-83GN', 'NEAL-ANC-1464-CG1H', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEAL-ANC-1464-CG1H', 'HARM-ANC-1488-83GN', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1469-LGXC', 'NEVI-ANC-1440-1AOV', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1440-1AOV', 'NEVI-ANC-1469-LGXC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1469-LGXC', 'FENN-ANC-1444-ACQB', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FENN-ANC-1444-ACQB', 'NEVI-ANC-1469-LGXC', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRAA-ANC-1535-6YA8', 'PVE-ANC-1520-EH2B', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PVE-ANC-1520-EH2B', 'KRAA-ANC-1535-6YA8', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1440-1AOV', 'NEVI-ANC-1412-20R5', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1412-20R5', 'NEVI-ANC-1440-1AOV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1440-1AOV', 'BEAU-ANC-1415-GNK6', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BEAU-ANC-1415-GNK6', 'NEVI-ANC-1440-1AOV', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

