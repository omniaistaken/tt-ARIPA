-- Create an ENUM type for 'grade fraicheur'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'fresh_grade_enum'
  ) THEN
    CREATE TYPE fresh_grade_enum AS ENUM ('A', 'B', 'C', 'E');
  END IF;
END $$;

-- Create an ENUM type for 'transformation level'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'transformation_level_enum'
  ) THEN
    CREATE TYPE transformation_level_enum AS ENUM ('Niveau 0', 'Niveau 1', 'Niveau 2', 'Spiruline');
  END IF;
END $$;

-- Table: family (needed for entity relationship)
CREATE TABLE IF NOT EXISTS family (
    family_id SERIAL PRIMARY KEY,
    family_name VARCHAR(10) UNIQUE NOT NULL,
    is_seller BOOLEAN NOT NULL,
    is_buyer BOOLEAN NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS entity (
  entity_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  siret TEXT UNIQUE NOT NULL,
  family_id INT NOT NULL
    REFERENCES family(family_id)
);

-- Table: species_family
CREATE TABLE IF NOT EXISTS species_family (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table: boat
CREATE TABLE IF NOT EXISTS boat (
    boat_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    len_boat INT NOT NULL,
    matricule VARCHAR(10) UNIQUE NOT NULL,
    owner_id INT NOT NULL,
    brut_gauge_ums INT,
    power_motor_cv INT,
    power_motor_kw INT,
    fishing_type VARCHAR(100),
    FOREIGN KEY (owner_id) REFERENCES entity(entity_id) ON DELETE
    SET NULL
);

-- Table: fish
CREATE TABLE IF NOT EXISTS fish (
    fish_id SERIAL PRIMARY KEY,
    code_fao VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    latin_name VARCHAR(255) NOT NULL,
    species_family_id INT,
    FOREIGN KEY (species_family_id) REFERENCES species_family(id) ON DELETE
    SET NULL
);

-- Table: presentation
CREATE TABLE IF NOT EXISTS presentation (
    id SERIAL PRIMARY KEY,
    presentation_code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT UNIQUE NOT NULL,
    transformation transformation_level_enum NOT NULL
);

-- Table: bill
CREATE TABLE IF NOT EXISTS bill (
    bill_id SERIAL PRIMARY KEY,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('virement', 'chèque', 'espèces')),
    -- INT
    status VARCHAR(20) NOT NULL CHECK (status IN ('en attente', 'controlée', 'validée', 'incomplète')),
    boat_id INT NOT NULL,
    buyer_id INT NOT NULL,
    member_id INT NOT NULL,
    -- DECIMAL
    total DECIMAL(10, 2) NOT NULL,
    total_ttc DECIMAL(10, 2) NOT NULL,
    total_kg DECIMAL(10, 2) NOT NULL,
    total_epv DECIMAL(10, 2) NOT NULL,
    -- DATE
    paid_on DATE NOT NULL,
    billing_date DATE NOT NULL,
    -- TIMESTAMP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- VARCHAR
    fishing_paper VARCHAR(20),
    delivery_address VARCHAR(255),
    bill_number VARCHAR(20) NOT NULL,
    -- FOREIGN KEY
    FOREIGN KEY (buyer_id) REFERENCES entity(entity_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES entity(entity_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bill_line (
    id SERIAL PRIMARY KEY,
    bill_id INT NOT NULL,
    lot_number VARCHAR(10) NOT NULL,
    fish_id INT,
    fish_status VARCHAR(20) NOT NULL CHECK (fish_status IN ('frais', 'congelé', 'spiruline')),
    quantity DECIMAL(5,2) NOT NULL,
    -- in kg
    unit_price DECIMAL(5,2) NOT NULL,
    -- euro/kg
    total_price DECIMAL(7,2) NOT NULL,
    total_epv DECIMAL(7,2) NOT NULL,
    code_fao VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    presentation VARCHAR(20) NOT NULL,
    coef_epv DECIMAL(5,2) NOT NULL,
    fresh_grade fresh_grade_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bill(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (fish_id) REFERENCES fish(fish_id) ON DELETE SET NULL
);

INSERT INTO family (family_name, is_seller, is_buyer, description)
VALUES ('APPECOR', TRUE, FALSE, 'Pêche artisanale côtière et palangre côtière');

INSERT INTO family (family_name, is_seller, is_buyer, description)
VALUES ('OPROMAR', TRUE, FALSE, 'Palangre côtière et pêche hauturière');

INSERT INTO family (family_name, is_seller, is_buyer, description)
VALUES ('ARUDEP', FALSE, TRUE, 'Usines de transformation');

INSERT INTO family (family_name, is_seller, is_buyer, description)
VALUES ('FGPMAR', FALSE, TRUE, 'Poissonneries');

INSERT INTO family (family_name, is_seller, is_buyer, description)
VALUES ('EVAMER', FALSE, TRUE, 'Grossistes');

INSERT INTO family (family_name, is_seller, is_buyer, description)
VALUES ('PCS AQUA', TRUE, FALSE, 'Producteurs d espèces aquacoles et de spiruline');

-- presentation
INSERT INTO presentation (presentation_code, description, transformation)
VALUES ('WHL', 'Entier', 'Niveau 0');
INSERT INTO presentation (presentation_code, description, transformation)
VALUES ('GUT', 'Éviscéré', 'Niveau 1');
INSERT INTO presentation (presentation_code, description, transformation)
VALUES ('GUG', 'Éviscéré et sans branchies', 'Niveau 1');
INSERT INTO presentation (presentation_code, description, transformation)
VALUES ('GUH', 'Éviscéré et étêté', 'Niveau 1');
INSERT INTO presentation (presentation_code, description, transformation)
VALUES ('WNG', 'Ailerons', 'Niveau 2');
INSERT INTO presentation (presentation_code, description, transformation)
VALUES ('FIL', 'En filets', 'Niveau 2');
INSERT INTO presentation (presentation_code, description, transformation)
VALUES ('FIS', 'En filets et sans peau', 'Niveau 2');
INSERT INTO presentation (presentation_code, description, transformation)
VALUES ('GHT', 'En filets, étêté et sans peau', 'Niveau 2');
