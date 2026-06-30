// Kita bungkus semua kode di dalam event "DOMContentLoaded"
// Ini memastikan JS baru berjalan setelah semua HTML selesai dimuat oleh browser
document.addEventListener("DOMContentLoaded", () => {
  
  // 1. MENGAMBIL ELEMEN DARI HTML (DOM Selection)
  // Memilih semua checkbox yang ada di dalam tabel
  const checkboxes = document.querySelectorAll(".tableOrder input[type='checkbox']");
  
  // Memilih tempat untuk memunculkan gambar pesanan
  const orderContainer = document.querySelector(".orderCustomerChecklistItem");
  
  // Memilih tempat untuk menaruh angka kalori dan harga (mengambil <span> nya)
  const spanKalori = document.querySelectorAll(".orderSum span")[0]; // span pertama (kalori)
  const spanHarga = document.querySelectorAll(".orderSum span")[1];  // span kedua (harga)
  
  // Memilih checklist "Gizi Seimbang" dan kategori-kategorinya
  const listKategoriHTML = document.querySelectorAll(".orderStandarOperasional ul li");
  const checkGiziSeimbang = document.querySelector(".orderStandarOperasional h2 input");
  
  // 2. PERSIAPAN DATA KATEGORI
  // Kita perbaiki teks HTML temanmu agar sesuai dengan kategori di tabel
  const kriteriaGizi = ["Makanan Pokok", "Lauk-Pauk", "Sayur", "Buah", "Minuman"];
  listKategoriHTML.forEach((li, index) => {
    // Kita timpa isi list HTML-nya dan buat checkbox-nya 'disabled' agar user tidak bisa ngeklik manual
    li.innerHTML = `<input type="checkbox" disabled /> ${kriteriaGizi[index]}`;
  });
  checkGiziSeimbang.disabled = true; // Gizi seimbang juga jangan bisa diklik manual

  // 3. FUNGSI ALAT BANTU (Helper Function)
  // Fungsi ini berguna untuk mengubah teks seperti "Rp 15.000" atau "220 kkal" jadi angka murni
  const ambilAngka = (teks) => {
    // Menghapus semua karakter yang bukan angka (0-9)
    const angkaString = teks.replace(/[^0-9]/g, '');
    // Ubah jadi tipe number, kalau kosong jadikan 0
    return parseInt(angkaString) || 0; 
  };

  // 4. FUNGSI UTAMA (Berjalan tiap kali user mencentang menu)
  function updatePesanan() {
    let totalKalori = 0;
    let totalHarga = 0;
    let kategoriYangDipilih = new Set(); // Set berguna untuk menyimpan data unik tanpa duplikat
    let htmlPesananBaru = "";
    let adaPesanan = false;

    // Looping (cek satu-satu) semua baris makanan di tabel
    checkboxes.forEach((checkbox) => {
      // Jika checkbox dicentang
      if (checkbox.checked) {
        adaPesanan = true; // Tandai bahwa user sudah pesan
        
        // Ambil elemen baris (<tr>) tempat checkbox ini berada
        const baris = checkbox.closest("tr");
        
        // Ambil data dari kolom (<td>) masing-masing
        const imgSrc = baris.cells[0].querySelector("img").src;
        const namaMenu = baris.cells[1].innerText;
        const kategori = baris.cells[2].innerText;
        const kalori = ambilAngka(baris.cells[3].innerText);
        const harga = ambilAngka(baris.cells[4].innerText);

        // Tambahkan ke total hitungan
        totalKalori += kalori;
        totalHarga += harga;
        kategoriYangDipilih.add(kategori); // Masukkan kategori (misal: "Buah") ke dalam kumpulan Set

        // Buat struktur HTML untuk gambar yang masuk ke kotak oranye
        htmlPesananBaru += `
          <div class="orderItem">
            <img src="${imgSrc}" alt="${namaMenu}" />
            <p>${namaMenu}</p>
          </div>
        `;
      }
    });

    // 5. UPDATE TAMPILAN KE LAYAR (Update UI)
    // Update Kotak Gambar
    if (adaPesanan) {
      orderContainer.innerHTML = htmlPesananBaru;
    } else {
      // Kalau tidak ada yang dicentang, kembalikan tulisan peringatan merah
      orderContainer.innerHTML = `<h1 class="orderEmpty">Kamu belum pesan apapun</h1>`;
    }

    // Update Angka Kalori dan Harga
    spanKalori.innerText = totalKalori;
    spanHarga.innerText = totalHarga.toLocaleString("id-ID"); // Biar format uangnya rapi pakai titik

    // 6. LOGIK CEK GIZI SEIMBANG
    let jumlahGiziTerpenuhi = 0;
    
    // Cek satu-satu kriteria gizi (Makanan Pokok, Lauk, dll)
    listKategoriHTML.forEach((li, index) => {
      const namaKategori = kriteriaGizi[index];
      const kotakCentang = li.querySelector("input");
      
      // Jika kriteria ini ada di menu yang dipilih user
      if (kategoriYangDipilih.has(namaKategori)) {
        kotakCentang.checked = true; // Nyalakan centang
        jumlahGiziTerpenuhi++;
      } else {
        kotakCentang.checked = false; // Matikan centang
      }
    });

    // Jika ke-5 kategori terpenuhi, nyalakan centang Gizi Seimbang
    if (jumlahGiziTerpenuhi === 5) {
      checkGiziSeimbang.checked = true;
    } else {
      checkGiziSeimbang.checked = false;
    }
  }

  // 7. MENYAMBUNGKAN KLIK DENGAN FUNGSI (Event Listener)
  // Kita beri "telinga" ke semua checkbox di tabel.
  // Kalau statusnya berubah (dicentang/dihapus), jalankan fungsi updatePesanan()
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", updatePesanan);
  });

  // Panggil fungsinya sekali saat website pertama kali dibuka
  // Ini untuk me-reset angka "100" dan "500000" bawaan HTML temanmu menjadi 0
  updatePesanan();
});