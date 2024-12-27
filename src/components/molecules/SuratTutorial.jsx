import Collapsible from "../atoms/Collapsible";

export default function SuratTutorial() {
  return (
    <div className="p-2">
      <Collapsible>
        <Collapsible.Item header="Menampilkan nama pemohon">
          Anda dapat mengetikkan <code>{"{nama_pemohon}"}</code> di form untuk
          menampilkan nama pemohon yang Anda pilih.
        </Collapsible.Item>

        <Collapsible.Item header="Menampilkan jabatan pemohon">
          Anda dapat mengetikkan <code>{"{jabatan_pemohon}"}</code> di form
          untuk menampilkan jabatan pemohon yang Anda pilih.
        </Collapsible.Item>

        <Collapsible.Item header="Menampilkan daftar penerima">
          Anda dapat mengetikkan <code>{"{nama_penerima}"}</code> di form untuk
          menampilkan nama penerima yang Anda pilih. Jika ada lebih dari satu
          penerima, nama-nama penerima akan dipisahkan dengan koma.
        </Collapsible.Item>

        <Collapsible.Item header="Menampilkan jabatan penerima">
          Anda dapat mengetikkan <code>{"{jabatan_penerima}"}</code> di form
          untuk menampilkan jabatan penerima yang Anda pilih. Jika ada lebih
          dari satu penerima, jabatan-jabatan penerima akan dipisahkan dengan
          koma.
        </Collapsible.Item>

        <Collapsible.Item header="Menampilkan penerima dalam bentuk table">
          Anda dapat membuat table terlebih dahulu memilih tombol <b>Source</b>{" "}
          dan menambahkan <code>{'id="table_penerima"'}</code> di dalam tag{" "}
          <b>&lt;tbody&gt;</b> untuk menampilkan daftar penerima dalam bentuk
          tabel. Berikut adalah contoh penggunaan ID dalam tag{" "}
          <b>&lt;tbody&gt;</b>:
          <pre>
            <code>
              &lt;tbody id="table_penerima"&gt;
            </code>
          </pre>
        </Collapsible.Item>

        <Collapsible.Item header="Menampilkan nomor surat">
          Anda dapat mengetikkan <code>{"{no_surat}"}</code> di form untuk
          menampilkan nomor surat anda.
        </Collapsible.Item>

        <Collapsible.Item header="Menampilkan tanggal surat">
          Anda dapat mengetikkan <code>{"{format_date}"}</code> di form untuk
          menampilkan tanggal surat dalam format "dd MMMM yyyy", seperti: 24
          Desember 2024.
        </Collapsible.Item>

        <Collapsible.Item header="Menampilkan nama perusahaan">
          Anda dapat mengetikkan <code>{"{nama_perusahaan}"}</code> di form
          untuk menampilkan nama perusahaan yang Anda pilih. Jika nama
          perusahaan tidak tersedia, akan muncul nama default: "QUEEN NETWORK
          NUSANTARA".
        </Collapsible.Item>

        <Collapsible.Item header="Menampilkan nama kota perusahaan">
          Anda dapat mengetikkan <code>{"{nama_kota}"}</code> di form untuk
          menampilkan nama kota dari perusahaan yang Anda pilih. dan jika tidak
          ada, akan muncul nama default: "Bandar Lampung".
        </Collapsible.Item>
      </Collapsible>
    </div>
  );
}
