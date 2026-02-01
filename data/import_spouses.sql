-- Import spouse relationships for direct ancestors

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1643-R38D', 'FAVR-ANC-1672-EEJ2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FAVR-ANC-1672-EEJ2', 'EMER-ANC-1643-R38D', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1691-EHNQ', 'GILE-ANC-1718-6VNL', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILE-ANC-1718-6VNL', 'COLE-ANC-1691-EHNQ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1565-67UA', 'DENN-ANC-1542-AFQH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DENN-ANC-1542-AFQH', 'GILL-ANC-1565-67UA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1605-XE4T', 'NILS-ANC-1607-ZIL9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NILS-ANC-1607-ZIL9', 'PERS-ANC-1605-XE4T', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1829-5GK4', 'LARS-ANC-1817-HSJR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1817-HSJR', 'PEHR-ANC-1829-5GK4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1594-ORO8', 'SCHE-ANC-1587-LNXZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1587-LNXZ', 'SCHE-ANC-1594-ORO8', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1685-76KP', 'PAUL-ANC-1685-B4GV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1685-B4GV', 'TURK-ANC-1685-76KP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1738-LJFD', 'ANDE-ANC-1770-8IZK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1770-8IZK', 'ANDE-ANC-1738-LJFD', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1641-ILOC', 'RICH-ANC-1662-TLX8', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RICH-ANC-1662-TLX8', 'BRUN-ANC-1641-ILOC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1690-LQKG', 'BRUN-ANC-1694-439G', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1694-439G', 'EMER-ANC-1690-LQKG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1938-MHPY', 'JOHN-ANC-1945-EWCN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1945-EWCN', 'JOHN-ANC-1938-MHPY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILH-ANC-1594-UIDH', 'FOUN-ANC-1594-F0M2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FOUN-ANC-1594-F0M2', 'GILH-ANC-1594-UIDH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1670-W7BZ', 'BOUR-ANC-1680-9EQ3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOUR-ANC-1680-9EQ3', 'CROS-ANC-1670-W7BZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1913-A224', 'WORS-ANC-1911-WGJL', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WORS-ANC-1911-WGJL', 'SCHO-ANC-1913-A224', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1718-T1NX', 'STAP-ANC-1721-YQMW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1721-YQMW', 'TURK-ANC-1718-T1NX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYR-ANC-1819-6YSK', 'GEUT-ANC-1824-TT16', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1824-TT16', 'MEYR-ANC-1819-6YSK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1650-E99O', 'FLOW-ANC-1659-7BWZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FLOW-ANC-1659-7BWZ', 'WEST-ANC-1650-E99O', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1495-XXJG', 'SUTT-ANC-1490-Q7PY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SUTT-ANC-1490-Q7PY', 'FIEN-ANC-1495-XXJG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1812-6DZT', 'SZE-ANC-1820-L072', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZE-ANC-1820-L072', 'SZEJ-ANC-1812-6DZT', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1817-WXBC', 'LANG-ANC-1823-5X2T', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1823-5X2T', 'JONE-ANC-1817-WXBC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWEN-ANC-1768-C7O2', 'PETT-ANC-1799-JUKI', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PETT-ANC-1799-JUKI', 'SWEN-ANC-1768-C7O2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1627-3YAO', 'SCHA-ANC-1628-XY55', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1628-XY55', 'SCHA-ANC-1627-3YAO', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1650-MPEE', 'RITT-ANC-1649-EFIA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RITT-ANC-1649-EFIA', 'FREY-ANC-1650-MPEE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROLO-ANC-1829-1VZK', 'CURT-ANC-1835-KM82', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CURT-ANC-1835-KM82', 'ROLO-ANC-1829-1VZK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1880-H3EC', 'POSN-ANC-1874-BRV1', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('POSN-ANC-1874-BRV1', 'SCHO-ANC-1880-H3EC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOBS-ANC-1716-UA7B', 'LAWS-ANC-1721-1UTK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWS-ANC-1721-1UTK', 'HOBS-ANC-1716-UA7B', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1734-BJ3P', 'HOBS-ANC-1745-UZJD', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOBS-ANC-1745-UZJD', 'CART-ANC-1734-BJ3P', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1516-TI9A', 'NEVI-ANC-1520-GUIC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1520-GUIC', 'FIEN-ANC-1516-TI9A', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1479-QDVB', 'WEST-ANC-1484-MJ2S', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1484-MJ2S', 'LENN-ANC-1479-QDVB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1785-DQX7', 'BROW-ANC-1785-M9RW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1785-M9RW', 'LOON-ANC-1785-DQX7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1650-MO85', 'MUEL-ANC-1655-X6JY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MUEL-ANC-1655-X6JY', 'TURK-ANC-1650-MO85', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOUA-ANC-1726-DEWU', 'TANN-ANC-1725-UPZB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TANN-ANC-1725-UPZB', 'JOUA-ANC-1726-DEWU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1823-F1E7', 'DERR-ANC-1825-BQ9Q', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERR-ANC-1825-BQ9Q', 'CART-ANC-1823-F1E7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1674-CSB5', 'HITC-ANC-1680-O0D2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HITC-ANC-1680-O0D2', 'TRAC-ANC-1674-CSB5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1750-2VGV', 'JOHN-ANC-1762-M7TY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1762-M7TY', 'SCHL-ANC-1750-2VGV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1648-YHB6', 'GRIF-ANC-1652-B1FQ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GRIF-ANC-1652-B1FQ', 'JOHN-ANC-1648-YHB6', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1580-TEUA', 'SURI-ANC-1580-NF96', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SURI-ANC-1580-NF96', 'MICH-ANC-1580-TEUA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARR-ANC-1696-A6ZW', 'GLEN-ANC-UNK-75MR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GLEN-ANC-UNK-75MR', 'HARR-ANC-1696-A6ZW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1790-O3RR', 'KNAU-ANC-1795-EQMG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNAU-ANC-1795-EQMG', 'GEUT-ANC-1790-O3RR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1750-5I5W', 'CLAN-ANC-1750-34IW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CLAN-ANC-1750-34IW', 'GILL-ANC-1750-5I5W', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPER-ANC-1638-L7MN', 'REMO-ANC-UNK-CILD', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REMO-ANC-UNK-CILD', 'EPER-ANC-1638-L7MN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWR-ANC-1733-GZ6W', 'WOMA-ANC-1733-DPNK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WOMA-ANC-1733-DPNK', 'LAWR-ANC-1733-GZ6W', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1825-4PXN', 'ANDE-ANC-1834-RBGQ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1834-RBGQ', 'ANDE-ANC-1825-4PXN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1693-WIVI', 'KROO-ANC-1709-U2GC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1709-U2GC', 'KROO-ANC-1693-WIVI', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1622-GKYW', 'SHAR-ANC-1626-FN6A', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1626-FN6A', 'SHAR-ANC-1622-GKYW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1852-ZQE9', 'JOHN-ANC-1853-WU2J', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1853-WU2J', 'JOHN-ANC-1852-ZQE9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1872-73C7', 'JONE-ANC-1880-TF3A', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1880-TF3A', 'JOHN-ANC-1872-73C7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1469-LGXC', 'STAF-ANC-1495-4K9D', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAF-ANC-1495-4K9D', 'NEVI-ANC-1469-LGXC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1729-OIJR', 'MOOR-ANC-1729-JCA9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1729-JCA9', 'LOON-ANC-1729-OIJR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WASC-ANC-1655-JI0I', 'HALM-ANC-1657-NNS6', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HALM-ANC-1657-NNS6', 'WASC-ANC-1655-JI0I', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1731-FGV0', 'VON-ANC-1743-QF9F', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VON-ANC-1743-QF9F', 'KROO-ANC-1731-FGV0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALEX-ANC-1627-6A0R', 'VEBV-ANC-1631-QLF3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VEBV-ANC-1631-QLF3', 'ALEX-ANC-1627-6A0R', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1660-OH5Q', 'KRM-ANC-1658-1L8H', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1658-1L8H', 'PAUL-ANC-1660-OH5Q', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1740-ZEAV', 'THOM-ANC-1721-PGIH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1721-PGIH', 'LANG-ANC-1740-ZEAV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1843-PG2B', 'SWAN-ANC-1853-IN3Y', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1853-IN3Y', 'SWAN-ANC-1843-PG2B', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1745-Y0T9', 'DOPP-ANC-1747-G72W', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DOPP-ANC-1747-G72W', 'GEUT-ANC-1745-Y0T9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEW-ANC-1710-DFDK', 'PACE-ANC-1710-A2HG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PACE-ANC-1710-A2HG', 'STEW-ANC-1710-DFDK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GEUT-ANC-1722-2BBB', 'RAUT-ANC-1713-1K45', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RAUT-ANC-1713-1K45', 'GEUT-ANC-1722-2BBB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HART-ANC-1625-6YO4', 'STRI-ANC-1624-3RHR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STRI-ANC-1624-3RHR', 'HART-ANC-1625-6YO4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ZACH-ANC-1785-HOJP', 'JANS-ANC-UNK-P9N6', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JANS-ANC-UNK-P9N6', 'ZACH-ANC-1785-HOJP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1771-F721', 'GILL-ANC-1771-U618', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1771-U618', 'KLEP-ANC-1771-F721', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1760-HEQB', 'HERS-ANC-1761-0F7I', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HERS-ANC-1761-0F7I', 'SZEJ-ANC-1760-HEQB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1789-1QEG', 'GUST-ANC-1789-IJBT', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUST-ANC-1789-IJBT', 'JONS-ANC-1789-1QEG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UFER-ANC-1566-CIMD', 'DUNK-ANC-1566-BDAA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1566-BDAA', 'UFER-ANC-1566-CIMD', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1641-AMNX', 'TRUF-ANC-1641-49SG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRUF-ANC-1641-49SG', 'ROCH-ANC-1641-AMNX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1804-F2II', 'BEAN-ANC-1818-N9IQ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BEAN-ANC-1818-N9IQ', 'WINE-ANC-1804-F2II', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1663-V1M0', 'FREY-ANC-1678-69CU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1678-69CU', 'SCHL-ANC-1663-V1M0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VIA-ANC-1664-HTLJ', 'SPEN-ANC-1664-FSUA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SPEN-ANC-1664-FSUA', 'VIA-ANC-1664-HTLJ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1540-C7UR', 'BERT-ANC-1545-ETRN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BERT-ANC-1545-ETRN', 'BRUN-ANC-1540-C7UR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1703-W4EX', 'TORE-ANC-1714-X6VL', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TORE-ANC-1714-X6VL', 'SEGO-ANC-1703-W4EX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DOPP-ANC-1716-9ICP', 'MAED-ANC-UNK-OJXM', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MAED-ANC-UNK-OJXM', 'DOPP-ANC-1716-9ICP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1599-G5F5', 'FREY-ANC-1608-3VFF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FREY-ANC-1608-3VFF', 'FREY-ANC-1599-G5F5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNAU-ANC-1768-J4S9', 'RENN-ANC-1762-HM36', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RENN-ANC-1762-HM36', 'KNAU-ANC-1768-J4S9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUN-ANC-1615-LVVU', 'BOUS-ANC-1615-ZKAS', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOUS-ANC-1615-ZKAS', 'BRUN-ANC-1615-LVVU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1697-CRDN', 'COLL-ANC-1700-CSN2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLL-ANC-1700-CSN2', 'JOHN-ANC-1697-CRDN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BJOR-ANC-1672-VJRW', 'ANDE-ANC-1690-G0XJ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1690-G0XJ', 'BJOR-ANC-1672-VJRW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1659-EIZC', 'PERS-ANC-1662-QAHR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1662-QAHR', 'JONS-ANC-1659-EIZC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MYER-ANC-1800-KXHF', 'SMIT-ANC-1798-9244', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SMIT-ANC-1798-9244', 'MYER-ANC-1800-KXHF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REED-ANC-1846-HTU2', 'ROUL-ANC-1857-G5T3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROUL-ANC-1857-G5T3', 'REED-ANC-1846-HTU2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHO-ANC-1856-51O3', 'GERS-ANC-1855-ZTJQ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GERS-ANC-1855-ZTJQ', 'SCHO-ANC-1856-51O3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DURK-ANC-1620-ZGHD', 'TRK-ANC-1625-DHSF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRK-ANC-1625-DHSF', 'DURK-ANC-1620-ZGHD', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIN-ANC-1715-GJOJ', 'GFEL-ANC-1721-DQP7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GFEL-ANC-1721-DQP7', 'WEIN-ANC-1715-GJOJ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRG-ANC-1631-EY51', 'TORS-ANC-1632-0AHX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TORS-ANC-1632-0AHX', 'BRG-ANC-1631-EY51', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLSS-ANC-1828-KR0Q', 'JONA-ANC-1831-PPQW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONA-ANC-1831-PPQW', 'OLSS-ANC-1828-KR0Q', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NILS-ANC-1610-DXXS', 'PERS-ANC-1620-UE3W', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1620-UE3W', 'NILS-ANC-1610-DXXS', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1719-MARU', 'JOHN-ANC-1719-3QTY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1719-3QTY', 'GILL-ANC-1719-MARU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1615-BK6E', 'SCHW-ANC-1620-N6RE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHW-ANC-1620-N6RE', 'HAUE-ANC-1615-BK6E', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1642-AUOA', 'SCHA-ANC-1643-C1WR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHA-ANC-1643-C1WR', 'SCHL-ANC-1642-AUOA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1596-XCQY', 'SIGG-ANC-1605-PO0Q', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SIGG-ANC-1605-PO0Q', 'JONS-ANC-1596-XCQY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SMIT-ANC-1768-HNDA', 'LOUD-ANC-1772-KM5K', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOUD-ANC-1772-KM5K', 'SMIT-ANC-1768-HNDA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1642-YHH8', 'MATT-ANC-1655-UWDP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MATT-ANC-1655-UWDP', 'MICH-ANC-1642-YHH8', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1734-ADQX', 'EPPE-ANC-1734-RCJA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1734-RCJA', 'EPPE-ANC-1734-ADQX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MNS-ANC-1570-WXBL', 'HRD-ANC-1560-ECOL', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HRD-ANC-1560-ECOL', 'MNS-ANC-1570-WXBL', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLIP-ANC-1741-5R3K', 'KLEP-ANC-1743-9WQ5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1743-9WQ5', 'KLIP-ANC-1741-5R3K', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1687-X9XN', 'VIA-ANC-1687-BAWH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('VIA-ANC-1687-BAWH', 'THOM-ANC-1687-X9XN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KR-ANC-1555-978X', 'JNS-ANC-1550-2NUC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1550-2NUC', 'KR-ANC-1555-978X', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HANS-ANC-1590-8Q1T', 'ANDE-ANC-1600-YEES', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1600-YEES', 'HANS-ANC-1590-8Q1T', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1686-BZDR', 'WOOD-ANC-1691-3BCM', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WOOD-ANC-1691-3BCM', 'SHAR-ANC-1686-BZDR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RENN-ANC-UNK-ZJZP', 'BUCH-ANC-UNK-WVL5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BUCH-ANC-UNK-WVL5', 'RENN-ANC-UNK-ZJZP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1750-18KE', 'FEAM-ANC-1757-796U', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FEAM-ANC-1757-796U', 'BROW-ANC-1750-18KE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1650-H8KF', 'HATC-ANC-1665-MPS4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HATC-ANC-1665-MPS4', 'SHAR-ANC-1650-H8KF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1505-C49S', 'PEDE-ANC-1510-CZJ4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEDE-ANC-1510-CZJ4', 'JONS-ANC-1505-C49S', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1698-RHZC', 'STEI-ANC-1692-LBH5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1692-LBH5', 'HAUE-ANC-1698-RHZC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYE-ANC-1757-SMHF', 'GERD-ANC-1779-P5WS', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GERD-ANC-1779-P5WS', 'MEYE-ANC-1757-SMHF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1615-URL4', 'ROND-ANC-1615-7F6C', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROND-ANC-1615-7F6C', 'ROCH-ANC-1615-URL4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1751-QGIK', 'LOON-ANC-1755-JRXR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1755-JRXR', 'LOON-ANC-1751-QGIK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOON-ANC-1692-UFPY', 'BARB-ANC-1696-E9KK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BARB-ANC-1696-E9KK', 'LOON-ANC-1692-UFPY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1647-ZJ5N', 'GUTB-ANC-1655-F0OQ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUTB-ANC-1655-F0OQ', 'STEI-ANC-1647-ZJ5N', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1791-4AYE', 'LABR-ANC-1802-JOSM', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABR-ANC-1802-JOSM', 'SAUV-ANC-1791-4AYE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1412-20R5', 'BEAU-ANC-1415-GNK6', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BEAU-ANC-1415-GNK6', 'NEVI-ANC-1412-20R5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1700-Q5A1', 'SHAR-ANC-1720-AZOF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHAR-ANC-1720-AZOF', 'LANK-ANC-1700-Q5A1', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1724-7MVN', 'MONT-ANC-1728-N5KD', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MONT-ANC-1728-N5KD', 'LEWI-ANC-1724-7MVN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1795-LPRH', 'KROS-ANC-1820-377W', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROS-ANC-1820-377W', 'KROO-ANC-1795-LPRH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1655-FH6B', 'SEVE-ANC-1655-ZA84', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEVE-ANC-1655-ZA84', 'MICH-ANC-1655-FH6B', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1670-5UK5', 'PETR-ANC-1670-GMZR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PETR-ANC-1670-GMZR', 'HAUE-ANC-1670-5UK5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIC-ANC-1776-E7BM', 'RIEK-ANC-1784-0AML', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RIEK-ANC-1784-0AML', 'WEIC-ANC-1776-E7BM', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROZE-ANC-1820-FN43', 'UNK-ANC-1820-6DB3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1820-6DB3', 'ROZE-ANC-1820-FN43', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1655-99T9', 'MCKN-ANC-1650-3HUU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MCKN-ANC-1650-3HUU', 'WALK-ANC-1655-99T9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1897-X18S', 'JOHN-ANC-1909-2ZZJ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1909-2ZZJ', 'JOHN-ANC-1897-X18S', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1793-4DQZ', 'KLEP-ANC-1801-JC3T', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1801-JC3T', 'JONE-ANC-1793-4DQZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENGE-ANC-1652-HFYP', 'ANDE-ANC-1659-WXVA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1659-WXVA', 'ENGE-ANC-1652-HFYP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1641-ER88', 'STOB-ANC-1642-UJSB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STOB-ANC-1642-UJSB', 'HAUE-ANC-1641-ER88', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HALV-ANC-1580-9X0D', 'LARS-ANC-1585-2X1H', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1585-2X1H', 'HALV-ANC-1580-9X0D', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STEI-ANC-1603-VC8U', 'MAIE-ANC-1605-OAJK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MAIE-ANC-1605-OAJK', 'STEI-ANC-1603-VC8U', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUTB-ANC-1626-L20U', 'FROM-ANC-1631-BKS2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FROM-ANC-1631-BKS2', 'GUTB-ANC-1626-L20U', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1768-CP76', 'ENYA-ANC-1762-0MTF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYA-ANC-1762-0MTF', 'CATE-ANC-1768-CP76', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLSS-ANC-1690-B6CF', 'BORJ-ANC-1700-3VFF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BORJ-ANC-1700-3VFF', 'OLSS-ANC-1690-B6CF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1745-EAOA', 'DUNK-ANC-1740-8YTX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1740-8YTX', 'WINE-ANC-1745-EAOA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANG-ANC-1761-PJD6', 'EPPE-ANC-1770-0HH6', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1770-0HH6', 'LANG-ANC-1761-PJD6', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHN-ANC-1742-4S52', 'EVAN-ANC-1749-4NZG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1749-4NZG', 'JOHN-ANC-1742-4S52', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1677-8ZLZ', 'NEWT-ANC-1685-9HUZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEWT-ANC-1685-9HUZ', 'WYAT-ANC-1677-8ZLZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1703-UZ4P', 'MIEH-ANC-1707-0G8Y', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MIEH-ANC-1707-0G8Y', 'EPPE-ANC-1703-UZ4P', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1787-J897', 'CATE-ANC-1800-04AN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1800-04AN', 'CART-ANC-1787-J897', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1753-KOAV', 'LAWR-ANC-1753-YWJB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWR-ANC-1753-YWJB', 'CATE-ANC-1753-KOAV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABR-ANC-1772-PFYP', 'LERO-ANC-1778-QUH5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LERO-ANC-1778-QUH5', 'LABR-ANC-1772-PFYP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEVI-ANC-1440-1AOV', 'FENN-ANC-1444-ACQB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FENN-ANC-1444-ACQB', 'NEVI-ANC-1440-1AOV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JANE-ANC-1853-TOJK', 'WINN-ANC-1857-JIAE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINN-ANC-1857-JIAE', 'JANE-ANC-1853-TOJK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JORD-ANC-1600-EI0C', 'CORK-ANC-1604-A1AE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CORK-ANC-1604-A1AE', 'JORD-ANC-1600-EI0C', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1650-Z2QI', 'WARN-ANC-UNK-GTW4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WARN-ANC-UNK-GTW4', 'TRAC-ANC-1650-Z2QI', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1600-LRAW', 'MLL-ANC-1600-UZF0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MLL-ANC-1600-UZF0', 'KRM-ANC-1600-LRAW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHM-ANC-1598-0T8C', 'KEIM-ANC-1607-D68V', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KEIM-ANC-1607-D68V', 'SCHM-ANC-1598-0T8C', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1577-THE1', 'WILL-ANC-1577-55R3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WILL-ANC-1577-55R3', 'SCHE-ANC-1577-THE1', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARI-ANC-1759-4NNR', 'PELL-ANC-1761-0489', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PELL-ANC-1761-0489', 'MARI-ANC-1759-4NNR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GODS-ANC-1631-IFNW', 'KIRS-ANC-1665-8BC0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KIRS-ANC-1665-8BC0', 'GODS-ANC-1631-IFNW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EPPE-ANC-1659-1KQX', 'ALEX-ANC-1653-3PJ3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALEX-ANC-1653-3PJ3', 'EPPE-ANC-1659-1KQX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BORG-ANC-UNK-AJM6', 'KIER-ANC-UNK-SKA4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KIER-ANC-UNK-SKA4', 'BORG-ANC-UNK-AJM6', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FORS-ANC-1667-XKL3', 'LANC-ANC-1665-JMRG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANC-ANC-1665-JMRG', 'FORS-ANC-1667-XKL3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1670-9OA2', 'GARR-ANC-1675-MZ9R', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GARR-ANC-1675-MZ9R', 'COLE-ANC-1670-9OA2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SIEG-ANC-1624-2SFO', 'RIEH-ANC-1632-RD58', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RIEH-ANC-1632-RD58', 'SIEG-ANC-1624-2SFO', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1666-YKP7', 'HENR-ANC-1690-5HL9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HENR-ANC-1690-5HL9', 'GILL-ANC-1666-YKP7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EMER-ANC-1725-NQCG', 'PELL-ANC-1752-R6ZA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PELL-ANC-1752-R6ZA', 'EMER-ANC-1725-NQCG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLIP-ANC-1715-PHYN', 'HALF-ANC-1718-EGVT', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HALF-ANC-1718-EGVT', 'KLIP-ANC-1715-PHYN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1683-AG5P', 'BARD-ANC-1691-2UV1', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BARD-ANC-1691-2UV1', 'SAUV-ANC-1683-AG5P', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-UNK-HHNI', 'WEST-ANC-UNK-C2FE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-UNK-C2FE', 'WEST-ANC-UNK-HHNI', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1645-U1PR', 'PATE-ANC-1652-G93U', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PATE-ANC-1652-G93U', 'WYAT-ANC-1645-U1PR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1619-2I6O', 'HEIL-ANC-1638-6GER', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1638-6GER', 'RBS-ANC-1619-2I6O', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1660-ZXL5', 'HOFF-ANC-1668-616L', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOFF-ANC-1668-616L', 'RBS-ANC-1660-ZXL5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1720-B8X7', 'HARR-ANC-1723-1PZH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARR-ANC-1723-1PZH', 'BROW-ANC-1720-B8X7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEYG-ANC-1634-CA70', 'FADI-ANC-1617-95PU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FADI-ANC-1617-95PU', 'WEYG-ANC-1634-CA70', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEBR-ANC-1737-0XC5', 'ROYE-ANC-1743-VO63', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROYE-ANC-1743-VO63', 'LEBR-ANC-1737-0XC5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LERO-ANC-1722-HKBI', 'GUY-ANC-1743-N9FN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUY-ANC-1743-N9FN', 'LERO-ANC-1722-HKBI', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARR-ANC-UNK-4OT6', 'HUBE-ANC-UNK-6WMY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HUBE-ANC-UNK-6WMY', 'MARR-ANC-UNK-4OT6', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GUIL-ANC-1716-IKRR', 'RACI-ANC-1721-MT3J', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RACI-ANC-1721-MT3J', 'GUIL-ANC-1716-IKRR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1682-0P0M', 'GODS-ANC-1680-QZ6K', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GODS-ANC-1680-QZ6K', 'DUNK-ANC-1682-0P0M', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PRIE-ANC-1841-650O', 'PRIE-ANC-1849-WHJO', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PRIE-ANC-1849-WHJO', 'PRIE-ANC-1841-650O', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1770-NAP4', 'JONE-ANC-1772-2ETV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONE-ANC-1772-2ETV', 'JONE-ANC-1770-NAP4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEON-ANC-1570-92NO', 'BAKE-ANC-1571-GXDA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BAKE-ANC-1571-GXDA', 'LEON-ANC-1570-92NO', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ZACH-ANC-1873-H0TB', 'REID-ANC-1881-CDW2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REID-ANC-1881-CDW2', 'ZACH-ANC-1873-H0TB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1606-1XS9', 'LISG-ANC-1610-BSNX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LISG-ANC-1610-BSNX', 'DUNC-ANC-1606-1XS9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1750-S0Q4', 'BUSB-ANC-1752-YK68', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BUSB-ANC-1752-YK68', 'LEWI-ANC-1750-S0Q4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MYER-ANC-1854-IWS9', 'KROO-ANC-1867-MZYZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KROO-ANC-1867-MZYZ', 'MYER-ANC-1854-IWS9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERK-ANC-1740-XCZY', 'DUNK-ANC-1742-FX9H', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1742-FX9H', 'DERK-ANC-1740-XCZY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DERR-ANC-1783-IS3D', 'WINS-ANC-1789-BL09', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINS-ANC-1789-BL09', 'DERR-ANC-1783-IS3D', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1680-7LCT', 'RUTH-ANC-1682-C232', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RUTH-ANC-1682-C232', 'WALK-ANC-1680-7LCT', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CUMM-ANC-1824-VZA7', 'UNK-ANC-1826-2PJH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1826-2PJH', 'CUMM-ANC-1824-VZA7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROTK-ANC-1620-QHKH', 'KARL-ANC-1625-EXAO', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KARL-ANC-1625-EXAO', 'ROTK-ANC-1620-QHKH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARI-ANC-1721-1LXH', 'BRUS-ANC-1735-F2ZA', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRUS-ANC-1735-F2ZA', 'MARI-ANC-1721-1LXH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1796-KBHP', 'JOHA-ANC-1805-3RO0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JOHA-ANC-1805-3RO0', 'ANDE-ANC-1796-KBHP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRM-ANC-1625-87MC', 'SCHW-ANC-1630-LHAE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHW-ANC-1630-LHAE', 'KRM-ANC-1625-87MC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1709-CJFJ', 'SCHL-ANC-1713-LIDG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1713-LIDG', 'SCHL-ANC-1709-CJFJ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1644-4VI5', 'GAGE-ANC-1665-FUR1', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GAGE-ANC-1665-FUR1', 'STAP-ANC-1644-4VI5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1667-H623', 'RAND-ANC-UNK-1YSZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RAND-ANC-UNK-1YSZ', 'CATE-ANC-1667-H623', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STR-ANC-1751-6YY1', 'GERL-ANC-1756-2FS3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GERL-ANC-1756-2FS3', 'STR-ANC-1751-6YY1', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1734-5369', 'ANDE-ANC-1744-DR3X', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1744-DR3X', 'SEGO-ANC-1734-5369', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1598-TZAX', 'KREC-ANC-1600-4CM1', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KREC-ANC-1600-4CM1', 'HEIL-ANC-1598-TZAX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RBS-ANC-1594-7LT7', 'KERC-ANC-1597-NG3E', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KERC-ANC-1597-NG3E', 'RBS-ANC-1594-7LT7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WINE-ANC-1782-4G8Y', 'SHLU-ANC-1780-XL4Y', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SHLU-ANC-1780-XL4Y', 'WINE-ANC-1782-4G8Y', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1759-BQJT', 'RICH-ANC-1762-YS7I', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RICH-ANC-1762-YS7I', 'SAUV-ANC-1759-BQJT', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('THOM-ANC-1650-WW1X', 'UNK-ANC-UNK-21FL', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-UNK-21FL', 'THOM-ANC-1650-WW1X', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1574-ODQ3', 'HEIL-ANC-1563-NKEM', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HEIL-ANC-1563-NKEM', 'HEIL-ANC-1574-ODQ3', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KERC-ANC-1542-69SV', 'RULO-ANC-1560-ETWX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RULO-ANC-1560-ETWX', 'KERC-ANC-1542-69SV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1630-RKRX', 'PAUL-ANC-1640-A417', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PAUL-ANC-1640-A417', 'PAUL-ANC-1630-RKRX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REED-ANC-1820-SIGZ', 'UNK-ANC-1821-YEBR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1821-YEBR', 'REED-ANC-1820-SIGZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1755-6PYK', 'JNS-ANC-1750-HG8B', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1750-HG8B', 'ANDE-ANC-1755-6PYK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WASC-ANC-1675-3DQG', 'ACHE-ANC-1673-AN8J', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ACHE-ANC-1673-AN8J', 'WASC-ANC-1675-3DQG', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1700-RDBU', 'TRAC-ANC-1701-NU0H', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TRAC-ANC-1701-NU0H', 'CROS-ANC-1700-RDBU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CHRI-ANC-1734-3WNK', 'SAVE-ANC-1734-PX5P', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAVE-ANC-1734-PX5P', 'CHRI-ANC-1734-3WNK', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COUT-ANC-1698-KWY5', 'BOUF-ANC-1691-87BV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOUF-ANC-1691-87BV', 'COUT-ANC-1698-KWY5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BROW-ANC-1693-ZON0', 'REYN-ANC-1697-6EW4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('REYN-ANC-1697-6EW4', 'BROW-ANC-1693-ZON0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1508-S9AV', 'HARM-ANC-1520-I4RB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1520-I4RB', 'LENN-ANC-1508-S9AV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHL-ANC-1605-LN0N', 'SCHE-ANC-1607-2PA2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHE-ANC-1607-2PA2', 'SCHL-ANC-1605-LN0N', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNOS-ANC-1830-94AH', 'KNOS-ANC-1844-2R7U', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KNOS-ANC-1844-2R7U', 'KNOS-ANC-1830-94AH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEWT-ANC-1657-PEPS', 'ALLE-ANC-1664-9AZV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALLE-ANC-1664-9AZV', 'NEWT-ANC-1657-PEPS', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1690-83XD', 'TURK-ANC-1692-CEQ7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('TURK-ANC-1692-CEQ7', 'STAP-ANC-1690-83XD', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1645-07RB', 'HART-ANC-1647-RNR2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HART-ANC-1647-RNR2', 'DUNC-ANC-1645-07RB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1675-0PW8', 'WEST-ANC-1675-YL5Z', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEST-ANC-1675-YL5Z', 'LANK-ANC-1675-0PW8', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNC-ANC-1586-FFU9', 'WECK-ANC-1584-JNN9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WECK-ANC-1584-JNN9', 'DUNC-ANC-1586-FFU9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEP-ANC-1693-2DQS', 'WAMB-ANC-1693-PX5D', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WAMB-ANC-1693-PX5D', 'KLEP-ANC-1693-2DQS', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ACHE-ANC-1637-6KHV', 'WIRT-ANC-1641-D48N', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WIRT-ANC-1641-D48N', 'ACHE-ANC-1637-6KHV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MEYE-ANC-1791-HN7U', 'BARR-ANC-1795-MDAJ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BARR-ANC-1795-MDAJ', 'MEYE-ANC-1791-HN7U', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1603-O20E', 'LENN-ANC-1604-2722', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LENN-ANC-1604-2722', 'STAP-ANC-1603-O20E', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HALF-ANC-1692-M1MW', 'RASM-ANC-1696-RMDM', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('RASM-ANC-1696-RMDM', 'HALF-ANC-1692-M1MW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PERS-ANC-1684-YVWH', 'OLOF-ANC-1693-8983', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('OLOF-ANC-1693-8983', 'PERS-ANC-1684-YVWH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DUNK-ANC-1705-9DWW', 'HAUE-ANC-1720-B9SS', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HAUE-ANC-1720-B9SS', 'DUNK-ANC-1705-9DWW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1811-GS79', 'LARS-ANC-1803-E6HR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1803-E6HR', 'LARS-ANC-1811-GS79', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CART-ANC-1755-ULYP', 'ALLE-ANC-1764-2CC2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ALLE-ANC-1764-2CC2', 'CART-ANC-1755-ULYP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAUT-ANC-1717-U0A1', 'KLEI-ANC-1722-650B', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KLEI-ANC-1722-650B', 'LAUT-ANC-1717-U0A1', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KIRC-ANC-1608-HPVL', 'GRET-ANC-1620-NA0Q', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GRET-ANC-1620-NA0Q', 'KIRC-ANC-1608-HPVL', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1726-4D4Y', 'BRAT-ANC-1733-RS77', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRAT-ANC-1733-RS77', 'PEHR-ANC-1726-4D4Y', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CATE-ANC-1700-C50L', 'WYAT-ANC-1702-D9H8', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYAT-ANC-1702-D9H8', 'CATE-ANC-1700-C50L', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1608-Y7PY', 'GODI-ANC-1618-TOIR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GODI-ANC-1618-TOIR', 'MICH-ANC-1608-Y7PY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIG-ANC-1656-VY6D', 'UNK-ANC-1656-REJZ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('UNK-ANC-1656-REJZ', 'WEIG-ANC-1656-VY6D', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHM-ANC-1570-49TQ', 'SCHM-ANC-1580-EA9V', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SCHM-ANC-1580-EA9V', 'SCHM-ANC-1570-49TQ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRAT-ANC-1702-BX0P', 'LABE-ANC-1703-PJSV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LABE-ANC-1703-PJSV', 'BRAT-ANC-1702-BX0P', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WAHL-ANC-1677-V1NS', 'LARS-ANC-1690-6JV6', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LARS-ANC-1690-6JV6', 'WAHL-ANC-1677-V1NS', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SZEJ-ANC-1837-XGCC', 'ROZE-ANC-1837-8Y8W', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROZE-ANC-1837-8Y8W', 'SZEJ-ANC-1837-XGCC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('STAP-ANC-1574-WBMY', 'FOST-ANC-1586-WP83', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FOST-ANC-1586-WP83', 'STAP-ANC-1574-WBMY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1597-93NT', 'READ-ANC-1605-CBZU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('READ-ANC-1605-CBZU', 'LANK-ANC-1597-93NT', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1680-AG5V', 'WALS-ANC-1680-AOB9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALS-ANC-1680-AOB9', 'LEWI-ANC-1680-AG5V', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1721-555U', 'BRJ-ANC-1729-UZZR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRJ-ANC-1729-UZZR', 'ANDE-ANC-1721-555U', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LOUD-ANC-1746-HOTD', 'HOAR-ANC-1748-LDPS', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HOAR-ANC-1748-LDPS', 'LOUD-ANC-1746-HOTD', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYA-ANC-1739-XCZ0', 'GRIF-ANC-1740-U92I', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GRIF-ANC-1740-U92I', 'ENYA-ANC-1739-XCZ0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1886-HXS4', 'SWAN-ANC-1887-77LR', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SWAN-ANC-1887-77LR', 'SWAN-ANC-1886-HXS4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MICH-ANC-1672-VPGX', 'ROCH-ANC-1667-6PA4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ROCH-ANC-1667-6PA4', 'MICH-ANC-1672-VPGX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LAWS-ANC-1690-Z5AE', 'DEW-ANC-1700-DAZI', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('DEW-ANC-1700-DAZI', 'LAWS-ANC-1690-Z5AE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ANDE-ANC-1758-QL14', 'SEGO-ANC-1762-PR0D', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SEGO-ANC-1762-PR0D', 'ANDE-ANC-1758-QL14', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1711-MZUB', 'WALK-ANC-1712-9R5X', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WALK-ANC-1712-9R5X', 'MOOR-ANC-1711-MZUB', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1645-QFIX', 'PROT-ANC-1649-97HP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PROT-ANC-1649-97HP', 'LEWI-ANC-1645-QFIX', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1455-Z6X8', 'NEAL-ANC-1464-CG1H', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NEAL-ANC-1464-CG1H', 'HARM-ANC-1455-Z6X8', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WEIG-ANC-1582-9PU0', 'FISC-ANC-1590-92AJ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FISC-ANC-1590-92AJ', 'WEIG-ANC-1582-9PU0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1620-3UK1', 'MORR-ANC-1620-34H8', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MORR-ANC-1620-34H8', 'LANK-ANC-1620-3UK1', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ENYE-ANC-1713-Y2NM', 'BRIN-ANC-1716-4K11', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BRIN-ANC-1716-4K11', 'ENYE-ANC-1713-Y2NM', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CLAN-ANC-1709-58AL', 'WYCH-ANC-1722-BK35', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('WYCH-ANC-1722-BK35', 'CLAN-ANC-1709-58AL', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KEIM-ANC-1680-3IVS', 'MARG-ANC-1681-7FEQ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MARG-ANC-1681-7FEQ', 'KEIM-ANC-1680-3IVS', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HARM-ANC-1488-83GN', 'BOTE-ANC-1490-RM7Y', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOTE-ANC-1490-RM7Y', 'HARM-ANC-1488-83GN', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MOOR-ANC-1683-YO8T', 'FORS-ANC-1695-KBR8', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FORS-ANC-1695-KBR8', 'MOOR-ANC-1683-YO8T', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1694-LRJ9', 'BUSB-ANC-1699-3XFJ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BUSB-ANC-1699-3XFJ', 'LEWI-ANC-1694-LRJ9', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('KRUS-ANC-1763-YERU', 'MANG-ANC-1764-BTAU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MANG-ANC-1764-BTAU', 'KRUS-ANC-1763-YERU', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('NILS-ANC-1744-0TBC', 'ERSD-ANC-UNK-ZUTP', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('ERSD-ANC-UNK-ZUTP', 'NILS-ANC-1744-0TBC', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('SAUV-ANC-1728-WLJT', 'COUT-ANC-1728-KC8D', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COUT-ANC-1728-KC8D', 'SAUV-ANC-1728-WLJT', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('CROS-ANC-1730-7OPQ', 'COLE-ANC-1733-FFBY', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('COLE-ANC-1733-FFBY', 'CROS-ANC-1730-7OPQ', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('GILL-ANC-1630-62C2', 'HENS-ANC-1614-NXT4', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('HENS-ANC-1614-NXT4', 'GILL-ANC-1630-62C2', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1687-JGW7', 'MILE-ANC-1693-TB56', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('MILE-ANC-1693-TB56', 'EVAN-ANC-1687-JGW7', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEON-ANC-1544-XM2E', 'FIEN-ANC-1540-PU9M', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('FIEN-ANC-1540-PU9M', 'LEON-ANC-1544-XM2E', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EVAN-ANC-1721-1UM0', 'LEWI-ANC-1723-YK41', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1723-YK41', 'EVAN-ANC-1721-1UM0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1751-2JQM', 'EBBE-ANC-1757-RF8L', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('EBBE-ANC-1757-RF8L', 'JNS-ANC-1751-2JQM', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BENG-ANC-1785-DVOW', 'PEHR-ANC-1785-8PAM', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('PEHR-ANC-1785-8PAM', 'BENG-ANC-1785-DVOW', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JONS-ANC-1717-WCH5', 'JNS-ANC-1718-W5BE', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JNS-ANC-1718-W5BE', 'JONS-ANC-1717-WCH5', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LEWI-ANC-1674-PJD0', 'POWE-ANC-1679-MTGH', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('POWE-ANC-1679-MTGH', 'LEWI-ANC-1674-PJD0', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('LANK-ANC-1643-XTHV', 'JORD-ANC-1640-MV1R', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('JORD-ANC-1640-MV1R', 'LANK-ANC-1643-XTHV', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BOAR-ANC-UNK-ISCO', 'BEAR-ANC-1650-CCXF', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES
  ('BEAR-ANC-1650-CCXF', 'BOAR-ANC-UNK-ISCO', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;

