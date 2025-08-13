const APP_URL = "http://localhost:3000/"
const tbody_clients = document.getElementById("tbody_clients");

const addButton = document.getElementById("addButton");
document.getElementById('upload_users').addEventListener('click', async () => {
  try {
    const res = await fetch(APP_URL + 'upload-users', {
      method: 'POST'
    });
    const data = await res.json();
    alert(`${data.message}`);
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
});

(async function index() {
  const res = await fetch(APP_URL + "users");
  const data = await res.json();
  console.log("GET:", data);
  tbody_clients.innerHTML = "";
  data.forEach(cliente => {
    tbody_clients.innerHTML += `
      <tr>
        <td>${cliente.document_number}</td>
        <td>${cliente.full_name}</td>
        <td>${cliente.address}</td>
        <td>${cliente.phone_number}</td>
        <td>${cliente.email}</td>
        <td>
             <button class="btn btn-sm btn-warning" onclick="updateData(${cliente.document_number})">update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteData(${cliente.document_number})">Eliminar</button>

        </td>
    </tr>
      `

  });

})()

async function store() {

  try {
    const user_document_number = document.getElementById("user_document_number").value.trim();
    const user_full_name = document.getElementById("user_full_name").value.trim();
    const user_address = document.getElementById("user_address").value.trim();
    const user_phone_number = document.getElementById("user_phone_number").value.trim();
    const user_email = document.getElementById("user_email").value.trim();

    if (!user_document_number || !user_full_name || !user_address || !user_phone_number || !user_email) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const resUsers = await fetch(APP_URL + "users");
    const users = await resUsers.json();

    const existe = users.some(userr => userr.email.toLowerCase() === user_email.toLowerCase());
    if (existe) {
      alert("El email ya está registrado");
      return;
    }

    const res = await fetch(APP_URL + 'upload-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document_number: user_document_number, 
        full_name: user_full_name ,
        address: user_address,
        phone_number: user_phone_number,
        email: user_email
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
    fetch(APP_URL + "users/" + id, {
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


function updateData(document_number) {
  fetch(APP_URL + 'users/' + document_number) // ← coincide con tu backend
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener el cliente');
      return res.json();
    })
    .then(cliente => {
      // Coincidir con los nombres reales de la base de datos
      document.getElementById('client_name').value = cliente.full_name;
      document.getElementById('client_email').value = cliente.email;

      document.getElementById('courseModalLabel').textContent = 'Editar cliente';

      const modalEl = document.getElementById('courseModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      const addButton = document.getElementById('addButton');
      addButton.textContent = 'Actualizar';

      // Evita duplicar eventos
      addButton.replaceWith(addButton.cloneNode(true));
      const newAddButton = document.getElementById('addButton');

      newAddButton.addEventListener('click', async () => {
        const full_name = document.getElementById('client_name').value.trim();
        const email = document.getElementById('client_email').value.trim();

        if (!full_name || !email) {
          alert('Todos los campos son obligatorios');
          return;
        }

        try {
          const res = await fetch(APP_URL + 'update-user/' + document_number, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email }) // usa las claves correctas
          });

          if (!res.ok) throw new Error('Error al actualizar cliente');

          alert('Cliente actualizado correctamente');
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


