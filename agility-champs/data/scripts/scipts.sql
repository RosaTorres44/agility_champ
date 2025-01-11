-- ranking 
select d.`NombrePerro` as dogName , u.`Nombre`  as handlerName , g.`Nombre` as grado, c.`Nombre` as categoria ,r.Posicion, 
'/logo.jpeg?height=50&width=50' as image
from Usuarios u
inner join Duplas d
on u.UsuarioID = d.UsuarioID 
inner join Grados g
on g.`GradoID` = d.`GradoID` 
inner join Categorias c
on c.`CategoriaID` = d.`CategoriaID` 
inner join Resultados r
on r.DuplaID = d.DuplaID ; 


 