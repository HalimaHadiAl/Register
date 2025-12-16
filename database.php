<?php
$conn = mysqli_connect("localhost", "root", "", "ika_polines");

if (!$conn) {
    die("Koneksi database gagal!");
}
