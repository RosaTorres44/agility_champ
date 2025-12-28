-- Insert Tipo Pista (Agility, Jumpping)
INSERT INTO
    tipo_pista (
        cod,
        nombre,
        flg_activo,
        fec_creacion,
        fec_actualizacion
    )
VALUES (
        'AGIL',
        'Agility',
        1,
        NOW(),
        NOW()
    ),
    (
        'JUMP',
        'Jumping',
        1,
        NOW(),
        NOW()
    )
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre);

-- Insert Organizaciones
INSERT INTO
    organizacion (
        nombre,
        flg_activo,
        fec_creacion,
        fec_actualizacion
    )
VALUES (
        'Espacio Canino',
        1,
        NOW(),
        NOW()
    ),
    (
        'Perros Increíbles Perú',
        1,
        NOW(),
        NOW()
    ),
    (
        'Escuela Canina Asty',
        1,
        NOW(),
        NOW()
    ),
    (
        'CLUB SPORT DOG',
        1,
        NOW(),
        NOW()
    ),
    ('CNA - KCP', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre);

-- Insert Razas (Common in Peru + Raza Única)
INSERT INTO
    raza (
        descripcion,
        flg_activo,
        fec_creacion,
        fec_actualizacion
    )
VALUES ('Raza Única', 1, NOW(), NOW()),
    (
        'Border Collie',
        1,
        NOW(),
        NOW()
    ),
    (
        'Shetland Sheepdog',
        1,
        NOW(),
        NOW()
    ),
    (
        'Jack Russell Terrier',
        1,
        NOW(),
        NOW()
    ),
    (
        'Golden Retriever',
        1,
        NOW(),
        NOW()
    ),
    (
        'Labrador Retriever',
        1,
        NOW(),
        NOW()
    ),
    ('Schnauzer', 1, NOW(), NOW()),
    ('Poodle', 1, NOW(), NOW()),
    ('Beagle', 1, NOW(), NOW()),
    (
        'Pastor Aleman',
        1,
        NOW(),
        NOW()
    ),
    (
        'Bulldog Frances',
        1,
        NOW(),
        NOW()
    ),
    (
        'Cocker Spaniel',
        1,
        NOW(),
        NOW()
    ),
    ('Chihuahua', 1, NOW(), NOW()),
    (
        'Yorkshire Terrier',
        1,
        NOW(),
        NOW()
    ),
    (
        'Pastor Australiano',
        1,
        NOW(),
        NOW()
    )
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion);

-- Verify insertion
SELECT * FROM tipo_pista;

SELECT * FROM organizacion;

SELECT * FROM raza;