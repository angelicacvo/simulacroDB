const APP_URL = "http://localhost:3000/"
const tbody_locations = document.getElementById("tbody_locations");

const addButton = document.getElementById("addButton");
document.getElementById('upload_locations').addEventListener('click', async () => {
    try {
      const res = await fetch(APP_URL +'upload-locations', {
        method: 'POST'
      });
      const data = await res.json();
      alert(`${data.message}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  });



(async function index() {
    const res = await fetch (APP_URL+"locations");
    const data = await res.json();
    console.log("GET:", data);
    tbody_locations.innerHTML = "";
    data.forEach(location => {
      tbody_locations.innerHTML += `
      <tr>
        <td>${location.id_location}</td>
        <td>${location.name}</td>
        <td>
             <button class="btn btn-sm btn-warning" onclick="updateData(${location.id_location})">update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteData(${location.id_location})">Eliminar</button>

        </td>
    </tr>
      `
      
    });
    
  })()


  async function store() {
  
  try {
  const location_name = document.getElementById("location_name").value.trim();

  if (!location_name) {
    alert("Todos los campos son obligatorios");
    return;
  }


  const resUsers = await fetch(APP_URL + "locations");
  const users = await resUsers.json();

  const existe = users.some(user => user.name.toLowerCase() === location_name.toLowerCase());
  if (existe) {
    alert("El location ya está registrado");
    return;
  }

  const res = await fetch(APP_URL + 'upload-location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: location_name,
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
  if (confirm("¿Seguro que quieres eliminar esta sede?")) {
    fetch(APP_URL + "locations/" + id, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) throw new Error("Error al eliminar la sede");
      return response.json();
    })
    .then(data => {
      alert(data.mensaje);
      location.reload();
    })
    .catch(error => {
      console.error(error);
      alert("Hubo un problema al eliminar el location");
    });
  }
}


function updateData(id) {
  fetch(APP_URL + 'locations/' + id)
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener el doctor');
      return res.json();
    })
    .then(cliente => {
      document.getElementById('location_name').value = cliente.name;


      document.getElementById('courseModalLabel').textContent = 'Editar doctor';

      const modalEl = document.getElementById('courseModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      const addButton = document.getElementById('addButton');
      addButton.textContent = 'Actualizar';

      addButton.replaceWith(addButton.cloneNode(true));
      const newAddButton = document.getElementById('addButton');

      newAddButton.addEventListener('click', async () => {
        const name = document.getElementById('location_name').value.trim();

        if (!name) {
          alert('Todos los campos son obligatorios');
          return;
        }

        try {
          const res = await fetch(APP_URL + 'update-location/' + id, {
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
