<?php include 'layout/header.php'; ?>

<form action="process.php" method="POST" enctype="multipart/form-data">

<!-- Data tersembunyi dari page2 -->
<?php
$fields = [
    'nama_lengkap','email','tahun_lulus','no_wa',
    'jurusan','metode_pengiriman_kta','alamat','jumlah_kta'
];
foreach ($fields as $f) {
    if(isset($_POST[$f])){
        $value = htmlspecialchars($_POST[$f]);
        echo "<input type='hidden' name='$f' value='$value'>";
    }
}
?>

<div class="container d-flex justify-content-center mt-5">
    <div class="card shadow-lg p-4" style="max-width:600px; width:100%; border-radius:16px;">

        <h4 class="fw-bold mb-4 text-ika text-center">Upload & Donasi</h4>

        <!-- Pas Foto -->
        <div class="mb-3">
            <label class="form-label">Pas Foto (PNG/JPG) *</label>
            <input type="file" name="pas_foto" class="form-control" accept=".png,.jpg,.jpeg" required>
        </div>

        <!-- Bukti Transfer KTA -->
        <div class="mb-3">
            <label class="form-label">Bukti Transfer KTA *</label>
            <input type="file" name="bukti_transfer_kta" class="form-control" accept=".png,.jpg,.jpeg,.pdf" required>
        </div>

        <!-- Bersedia Donasi -->
        <div class="mb-3">
            <label class="form-label">Bersedia berdonasi? *</label><br>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="bersedia_donasi" value="Ya" required>
                <label class="form-check-label">Ya, saya bersedia</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="bersedia_donasi" value="Tidak">
                <label class="form-check-label">Tidak</label>
            </div>
        </div>

        <!-- Jumlah Donasi -->
        <div class="mb-3">
            <label class="form-label">Jumlah Donasi (Opsional)</label>
            <input type="text" name="jumlah_donasi" class="form-control" placeholder="Contoh: Rp 100.000">
        </div>

        <!-- Bukti Donasi -->
        <div class="mb-3">
            <label class="form-label">Bukti Transfer Donasi (Opsional)</label>
            <input type="file" name="bukti_transfer_donasi" class="form-control" accept=".jpg,.jpeg,.png,.pdf">
        </div>

        <div class="d-flex gap-2 mt-4">
            <a href="page2.php" class="btn btn-secondary w-50">Sebelumnya</a>
            <button type="submit" class="btn btn-ika w-50">Kirim Pendaftaran</button>
        </div>

    </div>
</div>

</form>

<?php include 'layout/footer.php'; ?>
