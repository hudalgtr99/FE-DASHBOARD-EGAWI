export function formatString(input) {
  if (typeof input !== "string" || input.trim() === "") {
    // Mengembalikan string kosong jika input bukan string atau hanya whitespace
    return "";
  }

  return input
    .split("_") // Memisahkan string berdasarkan underscore
    .map((word) => {
      // Periksa apakah kata valid, jika tidak biarkan kosong
      if (word && typeof word === "string") {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return "";
    })
    .join(" ") // Menggabungkan kembali dengan spasi
    .trim(); // Menghapus spasi berlebih
}
