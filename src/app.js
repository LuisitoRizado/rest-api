import express from 'express'
import { pool } from './db.js'
import {PORT} from './config.js'

const app = express()

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


app.post('/addAula', async (req, res) => {
  const { ID_AULA, NOMBRE, EDIFICIO, CAPACIDAD } = req.body;
  console.log(`Received data: ID_AULA=${ID_AULA}, NOMBRE=${NOMBRE}, EDIFICIO=${EDIFICIO}, CAPACIDAD=${CAPACIDAD}`);

  try {
    const sql = "INSERT INTO AULA (ID_AULA, NOMBRE, EDIFICIO, CAPACIDAD) VALUES (?, ?, ?, ?)";
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
      "message": "Error while adding new AULA record"
    });
  }
});



app.get('/create', async (req, res) => {
  const result = await pool.query('INSERT INTO users(name) VALUES ("John")')
  res.json(result)
})

app.listen(PORT)
console.log('Server on port', PORT)
