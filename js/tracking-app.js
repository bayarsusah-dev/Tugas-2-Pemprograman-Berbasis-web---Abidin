var app = new Vue({
  el: '#app',
  data: {
    pengirimanList: [
      { kode: "REG", nama: "Reguler (3-5 hari)" },
      { kode: "EXP", nama: "Ekspres (1-2 hari)" }
    ],
    paket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
    ],
    tracking: {
      "DO2025-001": {
        nim: "123456789", nama: "Rina Wulandari", status: "Dalam Perjalanan",
        ekspedisi: "JNE", tanggalKirim: "2025-08-25", paket: "PAKET-UT-001", total: 120000,
        perjalanan: [
          { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      }
    },
    cariDO: '',
    form: { nim: '', nama: '', ekspedisi: '', kodePaket: '', tanggalKirim: new Date().toLocaleDateString('en-CA') },
    pesan: '',
    sukses: ''
  },

  computed: {
    // DO + tahun berjalan + nomor urut, contoh DO2026-002
    nomorDO() {
      var urut = Object.keys(this.tracking).length + 1;
      return 'DO' + new Date().getFullYear() + '-' + String(urut).padStart(3, '0');
    },
    paketDipilih() {
      return this.paket.find(p => p.kode === this.form.kodePaket);
    },
    total() {
      return this.paketDipilih ? this.paketDipilih.harga : 0;
    },
    hasil() {
      return this.tracking[this.cariDO.trim().toUpperCase()];
    }
  },

  watch: {
    // watcher 1: NIM hanya boleh angka
    'form.nim'(nilai) {
      this.form.nim = nilai.replace(/\D/g, '');
    },
    // watcher 2: pesan sukses hilang saat pengguna memilih paket baru
    'form.kodePaket'() {
      this.sukses = '';
    }
  },

  methods: {
    simpan() {
      var f = this.form;
      if (!f.nim || !f.nama || !f.ekspedisi || !f.kodePaket || !f.tanggalKirim) {
        this.pesan = 'Semua kolom wajib diisi';
        return;
      }
      var nomor = this.nomorDO;
      this.$set(this.tracking, nomor, {
        nim: f.nim, nama: f.nama, status: 'Diproses', ekspedisi: f.ekspedisi,
        tanggalKirim: f.tanggalKirim, paket: f.kodePaket, total: this.total,
        perjalanan: [{ waktu: new Date().toLocaleString('id-ID'), keterangan: 'DO dibuat' }]
      });
      this.sukses = 'DO ' + nomor + ' berhasil disimpan';
      this.pesan = '';
      this.form = { nim: '', nama: '', ekspedisi: '', kodePaket: '', tanggalKirim: new Date().toLocaleDateString('en-CA') };
    }
  }
});
