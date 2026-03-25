-- Agregar columnas faltantes a la tabla cliente
alter table cliente add column if not exists rol text default 'cliente';
alter table cliente add column if not exists password text;

-- Hacer email único
alter table cliente add constraint unique_email unique (email);

-- Actualizar usuarios existentes a 'cliente' por defecto
update cliente set rol = 'cliente' where rol is null;
