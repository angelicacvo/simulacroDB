const APP_URL = "http://localhost:3000/"
const tbody_transactions = document.getElementById("tbody_transactions");

const addButton = document.getElementById("addButton");
document.getElementById('upload_transactions').addEventListener('click', async () => {
  try {
    const res = await fetch(APP_URL + 'upload-transactions', {
      method: 'POST'
    });
    const data = await res.json();
    alert(`${data.message}`);
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
});

(async function index() {
  const res = await fetch(APP_URL + "transactions");
  const data = await res.json();
  console.log("GET:", data);
  tbody_transactions.innerHTML = "";
  data.forEach(transaction => {
    tbody_transactions.innerHTML += `
      <tr>
        <td>${transaction.id_transaction}</td>
        <td>${transaction.date}</td>
        <td>${transaction.hour}</td>
        <td>${transaction.amount}</td>
        <td>${transaction.status}</td>
        <td>${transaction.type}</td>
        <td>${transaction.id_invoice}</td>
        <td>
             <button class="btn btn-sm btn-warning" onclick="updateData('${transaction.id_transaction}')">update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteData('${transaction.id_transaction}')">Eliminar</button>
        </td>
    </tr>
      `

  });

})()

async function store() {

  try {
    const transaction_id_transaction = document.getElementById("transaction_id_transaction").value.trim();
    const transaction_date = document.getElementById("transaction_date").value.trim();
    const transaction_hour = document.getElementById("transaction_hour").value.trim();
    const transaction_amount = document.getElementById("transaction_amount").value.trim();
    const transaction_status = document.getElementById("transaction_status").value.trim();
    const transaction_type = document.getElementById("transaction_type").value.trim();
    const transaction_id_invoice = document.getElementById("transaction_id_invoice").value.trim();

    if (!transaction_id_transaction || !transaction_date || !transaction_hour || !transaction_amount || !transaction_status || !transaction_type || !transaction_id_invoice) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const restransactions = await fetch(APP_URL + "transactions");
    const transactions = await restransactions.json();

    const existe = transactions.some(transaction => transaction.id_transaction.toLowerCase() === transaction_id_transaction.toLowerCase());
    if (existe) {
      alert("El id ya está registrado");
      return;
    }

    const res = await fetch(APP_URL + 'upload-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_transaction: transaction_id_transaction,
        date: transaction_date,
        hour: transaction_hour,
        amount: transaction_amount,
        status: transaction_status,
        type: transaction_type,
        id_invoice: transaction_id_invoice
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
  if (confirm("¿Seguro que quieres eliminar esta transacción?")) {
    fetch(APP_URL + "transactions/" + id, {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) throw new Error("Error al eliminar transacción");
        return response.json();
      })
      .then(data => {
        alert(data.mensaje);
        location.reload();
      })
      .catch(error => {
        console.error(error);
        alert("Hubo un problema al eliminar la transacción");
      });
  }
}

function updateData(id) {
  fetch(APP_URL + 'transactions/' + id)
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener la transacción');
      return res.json();
    })
    .then(transaction => {
      document.getElementById("transaction_id_transaction").value = transaction.id_transaction;
      document.getElementById("transaction_date").value = transaction.date;
      document.getElementById("transaction_hour").value = transaction.hour;
      document.getElementById("transaction_amount").value = transaction.amount;
      document.getElementById("transaction_status").value = transaction.status;
      document.getElementById("transaction_type").value = transaction.type;
      document.getElementById("transaction_id_invoice").value = transaction.id_invoice;

      document.getElementById('courseModalLabel').textContent = 'Editar usuario';

      const modalEl = document.getElementById('courseModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      const addButton = document.getElementById('addButton');
      addButton.textContent = 'Actualizar';

      addButton.replaceWith(addButton.cloneNode(true));
      const newAddButton = document.getElementById('addButton');

      newAddButton.addEventListener('click', async () => {
        const transaction_date = document.getElementById("transaction_date").value.trim();
        const transaction_hour = document.getElementById("transaction_hour").value.trim();
        const transaction_amount = document.getElementById("transaction_amount").value.trim();
        const transaction_status = document.getElementById("transaction_status").value.trim();
        const transaction_type = document.getElementById("transaction_type").value.trim();
        const transaction_id_invoice = document.getElementById("transaction_id_invoice").value.trim();

        if (!transaction_date || !transaction_hour || !transaction_amount || !transaction_status || !transaction_type || !transaction_id_invoice) {
          alert('Todos los campos son obligatorios');
          return;
        }

        try {
          const res = await fetch(APP_URL + 'update-transaction/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({transaction_date,transaction_hour,transaction_amount,transaction_status,transaction_type,transaction_id_invoice})
          });

          if (!res.ok) throw new Error('Error al actualizar transacción');

          alert('Transacción actualizada correctamente');
          modal.hide();
          location.reload();
        } catch (error) {
          console.error(error);
          alert('Error al actualizar transacción');
        }
      });
    })
    .catch(err => {
      console.error(err);
      alert('No se pudo cargar la transacción para editar');
    });
}