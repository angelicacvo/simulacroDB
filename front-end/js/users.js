const APP_URL = "http://localhost:3000/"
const tbody_users = document.getElementById("tbody_users");

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
  tbody_users.innerHTML = "";
  data.forEach(user => {
    tbody_users.innerHTML += `
      <tr>
        <td>${user.id_document}</td>
        <td>${user.full_name}</td>
        <td>${user.address}</td>
        <td>${user.phone_number}</td>
        <td>${user.email}</td>
        <td>
             <button class="btn btn-sm btn-warning" onclick="updateData(${user.id_document})">update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteData(${user.id_document})">Eliminar</button>

        </td>
    </tr>
      `

  });

})()

async function store() {

  try {
    const user_id_document = document.getElementById("user_id_document").value.trim();
    const user_full_name = document.getElementById("user_full_name").value.trim();
    const user_address = document.getElementById("user_address").value.trim();
    const user_phone_number = document.getElementById("user_phone_number").value.trim();
    const user_email = document.getElementById("user_email").value.trim();

    if (!user_id_document || !user_full_name || !user_address || !user_phone_number || !user_email) {
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
        id_document: user_id_document, 
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

function updateData(id) {
  fetch(APP_URL + 'users/' + id)
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener el usuario');
      return res.json();
    })
    .then(user => {
      document.getElementById("user_full_name").value = user.full_name;
      document.getElementById("user_address").value = user.address;
      document.getElementById("user_phone_number").value = user.phone_number;
      document.getElementById("user_email").value = user.email;

      document.getElementById('courseModalLabel').textContent = 'Editar usuario';

      const modalEl = document.getElementById('courseModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      const addButton = document.getElementById('addButton');
      addButton.textContent = 'Actualizar';

      addButton.replaceWith(addButton.cloneNode(true));
      const newAddButton = document.getElementById('addButton');

      newAddButton.addEventListener('click', async () => {
        const user_full_name = document.getElementById("user_full_name").value.trim();
        const user_address = document.getElementById("user_address").value.trim();
        const user_phone_number = document.getElementById("user_phone_number").value.trim();
        const user_email = document.getElementById("user_email").value.trim();

        if (!user_full_name || !user_address || !user_phone_number || !user_email) {
          alert('Todos los campos son obligatorios');
          return;
        }

        try {
          const res = await fetch(APP_URL + 'update-user/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({user_full_name, user_address, user_phone_number, user_email})
          });

          if (!res.ok) throw new Error('Error al actualizar usuario');

          alert('Usuario actualizado correctamente');
          modal.hide();
          location.reload();
        } catch (error) {
          console.error(error);
          alert('Error al actualizar usuario');
        }
      });
    })
    .catch(err => {
      console.error(err);
      alert('No se pudo cargar el usuario para editar');
    });
}



