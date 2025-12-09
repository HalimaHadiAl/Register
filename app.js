// app.js
const form = document.getElementById('registrationForm');
const successModal = new bootstrap.Modal(document.getElementById('successModal'));
const alamatContainer = document.getElementById('alamat-field-container');
const alamatTextarea = document.getElementById('alamat_pengiriman');

function nextStep(n){ document.getElementById(`step${n}`).style.display='block'; document.querySelectorAll('.form-step').forEach(s=>{ if(s.id!=='step'+n) s.style.display='none'; }) }
function prevStep(n){ nextStep(n) }
function toggleAlamatField(show){
  if(show){ alamatContainer.style.display='block'; alamatTextarea.removeAttribute('disabled'); alamatTextarea.setAttribute('required','required') }
  else { alamatContainer.style.display='none'; alamatTextarea.setAttribute('disabled','disabled'); alamatTextarea.removeAttribute('required'); alamatTextarea.value='' }
}

function toggleDonationFields(show){
  const el = document.getElementById('donation-fields');
  el.style.display = show ? 'block' : 'none';
  if(!show){
    document.getElementById('jumlah_donasi').value = '';
    document.getElementById('bukti_transfer_donasi').value = '';
  }
}

// year dropdown
const yearInput = document.getElementById('tahun_lulus');
const yearDropdown = document.getElementById('year-dropdown');
function populateYears(){
  const start = 1980, end = new Date().getFullYear()+4;
  for(let y=end;y>=start;y--){
    const a=document.createElement('div'); a.className='year-dropdown-item'; a.textContent=y; a.dataset.year=y;
    yearDropdown.appendChild(a);
  }
}
yearInput.addEventListener('click', (e)=>{ e.stopPropagation(); yearDropdown.style.display='block'; })
yearDropdown.addEventListener('click', (ev)=>{ const t=ev.target; if(t.dataset.year){ yearInput.value=t.dataset.year; yearDropdown.style.display='none'; }})
document.addEventListener('click', (e)=>{ if(!yearDropdown.contains(e.target) && e.target!==yearInput) yearDropdown.style.display='none' })
populateYears();

// simple step2 validation
function validateStep2(){
  const requiredIds = ['nama_lengkap','tahun_lulus','no_wa','jurusan','jumlah_kta','pas_foto','bukti_transfer_kta'];
  let ok=true;
  requiredIds.forEach(id=>{
    const el=document.getElementById(id);
    if(!el) return;
    if(el.type==='file'){
      if(el.files.length===0){ ok=false; el.classList.add('is-invalid') } else el.classList.remove('is-invalid');
    } else {
      if(!el.value || el.value.trim()===''){ ok=false; el.classList.add('is-invalid') } else el.classList.remove('is-invalid');
    }
  });
  if(ok) nextStep(3); else document.getElementById('message2').innerHTML='<div class="alert alert-danger small py-2">Lengkapi semua field wajib.</div>';
}

// handle final submit -> send to Laravel API
form.addEventListener('submit', async function(e){
  e.preventDefault();
  document.getElementById('message3').innerHTML = '<div class="alert alert-info small py-2">Mengirim...</div>';

  // build FormData with names that Laravel expects:
  const fd = new FormData();
  fd.append('nama_lengkap', document.getElementById('nama_lengkap').value);
  fd.append('tahun_lulus', document.getElementById('tahun_lulus').value);
  fd.append('no_wa', document.getElementById('no_wa').value);
  fd.append('jurusan', document.getElementById('jurusan').value);

  // metode_pengiriman_kta is the field name expected by controller
  const metode = document.querySelector('input[name="metode_pengiriman"]:checked')?.value || 'Diambil Sendiri';
  fd.append('metode_pengiriman_kta', metode);

  fd.append('jumlah_kta', document.getElementById('jumlah_kta').value);

  // files: controller expects pas_foto and bukti_transfer_kta
  const foto = document.getElementById('pas_foto').files[0];
  const bukti = document.getElementById('bukti_transfer_kta').files[0];
  if(foto) fd.append('pas_foto', foto);
  if(bukti) fd.append('bukti_transfer_kta', bukti);

  // donation fields
  const bersedia = document.querySelector('input[name="bersedia_donasi"]:checked')?.value || 'Tidak';
  fd.append('bersedia_donasi', bersedia);
  const jumlahDonasi = document.getElementById('jumlah_donasi')?.value || null;
  if(jumlahDonasi) fd.append('jumlah_donasi', jumlahDonasi);
  const buktiDonasi = document.getElementById('bukti_transfer_donasi')?.files[0];
  if(buktiDonasi) fd.append('bukti_transfer_donasi', buktiDonasi);

  // alamat pengiriman (opsional)
  const alamat = document.getElementById('alamat_pengiriman')?.value || null;
  if(alamat) fd.append('alamat_pengiriman', alamat);

  try {
    const res = await fetch('http://127.0.0.1:8000/api/alumni', {
      method: 'POST',
      body: fd,
      // no JSON/Content-Type because it's multipart/form-data (browser sets boundary)
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'omit' // API token not used here
    });

    const data = await res.json();
    if(res.ok){
      document.getElementById('message3').innerHTML = '<div class="alert alert-success small py-2">Berhasil dikirim. Admin akan verifikasi.</div>';
      successModal.show();
      form.reset();
      nextStep(1);
      toggleDonationFields(false);
      toggleAlamatField(false);
    } else {
      // show validation errors from Laravel if ada
      const msg = data.message || JSON.stringify(data);
      document.getElementById('message3').innerHTML = `<div class="alert alert-danger small py-2">Gagal: ${msg}</div>`;
    }
  } catch(err){
    document.getElementById('message3').innerHTML = `<div class="alert alert-danger small py-2">Request error: ${err.message}</div>`;
  }
});
