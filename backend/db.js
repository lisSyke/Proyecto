const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbAllison:p65F5Ehu3xnNMIN8@cluster0.etk9sac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>console.log('Conectado a MongoDB Atlas'))
.catch((err)=>console.error('Error de conexión:', err));

