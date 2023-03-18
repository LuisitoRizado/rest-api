import express from 'express'
import { pool } from './db.js'
import {PORT} from './config.js'
const app = express()
app.use(express.json());

//-----------------------LOGIN
app.get('/getLogin/:id/:password', async (req, res) => {
  const { id, password } = req.params;
  const sql = "SELECT * FROM Alumnos WHERE NControl = ? AND CONTRASENA = ?";
  const [result] = await pool.query(sql, [id, password]);
  const users = result.map(user => ({
    NControl: user.NControl,
    ID_Carrera: user.Id_Carrera,
    Nombre: user.Nombre,
    AP_PATERNO: user.Ap_Paterno,
    AP_MATERNO: user.Ap_Materno,
    SEMESTRE: user.Semestre,
    PERIODO: user.Periodo,
    CREDITOS_DISPONIBLES: user.Creditos_Disponibles,
    ESPECIALIDAD: user.Especialidad,
    CONTRASENA: user.Contrasena
  }));
  res.json(users);
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
    const [result] = await pool.execute(sql, [id]);
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
//Obtener un solo horario
app.get('/getHorario/:id', async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Horario WHERE Id_Horario = ?";
  try {
    const [result] = await pool.query(sql, [id]);
    if (result.length === 0) {
      res.status(404).json({
        message: `No se encontró el horario con el ID ${id}`
      });
    } else {
      const horario = {
        "Id_Horario": result[0].Id_Horario,
        "Hora_Inicio_Lunes": result[0].Hora_Inicio_Lunes,
        "Hora_Final_Lunes": result[0].Hora_Final_Lunes,
        "Hora_Inicio_Martes": result[0].Hora_Inicio_Martes,
        "Hora_Final_Martes": result[0].Hora_Final_Martes,
        "Hora_Inicio_Miercoles": result[0].Hora_Inicio_Miercoles,
        "Hora_Final_Miercoles": result[0].Hora_Final_Miercoles,
        "Hora_Inicio_Jueves": result[0].Hora_Inicio_Jueves,
        "Hora_Final_Jueves": result[0].Hora_Final_Jueves,
        "Hora_Inicio_Viernes": result[0].Hora_Inicio_Viernes,
        "Hora_Final_Viernes": result[0].Hora_Final_Viernes
      };
      res.json(horario);
    }
  } catch (error) {
    console.error(`Error while getting horario record: ${error}`);
    res.status(500).json({
      message: "Error al obtener el horario"
    });
  }
});
//actualizar horario
app.put("/updateHorario/:ID_HORARIO", async (req, res) => {
  const { HORA_INICIO_LUNES, HORA_FINAL_LUNES } = req.body;
  const { ID_HORARIO } = req.params;
  const sql = "UPDATE Horario SET HORA_INICIO_LUNES=?, HORA_FINAL_LUNES=? WHERE ID_HORARIO=?";
  
  try {
    const [result] = await pool.execute(sql, [HORA_INICIO_LUNES, HORA_FINAL_LUNES, ID_HORARIO]);

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: `No se encontró el horario con el ID ${ID_HORARIO}`
      });
    } else {
      res.status(200).json({
        HORA_INICIO_LUNES: HORA_INICIO_LUNES,
        HORA_FINAL_LUNES: HORA_FINAL_LUNES
      });
    }
  } catch (error) {
    console.error(`Error while updating horario record: ${error}`);
    res.status(500).json({
      message: "Error al actualizar el horario"
    });
  }
});
//Agregar un horario
app.post('/addHorario', async (req, res) => {
  const { ID_HORARIO, HORA_INICIO_LUNES, HORA_FINAL_LUNES } = req.body;

  try {
    const sql = "INSERT INTO Horario (ID_HORARIO, HORA_INICIO_LUNES, HORA_FINAL_LUNES) VALUES (?, ?, ?)";
    await pool.query(sql, [ID_HORARIO, HORA_INICIO_LUNES, HORA_FINAL_LUNES]);

    res.status(200).json({
      "ID_HORARIO": ID_HORARIO,
      "HORA_INICIO_LUNES": HORA_INICIO_LUNES,
      "HORA_FINAL_LUNES": HORA_FINAL_LUNES,
    });
  } catch (error) {
    console.error(`Error while adding horario record: ${error}`);
    res.status(500).json({
      message: "Error al agregar el horario"
    });
  }
});





//------------------------------------------------------OPERACIONES CON AULAS
//--buscar aula 
app.get('/getAula/:id', async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Aula WHERE Id_Aula = ?";
  const [result] = await pool.query(sql, [id]);
  const aulas = result.map(aula => ({
    Id_Aula: aula.Id_Aula,
    Nombre: aula.Nombre,
    Edificio: aula.Edificio,
    Capacidad: aula.Capacidad
  }));
  res.json(aulas);
});
//--obtener todas las aulas 
app.get('/getAllAulas', async (req, res) => {
  const sql = "SELECT * FROM Aula";
  const [result] = await pool.query(sql);
  const users = result.map(user => ({
    Id_Aula: user.Id_Aula,
    Nombre: user.Nombre,
    Edificio: user.Edificio,
    Capacidad: user.Capacidad
  }));
  res.json(users);
});
//--gregar aula
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
//eliminar aula
app.delete('/deleteAula/:Id_Aula', async (req, res) => {
  const { Id_Aula } = req.params;

  try {
    

    // Eliminamos el aula
    const queryDeleteAula = "DELETE FROM Aula WHERE Id_Aula = ?";
    const [result] = await pool.execute(queryDeleteAula, [Id_Aula]);

    if (result.affectedRows === 1) {
      res.json({ "msg": "Aula Eliminada" });
    } else {
      res.json({ "msg": "No se pudo eliminar el aula" });
    }
  } catch (error) {
    console.error(`Error while deleting aula record: ${error}`);
    res.status(500).json({
      message: "Error al eliminar el aula"
    });
  }
});
//---actualizar aula 
app.put("/updateAula/:ID_AULA", async (req, res) => {
  const { NOMBRE, EDIFICIO, CAPACIDAD } = req.body;
  const { ID_AULA } = req.params;
  
  try {
    const sql = "UPDATE Aula SET NOMBRE = ?, EDIFICIO = ?, CAPACIDAD = ? WHERE ID_AULA = ?";
    await pool.query(sql, [NOMBRE, EDIFICIO, CAPACIDAD, ID_AULA]);
    console.log(`Updated AULA record with ID_AULA=${ID_AULA}`);
    res.status(200).json({
      "NOMBRE": NOMBRE,
      "EDIFICIO": EDIFICIO,
      "CAPACIDAD": CAPACIDAD
    });
  } catch (error) {
    console.error(`Error while updating AULA record: ${error}`);
    res.status(500).json({
      message: `Error while updating AULA record: ${error.message}`
    });
  }
});


//-------------------------------------------------------------------OPERACIONES CON MATERIAS
//AGREGAR MATERIA (FUNCIONA)
app.post('/addNewMateria', async (req, res) => {
  const { ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE} = req.body;

  //Secuencia sql para poder agregar la materia a la base de datos
  //Primero agregamos la materia sin asignar el docente
  const sql = "INSERT INTO Materia (ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    await pool.query(sql, [ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE]);
    console.log(`Inserted new MATERIA record with ID_MATERIA=${ID_MATERIA}`);
    res.status(200).json({});
  } catch (error) {
    console.error(`Error while adding new MATERIA record: ${error}`);
    res.status(500).json({
      message: `Error while adding new MATERIA record: ${error.message}`
    });
  }
});
//Materas por semestre: ///////ERROR
app.get('/getMaterias/:semestre', async (req, res) => {
  const { semestre } = req.params;
  const sql = "SELECT Id_Materia, Materia, Cupo, Creditos, Semestre FROM Materia WHERE Semestre=?";
  try {
    const [result] = await pool.query(sql, [semestre]);
    const users = result.map(user => ({
      Id_Materia: user.Id_Materia,
      Materia: user.Materia,
      Cupo: user.Cupo,
      Creditos: user.Creditos,
      Semestre: user.Semestre
    }));
    res.json(users);
  } catch (error) {
    console.error(`Error while getting MATERIA records: ${error}`);
    res.status(500).json({
      message: `Error while getting MATERIA records: ${error.message}`
    });
  }
});

//Obtener todas las materias, con horario, aula y carrera////ERROR
app.get('/getAllMaterias', async (req, res) => {
  sql = "SELECT * FROM Materia JOIN Carrera ON Materia.id_carrera = Carrera.id_carrera JOIN Horario ON Materia.id_horario = Horario.id_horario JOIN Aula ON Materia.id_aula = Aula.id_aula ";

  try {
    const [result, fields] = await pool.query(sql);
    const Users = result.map(user => ({
      "ID_MATERIA": user.Id_Materia,
      "ID_HORARIO": user.Id_Horario,
      "ID_AULA": user.Id_Aula,
      "ID_CARRERA": user.Id_Carrera,
      "MATERIA": user.Materia,
      "CREDITOS": user.Creditos,
      "CUPO": user.Cupo,
      "SEMESTRE": user.Semestre,
      "NOMBRE": user.Nombre,
      "HORA_INICIO_LUNES": user.Hora_Inicio_Lunes,
      "HORA_FINAL_LUNES": user.Hora_Final_Lunes,
      "Nombre": user.Nombre
    }));
    res.json(Users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al obtener las materias");
  }
});
//ERROR
app.get('/getAllMats', async (req, res) => {
  try {
      const connection = await mysql.createPool(config.db);
      const result = await connection.execute(`
          SELECT ID_DOCXMATH,Docente.ID_DOCENTE, Materia.ID_MATERIA, Materia.MATERIA, Docente.NOMBRE,DOCENTE.AP_PATERNO, Docente.AP_MATERNO, Aula.NOMBRE, Horario.HORA_INICIO_LUNES
          FROM Materia
          INNER JOIN MATERIA_ASIGNADA_PROFESOR ON Materia.ID_MATERIA = Materia_Asignada_Profesor.ID_MATERIA
          INNER JOIN DOCENTE ON Materia_Asignada_Profesor.ID_DOCENTE = Docente.ID_DOCENTE
          INNER JOIN AULA ON Materia.ID_AULA = Aula.ID_AULA
          INNER JOIN HORARIO ON Materia.ID_HORARIO = Horario.ID_HORARIO
      `);
      const Users = result[0].map(user => ({
          "ID_DOCXMATH": user.Id_Docxmath,
          "ID_DOCENTE": user.Id_Docente,
          "ID_MATERIA": user.Id_Materia,
          "MATERIA": user.Materia,
          "NOMBRE": user.Nombre,
          "AP_PATERNO": user.Ap_Paterno,
          "AP_MATERNO": user.Ap_Materno,
          "HORA_INICIO_LUNES": user.Hora_Inicio_Lunes,
          "HORA_FINAL_LUNES": user.Hora_Final_Lunes,
          "AULA": user.NOMBRE
      }));
      res.json(Users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/getMats/:MAT', async (req, res) => {
  const { MAT } = req.params;
  //Obtener materia asignada al profesor
  const sql = `SELECT ID_DOCXMATH, Docente.ID_DOCENTE, Materia.ID_MATERIA, Materia.MATERIA, Docente.NOMBRE,DOCENTE.AP_PATERNO, Docente.AP_MATERNO, Aula.NOMBRE, Horario.HORA_INICIO_LUNES
      FROM Materia
      INNER JOIN MATERIA_ASIGNADA_PROFESOR ON Materia.ID_MATERIA = Materia_Asignada_Profesor.ID_MATERIA
      INNER JOIN DOCENTE ON Materia_Asignada_Profesor.ID_DOCENTE = Docente.ID_DOCENTE
      INNER JOIN AULA ON Materia.ID_AULA = Aula.ID_AULA
      INNER JOIN HORARIO ON Materia.ID_HORARIO = Horario.ID_HORARIO WHERE Materia_Asignada_Profesor.ID_DOCXMATH =?`;

  await pool.query(sql, [MAT], (error, result) => {
      if (error) throw error;

      const Users = result.map(user => ({
          "ID_DOCXMATH":user.ID_DOCXMATH,
          "ID_DOCENTE":user.ID_DOCENTE,
          "ID_MATERIA":user.ID_MATERIA,
          "MATERIA": user.MATERIA,
          "NOMBRE": user.NOMBRE,
          "AP_PATERNO": user.AP_PATERNO,
          "AP_MATERNO": user.AP_MATERNO,
          "HORA_INICIO_LUNES": user.HORA_INICIO_LUNES,
          "HORA_FINAL_LUNES": user.HORA_FINAL_LUNES,
          "AULA": user.NOMBRE
      }));

      res.json(Users);
  });
});

//------------------------------------------------------------------OPERACIONES CON  DOCENTES
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
