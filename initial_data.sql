-- Initial Data Load: Johnson Family Research Database
-- Sources and People from Early Johnson Timeline analysis

-- ============================================
-- SOURCES
-- ============================================

INSERT INTO sources (id, source_type, title, author, abbreviation, notes) VALUES
    ('a0000001-0000-0000-0000-000000000001', 'book', 'Cavaliers & Pioneers Vol. 1', 'Nugent, Nell Marion', 'CPv1', 'Virginia Land Patents 1623-1666'),
    ('a0000001-0000-0000-0000-000000000002', 'book', 'Cavaliers & Pioneers Vol. 2', 'Nugent, Nell Marion', 'CPv2', 'Virginia Land Patents 1666-1695'),
    ('a0000001-0000-0000-0000-000000000003', 'book', 'Cavaliers & Pioneers Vol. 3', 'Nugent, Nell Marion', 'CPv3', 'Virginia Land Patents 1695-1732'),
    ('a0000001-0000-0000-0000-000000000004', 'book', 'Cavaliers & Pioneers Vol. 4', NULL, 'CPv4', 'Virginia Land Patents 1732-1741'),
    ('a0000001-0000-0000-0000-000000000005', 'book', 'Cavaliers & Pioneers Vol. 5', NULL, 'CPv5', 'Virginia Land Patents 1741-1749'),
    ('a0000001-0000-0000-0000-000000000006', 'book', 'Cavaliers & Pioneers Vol. 6', NULL, 'CPv6', 'Virginia Land Patents 1749-1762'),
    ('a0000001-0000-0000-0000-000000000007', 'book', 'Cavaliers & Pioneers Vol. 7', NULL, 'CPv7', 'Virginia Land Patents 1762-1776'),
    ('a0000001-0000-0000-0000-000000000008', 'document_collection', 'Early Johnson Timeline in Virginia', 'Starr, Linda Sparks', NULL, 'Extraction of all Johnson/Johnston references from CPv1-7, July 2002'),
    ('a0000001-0000-0000-0000-000000000009', 'personal_research', 'Tony L. Johnson Research Files', 'Johnson, Tony L.', NULL, 'Lifetime compilation of Johnson family research'),
    ('a0000001-0000-0000-0000-000000000010', 'dna_project', 'Johnson/Johnston DNA Project', NULL, NULL, 'https://www.familytreedna.com/public/Johnson');

-- ============================================
-- PEOPLE - JOHNSONS
-- ============================================

INSERT INTO people (id, surname, given_name, suffix, title, designation, occupation, birth_year, birth_year_type, birthplace_code, birthplace_detail, death_year, death_year_type, death_place_code, death_place_detail, confidence, dna_group, dna_status, first_documented_date, bio) VALUES

-- Pre-1650 Johnsons
('JNSN-ENG-e1590-01', 'Johnson', 'John', NULL, NULL, 'Ancient Planter', 'yeoman, planter', 1590, 'e', 'ENG', NULL, 1638, 'e', 'JCC', 'James City County', 'CONFIRMED', NULL, NULL, '1624-01-12', 'Earliest documented Johnson in Virginia. Designated "yeoman and ancient planter" indicating arrival before 1616. Received 100 acres at Archer''s Hope Creek on January 12, 1624. His daughter married Edward Travis. His son John Jr. inherited as "son & heir."'),

('JNSN-JCC-e1615-01', 'Johnson', 'John', 'Jr.', NULL, NULL, 'planter', 1615, 'e', 'JCC', 'James City County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1638', 'Son and heir of John Johnson "Ancient Planter." Received 900 acres at head of Upper Chippokes Creek in 1638 with wife and 3 children. Patent renewed 1654 and 1662 at Archer''s Hope Creek.'),

('JNSN-ENG-e1600-01', 'Johnson', 'Edward', NULL, NULL, NULL, 'yeoman', 1600, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1627-11', 'Received 50 acres at Strawberry Banks, Elizabeth City County, November 1627. Described as "yeoman."'),

('JNSN-ENG-e1605-01', 'Johnson', 'Mark', NULL, NULL, NULL, NULL, 1605, 'e', 'ENG', NULL, 1696, 'e', 'ECC', 'Elizabeth City County', 'CONFIRMED', NULL, NULL, '1639-10', 'Received 50 acres at Back River, Elizabeth City County, October 1639. Additional 198 acres July 1645. Father of Philip Johnson who received 400 acres in 1696 "granted Marke Johnson, His father."'),

('JNSN-ECC-e1640-01', 'Johnson', 'Philip', NULL, NULL, NULL, NULL, 1640, 'e', 'ECC', 'Elizabeth City County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1696-10', 'Son of Mark Johnson. Received 400 acres October 1696 that had been granted to his father.'),

('JNSN-ENG-e1600-02', 'Johnson', 'Peter', NULL, NULL, NULL, NULL, 1600, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1636-06', 'Received 600 acres in Warrosquoyacke County June 1636 on S side of Warrisquick Creek. Additional 200 acres at New Towne Haven River May 1642.'),

('JNSN-ENG-e1600-03', 'Johnson', 'Joseph', NULL, NULL, NULL, NULL, 1600, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1635-06', 'Substantial early landholder. Received 400 acres in Nansemond County June 1635. Transported his wife Elizabeth and 7 servants.'),

('JNSN-ENG-e1615-02', 'Johnson', 'Israel', NULL, NULL, NULL, NULL, 1615, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1652-05', 'Received 200 acres on NW branch of Nansemond River May 1652, renewed February 1663. Transported Eliza Johnson.'),

('JNSN-ENG-e1610-01', 'Johnson', 'Henry', NULL, NULL, NULL, NULL, 1610, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'PROBABLE', NULL, NULL, '1637-08', 'Transported with wife Grace in August 1637 by Richard Bennet.'),

('JNSN-ENG-e1620-01', 'Johnson', 'John', NULL, NULL, NULL, 'cooper', 1620, 'e', 'ENG', NULL, 1682, 'e', 'NFK', 'Lower Norfolk County, Linhaven Parish', 'CONFIRMED', NULL, NULL, '1682', 'Cooper in Linhaven Parish. Died before 1682; his daughters Jean and Grace Johnson inherited 100 acres that year.'),

('JNSN-ENG-e1635-01', 'Johnson', 'Jacob', NULL, NULL, NULL, NULL, 1635, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1673-05-27', 'Major landholder. 600 acres at Little Creek, Linhaven Parish May 1673. Also 740 acres in Gloucester County, Kingston Parish March 1675.'),

-- Col. Richard Johnson line
('JNSN-ENG-e1640-01', 'Johnson', 'Richard', NULL, 'Mr.', NULL, NULL, 1640, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1679-05', 'Received 523 acres on NE side Matapony River, New Kent County, May 1679. Transported 11 persons.'),

('JNSN-ENG-e1640-02', 'Johnson', 'Richard', NULL, 'Col.', NULL, NULL, 1640, 'e', 'ENG', NULL, 1705, 'e', 'KWM', 'King William County', 'CONFIRMED', NULL, NULL, '1683-04', 'Major figure. 1150 acres with John Pigg April 1683. 3285 acres in Pamunkey Neck October 1695. His heir William Johnson received 4900 acres by will in 1705.'),

('JNSN-KWM-e1675-01', 'Johnson', 'William', NULL, NULL, NULL, NULL, 1675, 'e', 'KWM', 'King William County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1705-05', 'Heir of Col. Richard Johnson. Received 4900 acres in King William County May 1705 "Given him by will of Col. Richard Johnson."'),

-- Michael Johnson / White Oak line
('JNSN-UNK-e1673-01', 'Johnson', 'Michael', NULL, NULL, 'of Tuckahoe Creek', NULL, 1673, 'e', 'UNK', NULL, 1718, 'b', 'HEN', 'Henrico County, Tuckahoe Creek', 'CONFIRMED', 'White Oak', 'ANCHOR', '1714-12', 'WHITE OAK DNA GROUP ANCHOR. First appears adjacent to Thomas Mims patent December 1714 at Tuckahoe Creek. Received 500 acres on S side main branch of Tuckahoe Creek January 22, 1717. Died 1718. Estate inventory August 22, 1719. Married Sarah Watson.'),

('JNSN-HEN-e1695-01', 'Johnson', 'James', NULL, NULL, NULL, NULL, 1695, 'e', 'HEN', 'Henrico County', NULL, NULL, NULL, NULL, 'CONFIRMED', 'White Oak', 'CONFIRMED', '1718-07-12', 'Son of Michael Johnson. Received 400 acres N side James River July 12, 1718, adjacent to Charles Evans, John Johnson, Joseph & Benjamin Woodson.'),

('JNSN-HEN-e1695-02', 'Johnson', 'John', NULL, NULL, NULL, NULL, 1695, 'e', 'HEN', 'Henrico County', NULL, NULL, NULL, NULL, 'CONFIRMED', 'White Oak', 'CONFIRMED', '1718-07-12', 'Son of Michael Johnson. Received 400 acres N side James River July 12, 1718, adjacent to Charles Evans, N side & near head of Tuckahoe Creek, his own land, James Johnson & Michael Johnson.'),

-- Other early Johnsons
('JNSN-ENG-e1600-04', 'Johnson', 'Garrett', NULL, NULL, NULL, NULL, 1600, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'PROBABLE', NULL, NULL, '1680-07', 'Received 1140 acres at N side head of Chickahominy River July 1680. Note in patent: original date could not be found due to "miscarriage of records in late troubles."'),

('JNSN-NKT-e1660-01', 'Johnson', 'James', NULL, NULL, NULL, NULL, 1660, 'e', 'NKT', 'New Kent County', NULL, NULL, NULL, NULL, 'PROBABLE', NULL, NULL, '1668-04', 'Received 1000 acres between Dragon Swamp & Axells Branch April 1668 with Domingo Mederis. Land originally granted to Thomas Clayborne.'),

('JNSN-KWM-e1670-01', 'Johnson', 'James', NULL, NULL, NULL, NULL, 1670, 'e', 'KWM', 'King William County, Pamunkey Neck', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1703-10', 'Received 40 acres in Pamunkey Neck October 1703 "within the Indian ring" and "on land whereon sd Johnson liveth." Part of land laid out by Articles of Peace for Pamunkey Indians.'),

('JNSN-KWM-e1680-01', 'Johnson', 'Thomas', NULL, NULL, NULL, NULL, 1680, 'e', 'KWM', 'King William County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1711-12', 'Received 970 acres between Pamunkey River & Gouches/Ducking Creek December 1711. 750 acres originally granted Mr. Richard Croshaw 1649.'),

-- Hanover County Johnsons
('JNSN-HAN-e1690-01', 'Johnson', 'Nicholas', NULL, NULL, NULL, NULL, 1690, 'e', 'HAN', 'Hanover County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1719-07-11', 'Received 807 acres with Richard Johnson on both sides South Anna River, July 11, 1719.'),

('JNSN-HAN-e1690-02', 'Johnson', 'Richard', NULL, NULL, NULL, NULL, 1690, 'e', 'HAN', 'Hanover County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1719-07-11', 'Received 807 acres with Nicholas Johnson on both sides South Anna River, July 11, 1719.'),

('JNSN-HAN-e1695-01', 'Johnson', 'John', NULL, NULL, NULL, NULL, 1695, 'e', 'HAN', 'Hanover County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1723-09-05', 'Received 250 acres on Chickahominy Swamp September 5, 1723. Later received 2000 acres S side Chickahominy Swamp February 1727.'),

('JNSN-HAN-e1695-02', 'Johnson', 'Thomas', NULL, NULL, NULL, NULL, 1695, 'e', 'HAN', 'Hanover County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1719', 'Multiple patents 1719-1724 in St. Paul''s Parish area: 182 acres on Stonehorse Creek 1719, 200 acres on Stony Run 1723, 400 acres 1724, 200 acres N side Grassy Swamp 1724.'),

('JNSN-HAN-e1700-01', 'Johnson', 'Benjamin', NULL, NULL, NULL, NULL, 1700, 'e', 'HAN', 'Hanover County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1732-09-28', 'Received 400 acres adjacent to Capt. Hudson & Capt. Clark on low grounds of South Anna River September 28, 1732. Also 200 acres on Machunk Creek & Turkey Run July 7, 1735.'),

('JNSN-HAN-e1695-03', 'Johnson', 'William', NULL, NULL, NULL, NULL, 1695, 'e', 'HAN', 'Hanover County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1725-08-17', 'Received 400 acres in St. Paul''s Parish on both sides Taylor''s Creek & Woody''s Camp Branch August 17, 1725.'),

-- Goochland County Johnsons
('JNSN-GOO-e1700-01', 'Johnson', 'Daniel', NULL, NULL, NULL, NULL, 1700, 'e', 'GOO', 'Goochland County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1733-06-20', 'Major Goochland landholder. 300 acres with Joseph Johnson June 20, 1733 adjacent to Michael Johnson and Woodsons. 800 acres on Lickinghole Creek August 15, 1737.'),

('JNSN-GOO-e1705-01', 'Johnson', 'Joseph', NULL, NULL, NULL, NULL, 1705, 'e', 'GOO', 'Goochland County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1733-06-20', 'Received 300 acres with Daniel Johnson June 20, 1733 N side James River, adjacent to Michael Johnson and Robert & Benjamin Woodson.'),

('JNSN-GOO-e1700-02', 'Johnson', 'Charles', NULL, NULL, NULL, NULL, 1700, 'e', 'GOO', 'Goochland County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1732-09-28', 'Multiple patents 1732-1756 on branches of Tuckahoe Creek and Mill Creek/Jenetoe Creek area.'),

('JNSN-GOO-e1710-01', 'Johnson', 'Stephen', NULL, NULL, NULL, NULL, 1710, 'e', 'GOO', 'Goochland County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1743-03-30', 'Received 400 acres S side Rockfish River March 30, 1743.'),

-- Surry/Sussex Johnsons
('JNSN-SUR-e1690-01', 'Johnson', 'William', NULL, NULL, NULL, NULL, 1690, 'e', 'SUR', 'Surry County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1722-02-18', 'Multiple patents 1722-1751 in Blackwater Swamp area. 295 acres 1722, 250 acres 1732, 121 acres 1745, 168 acres 1751.'),

('JNSN-SUR-e1710-01', 'Johnson', 'Moses', NULL, NULL, NULL, NULL, 1710, 'e', 'SUR', 'Surry County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1745-08-01', 'Received 168 acres on S side Nottoway River August 1, 1745.'),

('JNSN-SUR-e1720-01', 'Johnson', 'Pettway', NULL, NULL, NULL, NULL, 1720, 'e', 'SUR', 'Surry County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1773-03-01', 'Consolidated 1780 acres March 1, 1773 in Sussex County, including earlier grants to William Johnson (1722, 1745, 1751) and part of Willut Roberts grant 1759.'),

-- Augusta/Valley Johnsons
('JNSN-AUG-e1725-01', 'Johnson', 'Andrew', NULL, NULL, NULL, NULL, 1725, 'e', 'AUG', 'Augusta County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1768-07-20', 'Major Valley settler. Multiple patents 1768-1771: 62 acres 1768, 960 acres 1769, 353 acres 1770, 148 acres 1771. Lands on North Fork South Branch Potomac, Mole Hill, Muddy Creek, Senecar Creek.'),

('JNSN-AUG-e1720-01', 'Johnson', 'Daniel', NULL, NULL, NULL, NULL, 1720, 'e', 'AUG', 'Augusta County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1756-08-16', 'Received 320 acres on head of Fort Run August 16, 1756 "begin at the Foot of a Mountain."'),

('JNSN-AUG-e1730-01', 'Johnson', 'James', NULL, NULL, NULL, NULL, 1730, 'e', 'AUG', 'Augusta County', NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, NULL, '1761-08-07', 'Received 230 acres on branch of Catawba Creek August 7, 1761.');

-- ============================================
-- PEOPLE - ALLIED FAMILIES
-- ============================================

INSERT INTO people (id, surname, given_name, suffix, title, designation, occupation, birth_year, birth_year_type, birthplace_code, birthplace_detail, death_year, death_year_type, death_place_code, death_place_detail, confidence, first_documented_date, bio) VALUES

-- Burton family
('BRTN-ENG-e1660-01', 'Burton', 'Robert', 'Sr.', NULL, 'of Longfield Plantation', NULL, 1660, 'e', 'ENG', NULL, 1724, 'e', 'HEN', 'Henrico County', 'CONFIRMED', NULL, 'Patriarch of the Henrico County Burton family. Established Longfield Plantation on the north side of the James River.'),

('BRTN-HEN-b1694-01', 'Burton', 'Hutchins', NULL, NULL, NULL, NULL, 1694, 'b', 'HEN', 'Henrico County', 1763, 'b', 'HEN', 'Henrico County', 'CONFIRMED', '1719', 'Major Henrico landholder. Road surveyor "from William Gordons to Tuckahoe Bridge" in 1719 - same area where Michael Johnson lived. Married Susannah Allen March 31, 1719. Owned 2500+ acres.'),

-- Woodson family
('WDSN-ENG-e1586-01', 'Woodson', 'John', NULL, 'Dr.', NULL, 'surgeon', 1586, 'e', 'ENG', 'Dorsetshire', 1644, 'e', 'HEN', 'Henrico County', 'CONFIRMED', '1619', 'Immigrant ancestor. Arrived January 29, 1619/20 on ship George. Surgeon. Established at Curles Plantation. Reportedly killed in Indian attack of 1644.'),

('WDSN-HEN-e1634-01', 'Woodson', 'Robert', NULL, NULL, NULL, NULL, 1634, 'e', 'HEN', 'Henrico County, Curles Plantation', 1707, 'e', 'HEN', 'Henrico County', 'CONFIRMED', '1680-06', 'Son of Dr. John Woodson. Deposed June 1680 age "46 years or thereabouts." Married Elizabeth Ferris. Father of Benjamin Woodson.'),

('WDSN-HEN-b1666-01', 'Woodson', 'Benjamin', NULL, NULL, NULL, NULL, 1666, 'b', 'HEN', 'Henrico County, Curles Plantation', 1723, 'b', 'HEN', 'Henrico County', 'CONFIRMED', '1700-05-12', 'Son of Robert Woodson. Quaker - married Sarah Porter at Friends Meeting House May 12, 1700. Adjacent to Michael Johnson in 1714 Mims patent at Tuckahoe Creek.'),

-- Watson family
('WTSN-UNK-e1650-01', 'Watson', 'John', 'Sr.', NULL, NULL, NULL, 1650, 'e', 'UNK', NULL, 1718, 'e', NULL, NULL, 'PROBABLE', NULL, 'Father of Sarah Watson. Left will mentioning "daughter Sarah, wife of Michael Johnson."'),

('WTSN-UNK-e1675-01', 'Watson', 'Sarah', NULL, NULL, NULL, NULL, 1675, 'e', 'UNK', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', NULL, 'Wife of Michael Johnson (JNSN-UNK-e1673-01). Daughter of John Watson Sr.'),

-- Travis family
('TRVS-ENG-e1610-01', 'Travis', 'Edward', NULL, NULL, NULL, NULL, 1610, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', '1637-01-25', 'Married daughter of John Johnson "Ancient Planter." Received patents 1637-1639 at Upper Chippoaks Creek. Transported Walter Johnson and Edward Johnson among others.'),

-- Other allied individuals
('MIMS-UNK-e1680-01', 'Mims', 'Thomas', NULL, NULL, NULL, NULL, 1680, 'e', 'UNK', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', '1714-12', 'Received 500 acres on S side main branch of Tuckahoe Creek December 1714 adjacent to Wm Burton, Benjamin Woodson, and Michael Johnson.'),

('JNES-UNK-e1670-01', 'Jones', 'John', NULL, NULL, NULL, NULL, 1670, 'e', 'UNK', NULL, NULL, NULL, NULL, NULL, 'PROBABLE', NULL, 'Brother-in-law of Michael Johnson. Moved with Michael from Arrowhattocks area to Tuckahoe Creek circa 1702.'),

('SPNC-ENG-e1580-01', 'Spencer', 'William', NULL, NULL, NULL, NULL, 1580, 'e', 'ENG', NULL, 1624, 'e', 'JCC', 'James City County', 'CONFIRMED', NULL, 'Adjacent to John Johnson Ancient Planter''s 1624 patent. Described as "dec''d" in that patent.'),

('DCKN-ENG-e1600-01', 'Dickenson', 'Jeremiah', NULL, NULL, NULL, NULL, 1600, 'e', 'ENG', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', '1637', 'Adjacent to Travis/Johnson lands at Upper Chippokes Creek 1637-1638.'),

('HTCR-UNK-e1680-01', 'Hatcher', 'Edward', NULL, NULL, NULL, NULL, 1680, 'e', 'UNK', NULL, NULL, NULL, NULL, NULL, 'CONFIRMED', '1714', 'Landowner at Tuckahoe Creek near Michael Johnson.');

-- ============================================
-- FAMILY RELATIONSHIPS
-- ============================================

INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, evidence) VALUES
-- John Johnson Ancient Planter family
('JNSN-JCC-e1615-01', 'JNSN-ENG-e1590-01', 'father', 'confirmed', 'Patent states land "Granted his father John Johnson Jan 12, 1624 ... due him as son & heir"'),

-- Mark Johnson / Philip Johnson
('JNSN-ECC-e1640-01', 'JNSN-ENG-e1605-01', 'father', 'confirmed', 'Patent October 1696 states 400 acres "granted Marke Johnson, His father"'),

-- Michael Johnson family
('JNSN-HEN-e1695-01', 'JNSN-UNK-e1673-01', 'father', 'confirmed', 'Land patents 1718 show James Johnson adjacent to Michael Johnson; Tony Johnson research confirms'),
('JNSN-HEN-e1695-02', 'JNSN-UNK-e1673-01', 'father', 'confirmed', 'Land patents 1718 show John Johnson adjacent to Michael Johnson with "his own" land; Tony Johnson research confirms'),
('JNSN-HEN-e1695-01', 'JNSN-HEN-e1695-02', 'sibling', 'confirmed', 'Both sons of Michael Johnson per patents and research'),

-- Michael Johnson marriage
('JNSN-UNK-e1673-01', 'WTSN-UNK-e1675-01', 'spouse', 'confirmed', 'Watson will mentions "daughter Sarah, wife of Michael Johnson"'),

-- Sarah Watson parentage
('WTSN-UNK-e1675-01', 'WTSN-UNK-e1650-01', 'father', 'confirmed', 'Watson will identifies Sarah as daughter'),

-- Col. Richard Johnson / William Johnson
('JNSN-KWM-e1675-01', 'JNSN-ENG-e1640-02', 'father', 'probable', 'William received 4900 acres "by will of Col. Richard Johnson" - likely son or close heir'),

-- Woodson family
('WDSN-HEN-e1634-01', 'WDSN-ENG-e1586-01', 'father', 'confirmed', 'Standard Woodson genealogy'),
('WDSN-HEN-b1666-01', 'WDSN-HEN-e1634-01', 'father', 'confirmed', 'Standard Woodson genealogy'),

-- Burton family
('BRTN-HEN-b1694-01', 'BRTN-ENG-e1660-01', 'father', 'confirmed', 'Burton Chronicles of Colonial Virginia');

-- ============================================
-- ASSOCIATIONS
-- ============================================

INSERT INTO associations (person_id, associated_person_id, association_type, date, context) VALUES
-- Michael Johnson neighbors
('JNSN-UNK-e1673-01', 'WDSN-HEN-b1666-01', 'adjacent_landowner', '1714-12', 'Both adjacent to Thomas Mims patent, Tuckahoe Creek'),
('JNSN-UNK-e1673-01', 'BRTN-HEN-b1694-01', 'neighbor', '1714-1718', 'Burton was road surveyor to Tuckahoe Bridge 1719; same area as Michael Johnson'),
('JNSN-UNK-e1673-01', 'MIMS-UNK-e1680-01', 'adjacent_landowner', '1714-12', 'Mims patent December 1714 lists Michael Johnson as adjacent'),
('JNSN-UNK-e1673-01', 'HTCR-UNK-e1680-01', 'adjacent_landowner', '1714', 'Edward Hatcher landowner at Tuckahoe Creek near Michael Johnson'),
('JNSN-UNK-e1673-01', 'JNES-UNK-e1670-01', 'brother_in_law', '1702', 'Moved together from Arrowhattocks to Tuckahoe Creek'),

-- John Johnson Ancient Planter
('JNSN-ENG-e1590-01', 'TRVS-ENG-e1610-01', 'father_in_law', '1637', 'Travis married daughter of John Johnson per patent'),
('JNSN-ENG-e1590-01', 'SPNC-ENG-e1580-01', 'adjacent_landowner', '1624-01-12', 'Spencer adjacent to Johnson in 1624 patent'),
('JNSN-JCC-e1615-01', 'DCKN-ENG-e1600-01', 'adjacent_landowner', '1638', 'Dickenson adjacent at Upper Chippokes Creek');
