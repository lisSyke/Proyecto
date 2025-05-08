const express = require('express');
const router = express.Router();

const Libro = require('../models/Libro'); //Importamos el modelo libro para interactuar con MongoDB

router.use(express.json());

/* RUTA GET
*
*
*
*
*/
//1. Obtener un libro específico según su título.


router.get('/:titulo', async(req, res) => {
    try{
        const libro = await Libro.findOne(req.params.titulo);
        if(!libro){
            return res.status(404).json({mensaje: 'Libro no encontrado'});
        }
        res.json(libro); //Envía el libro encontrado
    } catch (error) {
        res.status(500).json({mensaje: error.message});
    }
});

//2. Lista de libros según su autor

router.get('/autor', async(req, res) => {
    try{
        const autores = await Libro.find({autor: req.params.autor});
        if(autores.length === 0){
            return res.status(404).json({mensaje: 'Autor no encontrado'});
        }
        res.json(autores);
    }catch (error) {
        res.status(500).json({mensaje: error.message});
    }
});

//3. Según estado

router.get('/estado/:estado', async (req, res) => {
    try {
      const libros = await Libro.find({ estado: req.params.estado });
      if (libros.length === 0) {
        return res.status(404).json({ mensaje: 'Estado no encontrado o sin resultados' });
      }
      res.json(libros);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  });

//4. Según categoría
  
router.get('/categoria/:categoria', async (req, res) => {
    try {
      const libros = await Libro.find({ categoria: req.params.categoria });
      if (libros.length === 0) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }
      res.json(libros);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  });
    
/*
*
*
POST
*
*
*/

router.post('/', async (req, res)=> {
  try{
    const nuevoLibro = new Libro({
      usuario: req.body.usuario,
      titulo: req.body.titulo,
      autor: req.body.autor,
      categoria: req.body.categoria,
      descripcion: req.body.descripcion,
      estado: req.body.estado,
      calificacion: req.body.calificacion,
      comentarios: req.body.comentarios
    });
    const libroGuardado = await nuevoLibro.save();
    res.status(201).json({mensaje: 'Libro guardado exitosamente', libro: libroGuardado});
  } catch (error) {
      res.status(500).json({mensaje: 'Error al guardar el libro', error: error.message});
  }
});

/**
 * 
 * 
 * Put
 * 
 * 
 */


router.put('/libros/:actualizar_datos', async (req, res) => {
  try{
    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.actualizar_datos,
      req.body,
      {new: true}
    );
    if (!libroActualizado){
      return res.status(404).json({mensaje: 'Libro no encontrado'});
    }
    res.json({mensaje:'Libro actualizado correctamente', libro: libroActualizado});
  } catch (error){
    res.status(500).json({mensaje: error.message});
  }
});

/**
 * 
 * 
 * DELETE
 * 
 * 
 * 
 */


router.delete('/libros/:eliminar_datos', async (req, res) => {

  try{
    const libroEliminado = await Libro.findByIdAndDelete(req.params.id);
    if (!libroEliminado){
      return res.status(404).json({mensaje: 'Libro no encontrado'});
    }
    res.json({mensaje: 'Libro eliminado correctamente'});
  } catch(error){
    res.status(500).json({mensaje: error.message});
  }
});


module.exports = router;