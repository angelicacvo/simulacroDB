const APP_URL = "http://localhost:3000/"
const tbody_clients = document.getElementById("tbody_doctors");

const addButton = document.getElementById("addButton");
document.getElementById('upload_doctors').addEventListener('click', async () => {
    try {
      const res = await fetch(APP_URL +'upload-doctors', {
        method: 'POST'
      });
      const data = await res.json();
      alert(`${data.message}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  });


(async function index() {
    const res = await fetch (APP_URL+"doctors");
    const data = await res.json();
    console.log("GET:", data);
    tbody_doctors.innerHTML = "";
    data.forEach(doctor => {
      tbody_doctors.innerHTML += `
      <tr>
        <td>${doctor.id_doctor}</td>
        <td>${doctor.name}</td>
        <td>
             <button class="btn btn-sm btn-warning" onclick="updateData(${doctor.id_doctor})">update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteData(${doctor.id_doctor})">Eliminar</button>

        </td>
    </tr>
      `
      
    });
    
  })()

async function store() {
  
  try {
  const client_name = document.getElementById("client_name").value.trim();

  if (!client_name) {
    alert("Todos los campos son obligatorios");
    return;
  }


  const resUsers = await fetch(APP_URL + "doctors");
  const users = await resUsers.json();

  const existe = users.some(user => user.name.toLowerCase() === client_name.toLowerCase());
  if (existe) {
    alert("El doctor ya está registrado");
    return;
  }

  const res = await fetch(APP_URL + 'upload-doctor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: client_name,
    })
  });

  await res.json();


  const modalEl = document.getElementById('courseModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  location.reload();

} catch (error) {
  console.error('Error en POST:', error);
}
}

addButton?.addEventListener("click", store);

function deleteData(id) {
  if (confirm("¿Seguro que quieres eliminar este doctor?")) {
    fetch(APP_URL + "doctors/" + id, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) throw new Error("Error al eliminar doctor");
      return response.json();
    })
    .then(data => {
      alert(data.mensaje);
      location.reload();
    })
    .catch(error => {
      console.error(error);
      alert("Hubo un problema al eliminar el doctor");
    });
  }
}

function updateData(id) {
  fetch(APP_URL + 'doctors/' + id)
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener el doctor');
      return res.json();
    })
    .then(cliente => {
      document.getElementById('client_name').value = cliente.name;


      document.getElementById('courseModalLabel').textContent = 'Editar doctor';

      const modalEl = document.getElementById('courseModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      const addButton = document.getElementById('addButton');
      addButton.textContent = 'Actualizar';

      addButton.replaceWith(addButton.cloneNode(true));
      const newAddButton = document.getElementById('addButton');

      newAddButton.addEventListener('click', async () => {
        const name = document.getElementById('client_name').value.trim();

        if (!name) {
          alert('Todos los campos son obligatorios');
          return;
        }

        try {
          const res = await fetch(APP_URL + 'update-doctor/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name})
          });

          if (!res.ok) throw new Error('Error al actualizar cliente');

          alert('cliente actualizado correctamente');
          modal.hide();
          location.reload();
        } catch (error) {
          console.error(error);
          alert('Error al actualizar cliente');
        }
      });
    })
    .catch(err => {
      console.error(err);
      alert('No se pudo cargar el cliente para editar');
    });
}

