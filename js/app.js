'use strict';

// Menú desplegable para pantallas pequeñas.
const botonMenu = document.querySelector('.boton-menu');
const navegacion = document.querySelector('.navegacion');

if (botonMenu && navegacion) {
  botonMenu.addEventListener('click', () => {
    const abierto = navegacion.classList.toggle('abierta');
    botonMenu.setAttribute('aria-expanded', String(abierto));
  });
}

// Filtro de platos: modifica el DOM sin recargar la página.
const botonesFiltro = document.querySelectorAll('.filtro');
const platos = document.querySelectorAll('.plato');
const estadoFiltro = document.querySelector('#estado-filtro');

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    const categoria = boton.dataset.filtro;
    let visibles = 0;
    platos.forEach((plato) => {
      const mostrar = categoria === 'todos' || plato.dataset.categoria === categoria;
      plato.hidden = !mostrar;
      if (mostrar) visibles += 1;
    });
    botonesFiltro.forEach((elemento) => {
      const seleccionado = elemento === boton;
      elemento.classList.toggle('seleccionado', seleccionado);
      elemento.setAttribute('aria-pressed', String(seleccionado));
    });
    if (estadoFiltro) {
      estadoFiltro.textContent = `Se muestran ${visibles} platos.`;
    }
  });
});

// Validación del formulario de reservas.
const formulario = document.querySelector('#form-reserva');
if (formulario) {
  const fecha = document.querySelector('#fecha');
  const hoy = new Date();
  const fechaLocal = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
    .toISOString().split('T')[0];
  fecha.min = fechaLocal;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector('#nombre');
    const correo = document.querySelector('#correo');
    const personas = document.querySelector('#personas');
    const hora = document.querySelector('#hora');
    const mensaje = document.querySelector('#mensaje-formulario');
    const campos = [
      { input: nombre, error: 'error-nombre', valido: nombre.value.trim().length >= 3, texto: 'Escribe al menos 3 caracteres.' },
      { input: correo, error: 'error-correo', valido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()), texto: 'Ingresa un correo válido.' },
      { input: personas, error: 'error-personas', valido: personas.value !== '', texto: 'Selecciona el número de personas.' },
      { input: fecha, error: 'error-fecha', valido: fecha.value !== '' && fecha.value >= fechaLocal, texto: 'Selecciona una fecha válida.' },
      { input: hora, error: 'error-hora', valido: hora.value !== '', texto: 'Selecciona una hora.' }
    ];
    let formularioValido = true;
    campos.forEach((campo) => {
      const elementoError = document.getElementById(campo.error);
      campo.input.setAttribute('aria-invalid', String(!campo.valido));
      elementoError.textContent = campo.valido ? '' : campo.texto;
      if (!campo.valido) formularioValido = false;
    });
    if (!formularioValido) {
      mensaje.textContent = 'Revisa los campos señalados antes de continuar.';
      const primeroInvalido = campos.find((campo) => !campo.valido);
      primeroInvalido.input.focus();
      return;
    }
    const datos = new FormData(formulario);
    mensaje.textContent = `¡Gracias, ${datos.get('nombre').trim()}! Tu solicitud para ${datos.get('personas')} persona(s) el ${datos.get('fecha')} a las ${datos.get('hora')} quedó registrada en esta demostración.`;
    formulario.reset();
    fecha.min = fechaLocal;
    campos.forEach((campo) => campo.input.removeAttribute('aria-invalid'));
  });
}
