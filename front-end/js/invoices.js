const APP_URL = "http://localhost:3000/"
const tbody_invoices = document.getElementById("tbody_invoices");

const addButton = document.getElementById("addButton");
document.getElementById('upload_invoices').addEventListener('click', async () => {
  try {
    const res = await fetch(APP_URL + 'upload-invoices', {
      method: 'POST'
    });
    const data = await res.json();
    alert(`${data.message}`);
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
});

(async function index() {
  const res = await fetch(APP_URL + "invoices");
  const data = await res.json();
  console.log("GET:", data);
  tbody_invoices.innerHTML = "";
  data.forEach(invoice => {
    tbody_invoices.innerHTML += `
      <tr>
        <td>${invoice.id_invoice}</td>
        <td>${invoice.used_platform}</td>
        <td>${invoice.billing_period}</td>
        <td>${invoice.amount}</td>
        <td>${invoice.amount_paid}</td>
        <td>${invoice.id_document}</td>
        <td>
             <button class="btn btn-sm btn-warning" onclick="updateData('${invoice.id_invoice}')">update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteData('${invoice.id_invoice}')">Eliminar</button>

        </td>
    </tr>
      `

  });

})()

async function store() {

  try {
    const invoice_id_invoice = document.getElementById("invoice_id_invoice").value.trim();
    const invoice_used_platform = document.getElementById("invoice_used_platform").value.trim();
    const invoice_billing_period = document.getElementById("invoice_billing_period").value.trim();
    const invoice_amount = document.getElementById("invoice_amount").value.trim();
    const invoice_amount_paid = document.getElementById("invoice_amount_paid").value.trim();
    const invoice_id_document = document.getElementById("invoice_id_document").value.trim();

    if (!invoice_id_invoice || !invoice_used_platform || !invoice_billing_period || !invoice_amount || !invoice_amount_paid || !invoice_id_document) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const resinvoices = await fetch(APP_URL + "invoices");
    const invoices = await resinvoices.json();

    const existe = invoices.some(invoice => invoice.id_invoice.toLowerCase() === invoice_id_invoice.toLowerCase());
    if (existe) {
      alert("El id ya está registrado");
      return;
    }

    const res = await fetch(APP_URL + 'upload-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_invoice: invoice_id_invoice, 
        used_platform: invoice_used_platform ,
        billing_period: invoice_billing_period,
        amount: invoice_amount,
        amount_paid: invoice_amount_paid,
        id_document: invoice_id_document
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
  id = String(id).trim();

  if (!id) {
    alert("ID inválido");
    return;
  }

  if (confirm("¿Seguro que quieres eliminar esta factura?")) {
    fetch(APP_URL + "invoices/" + encodeURIComponent(id), {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) throw new Error("Error al eliminar factura");
        return response.json();
      })
      .then(data => {
        alert(data.mensaje);
        location.reload();
      })
      .catch(error => {
        console.error(error);
        alert("Hubo un problema al eliminar factura");
      });
  }
}

function updateData(id) {
  fetch(APP_URL + 'invoices/' + id)
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener la factura');
      return res.json();
    })
    .then(invoice => {
    document.getElementById("invoice_id_invoice").value = invoice.id_invoice;
    document.getElementById("invoice_used_platform").value = invoice.used_platform;
    document.getElementById("invoice_billing_period").value = invoice.billing_period;
    document.getElementById("invoice_amount").value = invoice.amount;
    document.getElementById("invoice_amount_paid").value = invoice.amount_paid;
    document.getElementById("invoice_id_document").value = invoice.id_document;

      document.getElementById('courseModalLabel').textContent = 'Editar usuario';

      const modalEl = document.getElementById('courseModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      const addButton = document.getElementById('addButton');
      addButton.textContent = 'Actualizar';

      addButton.replaceWith(addButton.cloneNode(true));
      const newAddButton = document.getElementById('addButton');

      newAddButton.addEventListener('click', async () => {
        const invoice_used_platform = document.getElementById("invoice_used_platform").value.trim();
        const invoice_billing_period = document.getElementById("invoice_billing_period").value.trim();
        const invoice_amount = document.getElementById("invoice_amount").value.trim();
        const invoice_amount_paid = document.getElementById("invoice_amount_paid").value.trim();
        const invoice_id_document = document.getElementById("invoice_id_document").value.trim();

        
        if (!invoice_used_platform || !invoice_billing_period || !invoice_amount || !invoice_amount_paid || !invoice_id_document) {
          alert('Todos los campos son obligatorios');
          return;
        }

        try {
          const res = await fetch(APP_URL + 'update-invoice/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({invoice_used_platform, invoice_billing_period, invoice_amount, invoice_amount_paid, invoice_id_document})
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



