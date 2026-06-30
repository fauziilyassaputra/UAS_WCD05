document.addEventListener("DOMContentLoaded", () => {
  
  // 1. MENGAMBIL ELEMEN DARI HTML
  const checkboxes = document.querySelectorAll(".tableOrder input[type='checkbox']");
  
  const orderContainer = document.querySelector(".orderCustomerChecklistItem");
  
  const spanKalori = document.querySelectorAll(".orderSum span")[0]; 
  const spanHarga = document.querySelectorAll(".orderSum span")[1];  
  
  const listKategoriHTML = document.querySelectorAll(".orderStandarOperasional ul li");
  const checkGiziSeimbang = document.querySelector(".orderStandarOperasional h2 input");
  
  // 2. PERSIAPAN DATA KATEGORI
  const kriteriaGizi = ["Makanan Pokok", "Lauk-Pauk", "Sayur", "Buah", "Minuman"];
  listKategoriHTML.forEach((li, index) => {
    li.innerHTML = `<input type="checkbox" disabled /> ${kriteriaGizi[index]}`;
  });
  checkGiziSeimbang.disabled = true; 

  const ambilAngka = (teks) => {
    const angkaString = teks.replace(/[^0-9]/g, '');
    return parseInt(angkaString) || 0; 
  };

  // 3. FUNGSI UTAMA
  function updatePesanan() {
    let totalKalori = 0;
    let totalHarga = 0;
    let kategoriYangDipilih = new Set();
    let htmlPesananBaru = "";
    let adaPesanan = false;

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        adaPesanan = true;
        
        const baris = checkbox.closest("tr");
        
        const imgSrc = baris.cells[0].querySelector("img").src;
        const namaMenu = baris.cells[1].innerText;
        const kategori = baris.cells[2].innerText;
        const kalori = ambilAngka(baris.cells[3].innerText);
        const harga = ambilAngka(baris.cells[4].innerText);

        totalKalori += kalori;
        totalHarga += harga;
        kategoriYangDipilih.add(kategori);

        htmlPesananBaru += `
          <div class="orderItem">
            <img src="${imgSrc}" alt="${namaMenu}" />
            <p>${namaMenu}</p>
          </div>
        `;
      }
    });

    // 4. UPDATE TAMPILAN KE LAYAR
    if (adaPesanan) {
      orderContainer.innerHTML = htmlPesananBaru;
    } else {
      orderContainer.innerHTML = `<h1 class="orderEmpty">Kamu belum pesan apapun</h1>`;
    }

    spanKalori.innerText = totalKalori;
    spanHarga.innerText = totalHarga.toLocaleString("id-ID"); // Biar format uangnya rapi pakai titik

    // 5. LOGIK CEK GIZI SEIMBANG
    let jumlahGiziTerpenuhi = 0;
    
    listKategoriHTML.forEach((li, index) => {
      const namaKategori = kriteriaGizi[index];
      const kotakCentang = li.querySelector("input");
      
      if (kategoriYangDipilih.has(namaKategori)) {
        kotakCentang.checked = true;
        jumlahGiziTerpenuhi++;
      } else {
        kotakCentang.checked = false;
      }
    });

    if (jumlahGiziTerpenuhi === 5) {
      checkGiziSeimbang.checked = true;
    } else {
      checkGiziSeimbang.checked = false;
    }
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", updatePesanan);
  });

  updatePesanan();
});