<?php
// =====================
// KONEKSI DATABASE
// =====================
$conn = new mysqli("localhost", "root", "", "ika_polines");
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// =====================
// VALIDASI WAJIB
// =====================
$required = [
    'nama_lengkap','email','tahun_lulus','jurusan',
    'metode_pengiriman_kta','jumlah_kta','no_wa','bersedia_donasi'
];

foreach ($required as $field) {
    if (empty($_POST[$field])) {
        die("Field $field wajib diisi.");
    }
}

// =====================
// AMBIL DATA POST
// =====================
$nama_lengkap = $_POST['nama_lengkap'];
$email        = $_POST['email'];
$tahun_lulus  = (int) $_POST['tahun_lulus'];
$angkatan     = $_POST['angkatan'] ?? $tahun_lulus; // anti null
$jurusan      = $_POST['jurusan'];
$metode_kta   = $_POST['metode_pengiriman_kta'];
$jumlah_kta   = (int) $_POST['jumlah_kta'];
$no_wa        = $_POST['no_wa'];
$alamat       = $_POST['alamat'] ?? null;

$bersedia_donasi = $_POST['bersedia_donasi'];
$jumlah_donasi   = $_POST['jumlah_donasi'] ?? null;

// =====================
// FOLDER UPLOAD
// =====================
$fotoDir   = "uploads/foto/";
$ktaDir    = "uploads/kta/";
$donasiDir = "uploads/donasi/";

foreach ([$fotoDir,$ktaDir,$donasiDir] as $dir) {
    if (!is_dir($dir)) mkdir($dir, 0777, true);
}

// =====================
// UPLOAD PAS FOTO (WAJIB)
// =====================
if (!isset($_FILES['pas_foto'])) die("Pas foto wajib diupload.");
$pas_foto = time() . "_" . basename($_FILES['pas_foto']['name']);
move_uploaded_file($_FILES['pas_foto']['tmp_name'], $fotoDir . $pas_foto);

// =====================
// UPLOAD BUKTI KTA (WAJIB)
// =====================
if (!isset($_FILES['bukti_transfer_kta'])) die("Bukti KTA wajib diupload.");
$bukti_kta = time() . "_" . basename($_FILES['bukti_transfer_kta']['name']);
move_uploaded_file($_FILES['bukti_transfer_kta']['tmp_name'], $ktaDir . $bukti_kta);

// =====================
// UPLOAD BUKTI DONASI (OPSIONAL)
// =====================
$bukti_donasi = null;
if (!empty($_FILES['bukti_transfer_donasi']['name'])) {
    $bukti_donasi = time() . "_" . basename($_FILES['bukti_transfer_donasi']['name']);
    move_uploaded_file(
        $_FILES['bukti_transfer_donasi']['tmp_name'],
        $donasiDir . $bukti_donasi
    );
}

// =====================
// SIMPAN KE DATABASE
// =====================
$stmt = $conn->prepare("
    INSERT INTO alumni (
        nama_lengkap,
        email,
        tahun_lulus,
        angkatan,
        jurusan,
        metode_pengiriman_kta,
        jumlah_kta,
        pas_foto,
        bukti_transfer_kta,
        bersedia_donasi,
        jumlah_donasi,
        bukti_transfer_donasi,
        no_wa,
        alamat
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
");

$stmt->bind_param(
    "ssiississsssss",
    $nama_lengkap,      // s
    $email,             // s
    $tahun_lulus,       // i
    $angkatan,          // i
    $jurusan,           // s
    $metode_kta,        // s
    $jumlah_kta,        // i
    $pas_foto,          // s
    $bukti_kta,         // s
    $bersedia_donasi,   // s
    $jumlah_donasi,     // s
    $bukti_donasi,      // s
    $no_wa,             // s
    $alamat              // s
);

$stmt->execute();

// =====================
// REDIRECT
// =====================
header("Location: success.php");
exit;
