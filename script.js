document.getElementById('chargeCalculator').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateCharges();
});

function calculateCharges() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
        alert('Formato de hora incorrecto. Utilice el formato HH:MM.');
        return;
    }

    const workSchedule1 = document.getElementById('workSchedule1').checked;
    const workSchedule2 = document.getElementById('workSchedule2').checked;
    if (!workSchedule1 && !workSchedule2) {
        alert('Debe seleccionar al menos un horario.');
        return;
    }

    const start = convertTimeToHours(startTime);
    const end = convertTimeToHours(endTime);

    if (start > end) {
        alert('La hora de fin no puede ser anterior a la hora de inicio.');
        return;
    }

    const isSunday = document.getElementById('isSunday').checked;
    const isHoliday = document.getElementById('isHoliday').checked;

    const esDomingoOFestivo = isSunday || isHoliday;

    const diurnoHours = Math.round(calculateDiurnoHours(start, end));
    const nocturnoHours = Math.round(calculateNocturnoHours(start, end));

    let recargoNocturno = 0,
        extraDiurno = 0,
        extraNocturno = 0,
        recargoDominical = 0,
        extraDiurnoDominical = 0,
        extraNocturnoDominical = 0;

    recargoNocturno = workSchedule1 ? nocturnoHours : 0;
    extraDiurno = workSchedule2 && diurnoHours > 8 ? diurnoHours - 8 : 0;
    extraNocturno = workSchedule1 && nocturnoHours > 8 ? nocturnoHours - 8 : 0;
    recargoDominical = esDomingoOFestivo ? diurnoHours + nocturnoHours : 0;
    extraDiurnoDominical = esDomingoOFestivo && workSchedule2 && diurnoHours > 8 ? diurnoHours - 8 : 0;
    extraNocturnoDominical = esDomingoOFestivo && workSchedule1 && nocturnoHours > 8 ? nocturnoHours - 8 : 0;

    const results = [
        `Horas diurnas trabajadas: ${diurnoHours}`,
        `Horas nocturnas trabajadas: ${nocturnoHours}`,
        `Recargo nocturno (horas): ${recargoNocturno}`,
        `Hora extra diurna (horas): ${extraDiurno}`,
        `Hora extra nocturna (horas): ${extraNocturno}`
    ];

    if (esDomingoOFestivo) {
        results.push(`Dominical/festivo (horas): ${recargoDominical}`);
        results.push(`Hora extra diurna dominical/festiva (horas): ${extraDiurnoDominical}`);
        results.push(`Hora extra nocturna dominical/festiva (horas): ${extraNocturnoDominical}`);
    }

    document.getElementById('results').innerHTML = results.join('<br>');
}

function validateTimeFormat(time) {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

function calculateDiurnoHours(start, end) {
    const diurnoStart = 6; // 6:00 am
    const diurnoEnd = 21; // 9:00 pm

    if (start > end) {
        return (diurnoEnd - start) + Math.max(0, end - diurnoStart);
    }

    return Math.max(0, Math.min(end, diurnoEnd) - Math.max(start, diurnoStart));
}

function calculateNocturnoHours(start, end) {
    const nocturnoStart = 21; // 9:00 pm
    const nocturnoEnd = 6; // 6:00 am

    if (start > end) {
        return (24 - start) + Math.min(end, 6);
    }

    if (start >= 21) {
        return Math.min(24, end + 24) - start;
    }
    if (end <= 6) {
        return end;
    }
    return Math.max(0, end - 21);
}

function convertTimeToHours(time) {
    const [hours, minutes] = time.split(':').map(n => parseFloat(n));
    return hours + minutes / 60;
}

document.addEventListener('DOMContentLoaded', function() {
    const isSundayCheckbox = document.getElementById('isSunday');
    const isHolidayCheckbox = document.getElementById('isHoliday');
    const workSchedule1Checkbox = document.getElementById('workSchedule1');
    const workSchedule2Checkbox = document.getElementById('workSchedule2');

    function toggleCheckbox(checkbox1, checkbox2) {
        if (checkbox1.checked && checkbox2.checked) {
            checkbox2.checked = false;
        }
    }

    isSundayCheckbox.addEventListener('change', function() {
        toggleCheckbox(isSundayCheckbox, isHolidayCheckbox);
    });

    isHolidayCheckbox.addEventListener('change', function() {
        toggleCheckbox(isHolidayCheckbox, isSundayCheckbox);
    });

    workSchedule1Checkbox.addEventListener('change', function() {
        toggleCheckbox(workSchedule1Checkbox, workSchedule2Checkbox);
    });

    workSchedule2Checkbox.addEventListener('change', function() {
        toggleCheckbox(workSchedule2Checkbox, workSchedule1Checkbox);
    });
});