function checkForm() {
    const formFields = [
        document.getElementById("nombre"),
        document.getElementById("email"),
        document.getElementById("telefono")
    ];

    let allFilled = true;

    formFields.forEach(field => {
        if (field.value.trim() === "") {
            allFilled = false;
            console.log(`El campo "${field.name}" está vacío.`);
        }
    });

    if (allFilled) {
        console.log("Todos los campos están completos.");
    } else {
        console.log("Por favor, completa todos los campos del formulario.");
    }
}
