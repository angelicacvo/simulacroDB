const APP_URL = "http://localhost:3000/"
const tbody_clients = document.getElementById("tbody_appointments");

const addButton = document.getElementById("addButton");
document.getElementById('upload_appointments').addEventListener('click', async () => {
    try {
      const res = await fetch(APP_URL +'upload-appointments', {
        method: 'POST'
      });
      const data = await res.json();
      alert(`${data.message}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  });

  (async function index() {
    const res = await fetch (APP_URL+"appointments");
    const data = await res.json();
    console.log("GET:", data);
    tbody_appointments.innerHTML = "";
    data.forEach(cliente => {
      tbody_appointments.innerHTML += `
      <tr>
        <td>${cliente.id_appointment}</td>
        <td>${cliente.date}</td>
        <td>${cliente.hour}</td>
        <td>${cliente.reason}</td>
        <td>${cliente.observations}</td>
        <td>${cliente.payment_method}</td>
        <td>${cliente.status}</td>
        <td>${cliente.client_name}</td>
        <td>${cliente.doctor_name}</td>
        <td>${cliente.speciality_name}</td>
        <td>${cliente.location_name}</td>
        <td>
            <button class="btn btn-sm btn-danger" onclick="deleteData(${cliente.id_appointment})">Eliminar</button>

        </td>
    </tr>
      `
      
    });
    
  })()

async function store() {
  try {
    const date = document.getElementById("client_date").value.trim();
    const hour = document.getElementById("client_hour").value.trim();
    const reason = document.getElementById("client_reason").value.trim();
    const observations = document.getElementById("client_observations").value.trim();
    const payment_method = document.getElementById("client_payment").value.trim();
    const status = document.getElementById("client_state").value.trim();
    const id_client = document.getElementById("client_id_client").value.trim();
    const id_doctor = document.getElementById("client_id_doctor").value.trim();
    const id_speciality = document.getElementById("client_id_speciality").value.trim();
    const id_location = document.getElementById("client_id_location").value.trim();

    // Validación simple
    if (
      !date || !hour || !reason || !observations || !payment_method ||
      !status || !id_client || !id_doctor || !id_speciality || !id_location
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const res = await fetch(APP_URL + 'upload-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date,
        hour,
        reason,
        observations,
        payment_method,
        status,
        id_client,
        id_doctor,
        id_speciality,
        id_location
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
  if (confirm("¿Seguro que quieres eliminar esta cita?")) {
    fetch(APP_URL + "appointments/" + id, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) throw new Error("Error al eliminar la cita");
      return response.json();
    })
    .then(data => {
      alert(data.mensaje);
      location.reload();
    })
    .catch(error => {
      console.error(error);
      alert("Hubo un problema al eliminar la cita");
    });
  }
}
