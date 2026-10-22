var app = new Vue({
  el: '#app',
  data: {
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    stok: [
      { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
      { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
      { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
      { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" }
    ],
    // filter dan sort
    upbjj: '', kategori: '', urut: 'judul', reorder: false,
    // form tambah / edit
    form: { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: '' },
    editKode: '',   // kosong = mode tambah, terisi = mode edit
    pesan: ''
  },

  computed: {
    // hasil filter + sort (computed otomatis di-cache)
    stokTampil() {
      var hasil = this.stok.filter(s =>
        (!this.upbjj || s.upbjj === this.upbjj) &&
        (!this.kategori || s.kategori === this.kategori) &&
        (!this.reorder || s.qty < s.safety)
      );
      var kunci = this.urut;
      return hasil.sort((a, b) =>
        kunci === 'judul' ? a.judul.localeCompare(b.judul) : a[kunci] - b[kunci]
      );
    }
  },

  watch: {
    // watcher 1: UT-Daerah berubah -> pilihan kategori direset
    upbjj() { this.kategori = ''; },
    // watcher 2: pesan error hilang otomatis saat pengguna mengetik kode
    'form.kode'() { this.pesan = ''; }
  },

  methods: {
    status(s) {
      if (s.qty === 0) return 'kosong';
      return s.qty < s.safety ? 'menipis' : 'aman';
    },
    reset() {
      this.upbjj = ''; this.kategori = ''; this.urut = 'judul'; this.reorder = false;
    },
    edit(s) {
      this.form = Object.assign({}, s);
      this.editKode = s.kode;
    },
    batal() {
      this.form = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: '' };
      this.editKode = '';
    },
    simpan() {
      var f = this.form;
      // validasi sederhana
      if (!f.kode || !f.judul || !f.kategori || !f.upbjj || !f.lokasiRak) {
        this.pesan = 'Kode, judul, kategori, UT-Daerah, dan rak wajib diisi';
        return;
      }
      if (f.harga === '' || f.qty === '' || f.safety === '' || f.harga <= 0 || f.qty < 0 || f.safety < 0) {
        this.pesan = 'Harga harus > 0, stok dan safety minimal 0';
        return;
      }
      if (this.editKode === '') {
        if (this.stok.some(s => s.kode === f.kode)) {
          this.pesan = 'Kode sudah ada';
          return;
        }
        this.stok.push(Object.assign({}, f));
      } else {
        var data = this.stok.find(s => s.kode === this.editKode);
        Object.assign(data, f);
      }
      this.pesan = '';
      this.batal();
    }
  }
});
