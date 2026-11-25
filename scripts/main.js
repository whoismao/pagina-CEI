/**
 * Utilidades compartidas para todas las páginas.
 * Requiere que existan los elementos #reloj-venezuela, #mes-año y #dias-grid.
 */
(function () {
  'use strict';

  const ZONA_VE = 'America/Caracas';

  /** Devuelve la fecha "actual" según la zona horaria de Venezuela. */
  function fechaVenezuela() {
    // Obtenemos las partes de la fecha en la zona VE.
    const partes = new Intl.DateTimeFormat('en-CA', {
      timeZone: ZONA_VE,
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const map = Object.fromEntries(partes.map(p => [p.type, p.value]));
    // Construimos un Date "local" con esos valores (para el calendario).
    return new Date(Number(map.year), Number(map.month) - 1, Number(map.day));
  }

  function actualizarRelojVenezuela() {
    const el = document.getElementById('reloj-venezuela');
    if (!el) return;
    const opciones = {
      timeZone: ZONA_VE,
      dateStyle: 'medium',
      timeStyle: 'medium'
    };
    el.textContent = new Intl.DateTimeFormat('es-VE', opciones).format(new Date());
  }

  function generarCalendario() {
    const gridDias = document.getElementById('dias-grid');
    const mesAnio = document.getElementById('mes-año');
    if (!gridDias || !mesAnio) return;

    const hoy = fechaVenezuela();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    const diaActual = hoy.getDate();

    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    mesAnio.textContent = `${nombresMeses[mesActual]} ${anioActual}`;

    const primerDiaMes = new Date(anioActual, mesActual, 1).getDay();
    const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
    const inicioSemana = (primerDiaMes === 0) ? 6 : primerDiaMes - 1;

    gridDias.innerHTML = '';

    for (let i = 0; i < inicioSemana; i++) {
      const vacio = document.createElement('div');
      vacio.className = 'dia-vacio';
      vacio.setAttribute('aria-hidden', 'true');
      gridDias.appendChild(vacio);
    }

    for (let i = 1; i <= diasEnMes; i++) {
      const diaElem = document.createElement('div');
      diaElem.className = 'dia-numero';
      diaElem.textContent = i;
      if (i === diaActual) {
        diaElem.classList.add('hoy');
        diaElem.setAttribute('aria-current', 'date');
      }
      gridDias.appendChild(diaElem);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    actualizarRelojVenezuela();
    setInterval(actualizarRelojVenezuela, 1000);
    generarCalendario();
  });
})();