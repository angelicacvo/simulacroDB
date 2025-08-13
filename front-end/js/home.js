const APP_URL = "http://localhost:3000/"
const tbody_clients = document.getElementById("tbody_clients");

const addButton = document.getElementById("addButton");
document.getElementById('upload_clients').addEventListener('click', async () => {
    try {
      const res = await fetch(APP_URL +'upload-clients', {
        method: 'POST'
      });
      const data = await res.json();
      alert(`${data.message}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  });

  (async function index() {
    const res = await fetch (APP_URL+"clients");
    const data = await res.json();
    console.log("GET:", data);
    tbody_clients.innerHTML = "";
    data.forEach(cliente => {
      tbody_clients.innerHTML += `
      <tr>
        <td>${cliente.id_client}</td>
        <td>${cliente.name}</td>
        <td>${cliente.email}</td>
        <td>
            <a href="" class="btn btn-sm btn-info">Detalles</a>
             <button class="btn btn-sm btn-warning" onclick="updateData(${cliente.id_client})">update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteData(${cliente.id_client})">Eliminar</button>

        </td>
    </tr>
      `
      
    });
    
  })()
  
async function store() {
  
  try {
  const client_name = document.getElementById("client_name").value.trim();
  const client_email = document.getElementById("client_email").value.trim();

  if (!client_name || !client_email) {
    alert("Todos los campos son obligatorios");
    return;
  }


  const resUsers = await fetch(APP_URL + "clients");
  const users = await resUsers.json();

  const existe = users.some(user => user.email.toLowerCase() === client_email.toLowerCase());
  if (existe) {
    alert("El email ya está registrado");
    return;
  }

  const res = await fetch(APP_URL + 'upload-client', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: client_name,
      email: client_email
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
  if (confirm("¿Seguro que quieres eliminar este cliente?")) {
    fetch(APP_URL + "clients/" + id, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) throw new Error("Error al eliminar cliente");
      return response.json();
    })
    .then(data => {
      alert(data.mensaje);
      location.reload();
    })
    .catch(error => {
      console.error(error);
      alert("Hubo un problema al eliminar el cliente");
    });
  }
}


function updateData(id) {
  fetch(APP_URL + 'clients/' + id)
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener el cliente');
      return res.json();
    })
    .then(cliente => {
      document.getElementById('client_name').value = cliente.name;
      document.getElementById('client_email').value = cliente.email;

      document.getElementById('courseModalLabel').textContent = 'Editar cliente';

      const modalEl = document.getElementById('courseModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      const addButton = document.getElementById('addButton');
      addButton.textContent = 'Actualizar';

      addButton.replaceWith(addButton.cloneNode(true));
      const newAddButton = document.getElementById('addButton');

      newAddButton.addEventListener('click', async () => {
        const name = document.getElementById('client_name').value.trim();
        const email = document.getElementById('client_email').value.trim();

        if (!name || !email) {
          alert('Todos los campos son obligatorios');
          return;
        }

        try {
          const res = await fetch(APP_URL + 'update-client/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
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
