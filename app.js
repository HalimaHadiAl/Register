document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-register");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById("btn-submit");
        submitBtn.disabled = true;
        submitBtn.innerText = "Mengirim...";

        const formData = new FormData(form);

        try {
            const response = await fetch("http://localhost:8000/api/alumni", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                // tampilkan modal berhasil
                document.getElementById("successModal").classList.add("show");
                form.reset();
            } else {
                alert("Terjadi kesalahan: " + (result.message ?? "Cek kembali form"));
            }

        } catch (error) {
            alert("Gagal menghubungi server Laravel!");
            console.error(error);
        }

        submitBtn.disabled = false;
        submitBtn.innerText = "Kirim";
    });
});
