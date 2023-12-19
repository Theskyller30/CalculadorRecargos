function calculateCharges() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const dayOfWeek = new Date().getDay(); // 0 para Domingo, 6 para Sábado

    const start = convertTimeToHours(startTime);
    const end = convertTimeToHours(endTime);

    const results = [];

    // Trabajo Diurno y Nocturno
    const diurnoHours = calculateDiurnoHours(start, end);
    const nocturnoHours = calculateNocturnoHours(start, end);

    // Recargos
    const recargoNocturno = nocturnoHours * 0.35;
    const extraDiurno = diurnoHours > 8 ? (diurnoHours - 8) * 0.25 : 0;
    const extraNocturno = nocturnoHours > 8 ? (nocturnoHours - 8) * 0.75 : 0;

    // Trabajo en Domingo o Festivo
    const esDomingoOFestivo = dayOfWeek === 0 || esFestivo();
    const recargoDominical = esDomingoOFestivo ? (diurnoHours + nocturnoHours) * 0.75 : 0;

    results.push(`Horas diurnas trabajadas: ${diurnoHours}`);
    results.push(`Horas nocturnas trabajadas: ${nocturnoHours}`);
    results.push(`Recargo nocturno: ${recargoNocturno}`);
    results.push(`Hora extra diurna: ${extraDiurno}`);
    results.push(`Hora extra nocturna: ${extraNocturno}`);
    if (esDomingoOFestivo) {
        results.push(`Recargo dominical/festivo: ${recargoDominical}`);
    }

    document.getElementById('results').innerHTML = results.join('<br>');
}

function calculateDiurnoHours(start, end) {
    const diurnoStart = 6; // 6:00 am
    const diurnoEnd = 21; // 9:00 pm

    if (start >= diurnoEnd || end <= diurnoStart) {
        // No hay horas diurnas si el trabajo comienza después de las 9:00 pm o termina antes de las 6:00 am
        return 0;
    }

    const adjustedStart = Math.max(start, diurnoStart);
    const adjustedEnd = Math.min(end, diurnoEnd);

    return adjustedEnd - adjustedStart;
}

function calculateNocturnoHours(start, end) {
    const nocturnoStart = 21; // 9:00 pm
    const nocturnoEnd = 6; // 6:00 am del día siguiente

    if ((start >= nocturnoEnd && end <= nocturnoStart) || end <= start) {
        // No hay horas nocturnas si el trabajo es completamente durante el día
        return 0;
    }

    if (start >= nocturnoStart) {
        // El trabajo comienza por la noche y posiblemente continúa al día siguiente
        return (end > nocturnoStart ? 24 - start + nocturnoEnd : end - start);
    } else {
        // El trabajo comienza por la mañana y termina por la noche
        return (end > nocturnoStart ? end - nocturnoStart : 0);
    }
}


function convertTimeToHours(time) {
    const [hours, minutes] = time.split(':').map(n => parseFloat(n));
    return hours + minutes / 60;
}

function esFestivo() {
    // Implementar lógica para determinar si el día actual es festivo
    // Esto puede requerir una lista de fechas festivas o una API externa
    return false; // Por defecto, asume que no es festivo
}