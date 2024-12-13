import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil({ route }) {
  const { markers } = route.params || []; // Recuperar los pines desde los parámetros de navegación

  const [isModalVisible, setModalVisible] = useState(false); // Estado del modal de sesión
  const [isEditModalVisible, setEditModalVisible] = useState(false); // Estado del nuevo modal para editar
  const [username, setUsername] = useState(''); // Estado del campo usuario
  const [password, setPassword] = useState(''); // Estado del campo contraseña
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [id, setID] = useState('');
  const [newNombre, setNewNombre] = useState(''); // Estado para el nuevo nombre
  const [newCorreo, setNewCorreo] = useState(''); // Estado para el nuevo correo
  const [incidentes, setIncidentes] = useState([]);  // Estado para almacenar los incidentes


  const fetchIncidentes = async () => {
    console.log('http://192.168.0.12:3000/incidentes/usuario/'+id)
    try {
      const response = await axios.get('http://192.168.0.12:3000/incidentes/usuario/'+id);
      setIncidentes(response.data);  // Almacena los incidentes en el estado
      console.log(incidentes, 'prueba')
    } catch (error) {
      console.error('Error al obtener los incidentes:', error);
    }

  }
  // Guardar datos
  const saveData = async (nombre, correo, id_usuario) => {
    try {
      console.log('Guardando datos');
      await AsyncStorage.setItem('nombre', nombre);
      await AsyncStorage.setItem('correo', correo);
      await AsyncStorage.setItem('id_usuario', id_usuario.toString());
      readData();
    } catch (e) {
      console.error('Error al guardar', e);
    }
  };

  // Leer datos
  const readData = async () => {
    setNombre(await AsyncStorage.getItem('nombre'));
    setCorreo(await AsyncStorage.getItem('correo'));
    setID(await AsyncStorage.getItem('id_usuario'));
  };

  const handleLogin = async () => {
    console.log('1 - Inicio de handleLogin');

    const loginData = {
      correo: username,
      password: password,
    };
    console.log('Datos de login:', loginData);

    try {
      console.log('2 - Iniciando solicitud con Axios...');
      const response = await axios.post('http://192.168.0.12:3000/usuarios/login', loginData);

      console.log('3 - Respuesta del servidor:', response.data);
      saveData(response.data.nombre, response.data.correo, response.data.id_usuario);
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
      fetchIncidentes()
    } catch (error) {
      console.log('4 - Error al realizar la solicitud con Axios');
      if (error.response) {
        console.error('Error en la respuesta del servidor:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'Error al iniciar sesión.');
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
        Alert.alert('Error', 'No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        console.error('Error al configurar la solicitud:', error.message);
        Alert.alert('Error', 'Ocurrió un error inesperado.');
      }
    }

    console.log('5 - Finalizando handleLogin');
    setModalVisible(false); // Cierra el modal
  };

  // Función para actualizar los datos
  const handleUpdate = async () => {
    if (!newNombre && !newCorreo) {
      Alert.alert('Error', 'Por favor, ingresa un nombre o un correo.');
      return;
    }

    const updateData = {
      nombre: newNombre || nombre,
      correo: newCorreo || correo,
    };
    console.log(id)
    try {
      console.log('Actualizando datos...');
      const response = await axios.put(`http://192.168.0.12:3000/usuarios/${id}`, updateData);
      console.log('Respuesta del servidor:', response.data);
      saveData(response.data.nombre, response.data.correo, response.data.id_usuario);
      Alert.alert('Éxito', 'Datos actualizados correctamente');
      setEditModalVisible(false); // Cierra el modal de edición
    } catch (error) {
      console.log('Error al realizar la actualización');
      Alert.alert('Error', 'No se pudo actualizar la información.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón para abrir el modal de sesión */}
      <Button title="Iniciar sesión" onPress={() => setModalVisible(true)} />
      <Button title="Cerrar sesión" onPress={() => saveData('', '', '')} />

      {/* Modal para iniciar sesión */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)} // Permite cerrar el modal con el botón de atrás
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Iniciar Sesión</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonLogin]}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar información personal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)} // Permite cerrar el modal con el botón de atrás
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Información</Text>
            <TextInput
              style={styles.input}
              placeholder="Nuevo nombre"
              value={newNombre}
              onChangeText={setNewNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Nuevo correo"
              value={newCorreo}
              onChangeText={setNewCorreo}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonLogin]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Nombre: {nombre}</Text>
      <Text style={styles.title}>Correo: {correo}</Text>
      <Button title="Editar información personal" onPress={() => setEditModalVisible(true)} />

      <View style={styles.section}>
  <Text style={styles.title}>Reportes</Text>
  <FlatList
    data={incidentes}
    keyExtractor={(item) => item.id_incidente.toString()}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tipo: {item.tipo}</Text>
        <Text>Descripción: {item.descripcion}</Text>
        <Text>Hora: {item.hora}</Text>
        <Text>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
        <Text>Latitud: {item.latitude}</Text>
        <Text>Longitud: {item.longitude}</Text>
      </View>
    )}
  />
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  markerItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  buttonLogin: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});
