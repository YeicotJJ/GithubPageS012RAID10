let currentRAID = "RAID1";
let raid1Data = [0, 0];
let raid10Data = [0, 0, 0, 0];
let diskSizeRAID1 = 100;
let diskSizePair1 = 100;
let diskSizePair2 = 100;

function setDiskSizeRAID1() {
    diskSizeRAID1 = parseInt(document.getElementById("diskSizeRAID1").value, 10);
    document.getElementById("capacityDisplayRAID1").innerText = `${diskSizeRAID1} GB`;
    clearStorage(); // Restablece el almacenamiento cuando cambia la capacidad en RAID 1
}

function setDiskSizeRAID10() {
    diskSizePair1 = parseInt(document.getElementById("diskSizePair1").value, 10);
    diskSizePair2 = parseInt(document.getElementById("diskSizePair2").value, 10);
    document.getElementById("capacityDisplayPair1").innerText = `${diskSizePair1} GB`;
    document.getElementById("capacityDisplayPair2").innerText = `${diskSizePair2} GB`;
    clearStorage(); // Restablece el almacenamiento cuando cambia la capacidad en RAID 10
}

function toggleRAID() {
    const raid1Section = document.getElementById("raid1");
    const raid10Section = document.getElementById("raid10");
    const raid1Settings = document.getElementById("raid1-settings");
    const raid10Settings = document.getElementById("raid10-settings");

    if (currentRAID === "RAID1") {
        raid1Section.style.display = "none";
        raid1Settings.style.display = "none"
        raid10Section.style.display = "block";
        raid10Settings.style.display = "block"
        document.getElementById("notification2").style.display = "block";
        currentRAID = "RAID10";
    } else {
        raid10Section.style.display = "none";
        raid10Settings.style.display = "none"
        document.getElementById("notification2").style.display = "none";
        raid1Section.style.display = "block";
        raid1Settings.style.display = "block"
        currentRAID = "RAID1";
    }

    clearStorage()

}

function showNotification1(message) {
    const notification = document.getElementById("notification1");

    if (((raid1Data[0] / diskSizeRAID1 * 100).toFixed(0)) == 100) {
        notification.style.backgroundColor = "red"
    } else if (((raid10Data[0] / diskSizePair1 * 100).toFixed(0)) == 100) {
        notification.style.backgroundColor = "red"
    } else {
        notification.style.backgroundColor = "#444"
    }

    notification.innerText = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 2000); //tiempo de la notificación. ejm : 2000 = (2s)
}

function showNotification2(message) {
    const notification = document.getElementById("notification2");

    if (((raid10Data[2] / diskSizePair2 * 100).toFixed(0)) == 100) {
        notification.style.backgroundColor = "red"
    } else {
        notification.style.backgroundColor = "#444"
    }

    notification.innerText = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 2000); //tiempo de la notificación. ejm : 2000 = (2s)
}


function addData(type, diskNumber) {
    let increment;
    if (type === "RAID1") {
        increment = diskSizeRAID1 / (diskSizeRAID1 / 10); // Incremento en función del tamaño en RAID 1
        raid1Data[0] = Math.min(raid1Data[0] + increment, diskSizeRAID1);
        raid1Data[1] = raid1Data[0];
        updateDiskDisplay("#raid1 .disk", raid1Data, diskSizeRAID1);
        showNotification1(`Datos añadidos a RAID 1: Ambos discos llenados a ${(raid1Data[0] / diskSizeRAID1 * 100).toFixed(0)}%`);
    } else if (type === "RAID10") {
        if (diskNumber === 1 || diskNumber === 2) {
            increment = diskSizePair1 / (diskSizePair1 / 10); // Incremento en función del tamaño en el primer par
            raid10Data[0] = Math.min(raid10Data[0] + increment, diskSizePair1);
            raid10Data[1] = raid10Data[0];
            showNotification1(`Datos añadidos a RAID 10: Discos 1 y 2 llenados a ${(raid10Data[0] / diskSizePair1 * 100).toFixed(0)}%`);
        } else {
            increment = diskSizePair2 / (diskSizePair2 / 10); // Incremento en función del tamaño en el segundo par
            raid10Data[2] = Math.min(raid10Data[2] + increment, diskSizePair2);
            raid10Data[3] = raid10Data[2];
            showNotification2(`Datos añadidos a RAID 10: Discos 3 y 4 llenados a ${(raid10Data[2] / diskSizePair2 * 100).toFixed(0)}%`);
        }
        updateDiskDisplay("#raid10 .disk", raid10Data, diskSizePair1, diskSizePair2);
    }
    createParticles(event);
}

function updateDiskDisplay(diskSelector, dataArray, size1, size2) {
    const disks = document.querySelectorAll(diskSelector);
    disks.forEach((disk, index) => {
        const fill = disk.querySelector(".fill");
        const maxDiskSize = index < 2 ? size1 : size2; // Capacidad del par correspondiente
        fill.style.height = (dataArray[index] / maxDiskSize * 100) + "%";
    });
}

function clearStorage() {
    if (currentRAID === "RAID1") {
        raid1Data = [0, 0];
        updateDiskDisplay("#raid1 .disk", raid1Data, diskSizeRAID1);
        showNotification1("Almacenamiento vaciado en todos los discos.");
    } else {
        raid10Data = [0, 0, 0, 0];
        updateDiskDisplay("#raid10 .disk", raid10Data, diskSizePair1, diskSizePair2);
        showNotification1("Almacenamiento vaciado en los discos 1 y 2.");
        showNotification2("Almacenamiento vaciado en los discos 3 y 4.");
    }

    const notifications = document.getElementsByClassName("notification");

    for (let i = 0; i < notifications.length; i++) {
        notifications[i].style.backgroundColor = "#444";
    }

}

function createParticles(event) {
    const disk = event.currentTarget;
    const rect = disk.getBoundingClientRect();

    for (let i = 0; i < 6; i++) { // Crea 6 partículas
        const particle = document.createElement("div");
        particle.classList.add("particle");

        // Asignar una posición inicial aleatoria dentro del disco
        particle.style.left = Math.random() * rect.width + "px";
        particle.style.bottom = "0px";

        // Asignar un tamaño y color aleatorio
        const size = Math.random() * 10 + 5; // Tamaño entre 5 y 15 px
        particle.style.width = size + "px";
        particle.style.height = size + "px";
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        // Añadir la partícula al disco
        disk.appendChild(particle);

        // Animar la partícula
        animateParticle(particle, rect);
    }
}

function animateParticle(particle, rect) {
    const duration = Math.random() * 1000 + 1000; // Duración entre 500 y 1000 ms
    const targetY = Math.random() * -100 - 70; // Movimiento hacia arriba

    particle.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(${targetY}px)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'ease-out',
        fill: 'forwards'
    });

    // Eliminar la partícula después de la animación
    setTimeout(() => {
        particle.remove();
    }, duration);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("raid10").style.display = "none";
    setDiskSizeRAID1(); // Inicializa el tamaño de almacenamiento en RAID 1
    setDiskSizeRAID10(); // Inicializa el tamaño de almacenamiento en RAID 10
});

document.getElementById("infoButton").addEventListener("click", function() {
    alert("Autores:\n-Yeicot Sarmiento\n-Pyerina Rivera\n-Ana Chumacero");
});
