<?php include 'layout/header.php'; ?>

<form action="page3.php" method="POST" enctype="multipart/form-data">
<div class="container d-flex justify-content-center">
    <div class="card shadow-lg p-4 mt-4" style="max-width: 600px; width:100%; border-radius:16px;">

        <h4 class="fw-bold mb-4 text-ika">Data Pribadi & KTA</h4>

        <!-- Nama Lengkap -->
        <div class="mb-3">
            <label class="form-label">Nama Lengkap *</label>
            <input type="text" name="nama_lengkap" class="form-control" placeholder="Masukkan nama lengkap sesuai ijazah" required>
        </div>

        <!-- Email -->
        <div class="mb-3">
            <label class="form-label">Email Aktif *</label>
            <input type="email" name="email" class="form-control" placeholder="Masukkan email aktif" required>
        </div>

        <!-- Tahun Lulus -->
        <div class="mb-3">
            <label class="form-label">Tahun Lulus *</label>
            <select name="tahun_lulus" class="form-control" required>
                <option value="">Pilih Tahun</option>
                <?php for ($i = date('Y'); $i >= 1980; $i--): ?>
                    <option value="<?= $i ?>"><?= $i ?></option>
                <?php endfor; ?>
            </select>
        </div>

        <!-- No WA -->
        <div class="mb-3">
            <label class="form-label">No WhatsApp *</label>
            <input type="text" name="no_wa" class="form-control" placeholder="0812xxxxxxx" required>
        </div>

        <!-- Jurusan -->
        <div class="mb-3">
            <label class="form-label">Jurusan *</label>
            <select name="jurusan" class="form-control" required>
                <option value="">Pilih Jurusan</option>
                <option>Administrasi Bisnis</option>
                <option>Akuntansi</option>
                <option>Teknik Elektro</option>
                <option>Teknik Mesin</option>
                <option>Teknik Sipil</option>
            </select>
        </div>

        <!-- Metode Pengiriman KTA -->
        <div class="mb-3">
            <label class="form-label">Metode Pengiriman KTA *</label><br>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="metode_pengiriman_kta" value="Diambil Sendiri" required>
                <label class="form-check-label">Diambil Sendiri (Gedung Kesenian Terpadu Lantai 2 Polines)</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="metode_pengiriman_kta" value="Diantar ke Alamat">
                <label class="form-check-label">Diantar ke Alamat</label>
            </div>
        </div>

        <!-- Alamat -->
        <div class="mb-3">
            <label class="form-label">Alamat Lengkap</label>
            <textarea name="alamat" class="form-control" placeholder="Masukkan alamat lengkap jika memilih diantar"></textarea>
        </div>

        <!-- Jumlah KTA -->
        <div class="mb-3">
            <label class="form-label">Jumlah KTA (pcs) *</label>
            <input type="number" name="jumlah_kta" class="form-control" placeholder="Masukkan jumlah KTA" required>
        </div>

        <div class="d-flex gap-2 mt-4">
            <a href="page1.php" class="btn btn-secondary w-50">Sebelumnya</a>
            <button type="submit" class="btn btn-ika w-50">Lanjut ke Kontribusi</button>
        </div>

    </div>
</div>
</form>

<?php include 'layout/footer.php'; ?>
