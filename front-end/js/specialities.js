const APP_URL = "http://localhost:3000/"
const tbody_specialities = document.getElementById("tbody_specialities");

const addButton = document.getElementById("addButton");
document.getElementById('upload_specialities').addEventListener('click', async () => {
    try {
      const res = await fetch(APP_URL +'upload-specialities', {
        method: 'POST'
      });
      const data = await res.json();
      alert(`${data.message}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  });

  (async function index() {
    const res = await fetch (APP_URL+"specialities");
    const data = await res.json();
    console.log("GET:", data);
    tbody_specialities.innerHTML = "";
    data.forEach(especiality => {
      tbody_specialities.innerHTML += `
      <tr>
        <td>${especiality.id_speciality}</td>
        <td>${especiality.name}</td>
        <td>
             <button class="btn btn-sm btn-warning" onclick="updateData(${especiality.id_speciality})">update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteData(${especiality.id_speciality})">Eliminar</button>

        </td>
    </tr>
      `
      
    });
    
  })()


async function store() {
  
  try {
  const speciality_name = document.getElementById("speciality_name").value.trim();

  if (!speciality_name) {
    alert("Todos los campos son obligatorios");
    return;
  }


  const resUsers = await fetch(APP_URL + "specialities");
  const users = await resUsers.json();

  const existe = users.some(user => user.name.toLowerCase() === speciality_name.toLowerCase());
  if (existe) {
    alert("ecpecialidad ya está registrada");
    return;
  }

  const res = await fetch(APP_URL + 'upload-speciality', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: speciality_name,
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
  if (confirm("¿Seguro que quieres eliminar esta especialidad?")) {
    fetch(APP_URL + "specialities/" + id, {
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
  fetch(APP_URL + 'specialities/' + id)
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener la especialidad');
      return res.json();
    })
    .then(cliente => {
      document.getElementById('speciality_name').value = cliente.name;


      document.getElementById('courseModalLabel').textContent = 'Editar especialidad';

      const modalEl = document.getElementById('courseModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      const addButton = document.getElementById('addButton');
      addButton.textContent = 'Actualizar';

      addButton.replaceWith(addButton.cloneNode(true));
      const newAddButton = document.getElementById('addButton');

      newAddButton.addEventListener('click', async () => {
        const name = document.getElementById('speciality_name').value.trim();

        if (!name) {
          alert('Todos los campos son obligatorios');
          return;
        }

        try {
          const res = await fetch(APP_URL + 'update-speciality/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name})
          });

          if (!res.ok) throw new Error('Error al actualizar especialidad');

          alert('especialidad actualizada correctamente');
          modal.hide();
          location.reload();
        } catch (error) {
          console.error(error);
          alert('Error al actualizar especialidad');
        }
      });
    })
    .catch(err => {
      console.error(err);
      alert('No se pudo cargar la especialidad para editar');
    });
}
