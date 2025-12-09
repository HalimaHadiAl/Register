let currentStep = 1;
const totalSteps = 3;
const form = document.getElementById('registrationForm');
const successModal = new bootstrap.Modal(document.getElementById('successModal'));
const alamatContainer = document.getElementById('alamat-field-container');
const alamatTextarea = document.getElementById('alamat_pengiriman');
const angkatanKuliahInput = document.getElementById('angkatan_kuliah'); // Target Input
const yearDropdown = document.getElementById('year-dropdown'); // Target Dropdown

function updateFormSteps() {
    document.querySelectorAll('.form-step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById(`step${currentStep}`).style.display = 'block';
    document.querySelectorAll('.step-indicator .step').forEach((indicator, index) => {
        const stepNum = index + 1;
        indicator.classList.remove('active', 'complete');
        if (stepNum < currentStep) {
            indicator.classList.add('complete');
        } else if (stepNum === currentStep) {
            indicator.classList.add('active');
        }
    });
}
function nextStep(step) {
    currentStep = step;
    updateFormSteps();
}

function prevStep(step) {
    currentStep = step;
    updateFormSteps();
}
function toggleAlamatField(show) {
    if (show) {
        alamatContainer.style.display = 'block';
        alamatTextarea.setAttribute('required', 'required');
        alamatTextarea.removeAttribute('disabled');
    } else {
        alamatContainer.style.display = 'none';
        alamatTextarea.removeAttribute('required');
        alamatTextarea.setAttribute('disabled', 'disabled');
        alamatTextarea.value = '';
        alamatTextarea.classList.remove('is-invalid');
    }
}

function validateStep2() {
    const fields = [
        'nama_lengkap', 'angkatan_kuliah', 'no_wa', 'jurusan', 
        'jumlah_pembelian', 'foto_profil', 'bukti_transfer_kta'
    ];
    let isValid = true;

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const isFile = field.type === 'file';
        // Check required fields (termasuk input tahun yang sudah diisi value-nya)
        if (field.required && ((!isFile && field.value.trim() === '') || (isFile && field.files.length === 0))) {
            isValid = false;
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
        }
    });
    // Check Angkatan Kuliah format (should be 4 digits year)
    const yearValue = angkatanKuliahInput.value.trim();
    const currentYear = new Date().getFullYear() + 4; // Lulus bisa sampai 4 tahun ke depan jika angkatan baru
    if (yearValue.length !== 4 || isNaN(yearValue) || parseInt(yearValue) < 1980 || parseInt(yearValue) > currentYear) {
        isValid = false;
        angkatanKuliahInput.classList.add('is-invalid');
    } else {
        angkatanKuliahInput.classList.remove('is-invalid');
    }
    const isDiantar = document.getElementById('pengiriman_antar').checked;
    if (isDiantar) {
        if (alamatTextarea.value.trim() === '') {
            isValid = false;
            alamatTextarea.classList.add('is-invalid');
        } else {
            alamatTextarea.classList.remove('is-invalid');
        }
    }
    if (isValid) {
        nextStep(3);
        document.getElementById('message2').innerHTML = '';
    } else {
        document.getElementById('message2').innerHTML = '<div class="alert alert-danger small py-2 mt-3"><i class="bi bi-exclamation-triangle-fill me-2"></i>Harap lengkapi semua data wajib diisi dengan benar.</div>';
    }
}

function toggleDonationFields(show) {
    const donationFields = document.getElementById('donation-fields');
    const jumlahDonasi = document.getElementById('jumlah_donasi');
    const buktiTransferDonasi = document.getElementById('bukti_transfer_donasi');
    if (show) {
        donationFields.style.display = 'block';
        jumlahDonasi.removeAttribute('required');
        buktiTransferDonasi.removeAttribute('required');
    } else {
        donationFields.style.display = 'none';
        jumlahDonasi.removeAttribute('required');
        buktiTransferDonasi.removeAttribute('required');
        jumlahDonasi.value = '';
        buktiTransferDonasi.value = '';
        jumlahDonasi.classList.remove('is-invalid');
        buktiTransferDonasi.classList.remove('is-invalid');
    }
}
// --- FUNGSI DROPDOWN TAHUN KUSTOM BARU ---

function populateYearDropdown() {
    const startYear = 1980; 
    const endYear = new Date().getFullYear() + 4; // Anggap maksimal tahun lulus adalah 4 tahun ke depan
    yearDropdown.innerHTML = ''; 
    for (let year = endYear; year >= startYear; year--) {
        const item = document.createElement('a');
        item.classList.add('year-dropdown-item');
        item.href = 'javascript:void(0)'; // Non-link behavior
        item.textContent = year;
        item.setAttribute('data-year', year);
        yearDropdown.appendChild(item);
    }
}

function toggleYearDropdown(show) {
    yearDropdown.style.display = show ? 'block' : 'none';
}
function handleYearSelection(event) {
    const target = event.target;
    if (target.classList.contains('year-dropdown-item')) {
        const selectedYear = target.getAttribute('data-year');
        angkatanKuliahInput.value = selectedYear;
        angkatanKuliahInput.classList.remove('is-invalid'); // Hapus pesan error jika ada
        toggleYearDropdown(false);
    }
}
// Panggil saat input diklik
angkatanKuliahInput.addEventListener('click', function(e) {
    e.stopPropagation(); // Stop event propagation
    toggleYearDropdown(true);

    // Highlight tahun yang sudah dipilih
    document.querySelectorAll('.year-dropdown-item').forEach(item => {
        item.classList.remove('selected');
        if (item.getAttribute('data-year') === this.value) {
            item.classList.add('selected');
            // Scroll ke tahun yang dipilih
            item.parentNode.scrollTop = item.offsetTop - item.parentNode.offsetTop - item.parentNode.offsetHeight / 2;
        }
    });
});

// Panggil saat klik di luar dropdown untuk menutupnya
document.addEventListener('click', function(e) {
    if (!yearDropdown.contains(e.target) && e.target !== angkatanKuliahInput) {
        toggleYearDropdown(false);
    }
});

// Panggil saat item dropdown dipilih
yearDropdown.addEventListener('click', handleYearSelection);
// --- AKHIR FUNGSI DROPDOWN TAHUN KUSTOM ---

// Handle Final Submit
form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const donasiRadios = document.getElementsByName('bersedia_donasi');
    let isDonasiSelected = false;
    donasiRadios.forEach(radio => {
        if (radio.checked) isDonasiSelected = true;
    });
    if (!isDonasiSelected) {
        document.getElementById('message3').innerHTML = '<div class="alert alert-danger small py-2 mt-3"><i class="bi bi-exclamation-triangle-fill me-2"></i>Harap pilih opsi donasi (Ya/Tidak).</div>';
        return;
    }
    document.getElementById('message3').innerHTML = '<div class="alert alert-info small py-3"><i class="bi bi-hourglass-split me-2"></i>Sedang memproses data...</div>';

    // Simulasi pengiriman data
    setTimeout(() => {
        document.getElementById('message3').innerHTML = ''; 
        successModal.show();
        form.reset();
        currentStep = 1;
        updateFormSteps();
        toggleDonationFields(false);
        toggleAlamatField(false);
        document.getElementById('pengiriman_ambil').checked = true;
        toggleYearDropdown(false); // Pastikan dropdown tertutup setelah reset
    }, 3000); 
});

// Initialize form
populateYearDropdown(); // Isi daftar tahun saat load
updateFormSteps();
toggleAlamatField(false);
