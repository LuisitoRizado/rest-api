import express from 'express'
import { pool } from './db.js'
import {PORT} from './config.js'
const app = express()
app.use(express.json());
/* const bodyParser = require('body-parser');
app.use(bodyParser.json()); */

app.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users')
  res.json(rows)
})

app.get('/ping', async (req, res) => {
  const [result] = await pool.query(`SELECT "hello world" as RESULT`);
  res.json(result[0])
})

//-----------------------------------------------------------------------OPERACIONES CON HORARIOS
app.get('/getAllHorarios', async (req, res) => {
  const sql = "SELECT * FROM Horario";
  const [result] = await pool.query(sql);
  const users = result.map(user => ({
    Id_Horario: user.Id_Horario,
    Hora_Inicio_Lunes: user.Hora_Inicio_Lunes,
    Hora_Final_Lunes: user.Hora_Final_Lunes
  }));
  res.json(users);
});
//----Eliminar horario
app.delete('/deleteHorario/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const sql = "DELETE FROM Horario WHERE Id_Horario = ?";
    const [result] = await pool.query(sql, [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({
        message: `No se encontró el horario con el ID ${id}`
      });
    } else {
      res.status(200).json({
        message: `Horario con ID ${id} ha sido eliminado exitosamente`
      });
    }
  } catch (error) {
    console.error(`Error while deleting horario record: ${error}`);
    res.status(500).json({
      message: "Error al eliminar el horario"
    });
  }
});

//------------------------------------------------------OPERACIONES CON AULAS
app.post('/addAula', async (req, res) => {
  const { ID_AULA, NOMBRE, EDIFICIO, CAPACIDAD } = req.body;
  console.log(`Received data: ID_AULA=${ID_AULA}, NOMBRE=${NOMBRE}, EDIFICIO=${EDIFICIO}, CAPACIDAD=${CAPACIDAD}`);

  try {
    const sql = "INSERT INTO Aula (ID_AULA, NOMBRE, EDIFICIO, CAPACIDAD) VALUES (?, ?, ?, ?)";
    await pool.query(sql, [ID_AULA, NOMBRE, EDIFICIO, CAPACIDAD]);
    console.log(`Inserted new AULA record with ID_AULA=${ID_AULA}`);
    res.status(200).json({
      "ID_AULA": ID_AULA,
      "NOMBRE": NOMBRE,
      "EDIFICIO": EDIFICIO,
      "CAPACIDAD": CAPACIDAD
    });
  } catch (error) {
    console.error(`Error while adding new AULA record: ${error}`);
  res.status(500).json({
    "message": `Error while adding new AULA record: ${error.message}`
  });
  }
});

//---------------------------------------------------OPERACIONES CON MATERIAS
app.post('/addNewMateria', async (req, res) => {
  const { ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE} = req.body;

  //Secuencia sql para poder agregar el alumno a la base de datos
  //Primero agregarmos la materia sin asignar el docente
  let sql = "INSERT INTO MATERIA (ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA,CREDITOS,CUPO,SEMESTRE) values(?, ?, ?, ?, ?, ?, ?, ?)";

  await BD.Open(sql, [ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE], true);
  
 
   
  res.status(200).json();
})


//-------------------------------------------------OPERACIONES CON  DOCENTES
app.get('/getAllDocentes', async (req, res) => {
  const sql = "SELECT * FROM Docente";
  const [result] = await pool.query(sql);
  const docentes = result.map(docente => ({
      Id_Docente: docente.Id_Docente,
      Nombre: docente.Nombre,
      AP_PATERNO: docente.Ap_Paterno,
      AP_MATERNO: docente.Ap_Materno
  }));
  res.json(docentes);
});
//agregar docente
app.post('/addDocente', async (req, res) => {
  const { ID_DOCENTE, NOMBRE, AP_PATERNO, AP_MATERNO } = req.body;

  // Secuencia sql para poder agregar el docente a la base de datos
  const sql = "INSERT INTO Docente(ID_DOCENTE, NOMBRE, AP_PATERNO, AP_MATERNO) VALUES (?, ?, ?, ?)";

  try {
    await pool.query(sql, [ID_DOCENTE, NOMBRE, AP_PATERNO, AP_MATERNO]);
    console.log(`Inserted new DOCENTE record with ID_DOCENTE=${ID_DOCENTE}`);
    res.status(200).json({
      "ID_DOCENTE": ID_DOCENTE,
      "NOMBRE": NOMBRE,
      "AP_PATERNO": AP_PATERNO,
      "AP_MATERNO": AP_MATERNO
    });
  } catch (error) {
    console.error(`Error while adding new DOCENTE record: ${error}`);
    res.status(500).json({
      "message": `Error while adding new DOCENTE record: ${error.message}`
    });
  }
});

//--actualizar docente
app.put("/updateDocente/:ID_DOCENTE", async (req, res) => {
  const { NOMBRE, AP_PATERNO, AP_MATERNO } = req.body;
  const { ID_DOCENTE } = req.params;
  const sql = "UPDATE Docente SET NOMBRE=?, AP_PATERNO=?, AP_MATERNO=? WHERE ID_DOCENTE=?";
  const params = [NOMBRE, AP_PATERNO, AP_MATERNO, ID_DOCENTE];

  try {
    const result = await pool.query(sql, params);
    console.log(`Updated record for Docente with ID_DOCENTE=${ID_DOCENTE}`);
    res.status(200).json({
      "NOMBRE": NOMBRE,
      "AP_PATERNO": AP_PATERNO,
      "AP_MATERNO": AP_MATERNO
    });
  } catch (error) {
    console.error(`Error while updating record for Docente with ID_DOCENTE=${ID_DOCENTE}: ${error}`);
    res.status(500).json({
      "message": `Error while updating record for Docente with ID_DOCENTE=${ID_DOCENTE}: ${error.message}`
    });
  }
});
//Obtener un docente
app.get('/getDocente/:id', async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Docente WHERE Id_Docente = ?";
  const [result] = await pool.query(sql, [id]);

  if (result.length === 0) {
    res.status(404).json({ message: "Docente no encontrado" });
    return;
  }

  const userSchema = {
    "Id_Docente": result[0].Id_Docente,
    "Nombre": result[0].Nombre,
    "AP_PATERNO": result[0].Ap_Paterno,
    "AP_MATERNO": result[0].Ap_Materno
  };

  res.json(userSchema);
});




app.get('/create', async (req, res) => {
  const result = await pool.query('INSERT INTO users(name) VALUES ("John")')
  res.json(result)
})

app.listen(PORT)
console.log('Server on port', PORT)
