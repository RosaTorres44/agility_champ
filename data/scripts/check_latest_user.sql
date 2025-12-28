-- Check the most recently registered user
SELECT
    id,
    nombres,
    email,
    id_tipo_persona,
    fec_creacion
FROM persona
ORDER BY id DESC
LIMIT 1;

-- Check what IDs map to what Roles
SELECT * FROM tipo_persona;