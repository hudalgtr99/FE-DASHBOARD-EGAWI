const localhost = `http://127.0.0.1:8000`;
const apiURL = `/api`;

// export const baseurl = `https://api.kepegawaian.qnn.co.id`;
export const baseurl = `${localhost}${apiURL}`;
export const API_URL_signin = `${baseurl}/signin/`;
export const API_URL_getakun = `${baseurl}/getakun/`;
export const API_URL_getdataakun = `${baseurl}/getdataakun/`;
export const API_URL_updateakun = `${baseurl}/updateakun/`;
export const API_URL_updateprofile = `${baseurl}/updateprofile/`;
export const API_URL_changepassword = `${baseurl}/changepassword/`;
export const API_URL_changepassworduser = `${baseurl}/changepassworduser/`;
export const API_URL_tokenobtain = `${baseurl}/token/obtain/`;
export const API_URL_tokenrefresh = `${baseurl}/token/refresh/`;
export const API_URL_createabsensi = `${baseurl}/createabsensi/`;
export const API_URL_getabsensiuser = `${baseurl}/getabsensiuser/`;
export const API_URL_getdatapresensi = `${baseurl}/getdatapresensi/`;
export const API_URL_getdataabsensi = `${baseurl}/getdataabsensi/`;
export const API_URL_getlevel = `${baseurl}/getlevel/`;
export const API_URL_createuser = `${baseurl}/createuser/`;
export const API_URL_edeluser = `${baseurl}/edeluser/`;
export const API_URL_changeactive = `${baseurl}/changeactive/`;
export const API_URL_changeoutofarea = `${baseurl}/changeoutofarea/`;
export const API_URL_getmasterpegawai = `${baseurl}/getmasterpegawai/`;
export const API_URL_getdatadashboard = `${baseurl}/getdatadashboard/`;

// === kehadiran ===
export const API_URL_exportexcelkehadiran = `${baseurl}/exportexcelkehadiran/`;
export const API_URL_getdatakehadiran = `${baseurl}/getdatakehadiran/`;
export const API_URL_getdetailkehadiran = `${baseurl}/getdetailkehadiran/`;
export const API_URL_getdatapengajuancuti = `${baseurl}/getdatapengajuancuti/`;
export const API_URL_responsepengajuan = `${baseurl}/responsepengajuan/`;
// === end kehadiran ===

//=== kepegegawaian ===
export const API_URL_getdatapegawai = `${baseurl}/getdatapegawai/`;
export const API_URL_getpegawai = `${baseurl}/getpegawai/`;
export const API_URL_gettugas = `${baseurl}/gettugas/`;
export const API_URL_createtugas = `${baseurl}/createtugas/`;
export const API_URL_getriwayattugas = `${baseurl}/getriwayattugas/`;
export const API_URL_getdetailtugas = `${baseurl}/getdetailtugas/`;
export const API_URL_edeltugas = `${baseurl}/edeltugas/`;
//=== end kepegegawaian ===

// === organ ===
export const API_URL_getspesifikdepartemen = `${baseurl}/getspesifikdepartemen/`;
export const API_URL_getspesifikdivisi = `${baseurl}/getspesifikdivisi/`;
export const API_URL_getspesifikunit = `${baseurl}/getspesifikunit/`;

export const API_URL_getdepartemen = `${baseurl}/getdepartemen/`;
export const API_URL_createdepartemen = `${baseurl}/createdepartemen/`;
export const API_URL_edeldepartemen = `${baseurl}/edeldepartemen/`;

export const API_URL_getdivisi = `${baseurl}/getdivisi/`;
export const API_URL_createdivisi = `${baseurl}/createdivisi/`;
export const API_URL_edeldivisi = `${baseurl}/edeldivisi/`;

export const API_URL_getunit = `${baseurl}/getunit/`;
export const API_URL_createunit = `${baseurl}/createunit/`;
export const API_URL_edelunit = `${baseurl}/edelunit/`;
// === end organ ===

// === strata ===
export const API_URL_getspesifikpangkat = `${baseurl}/getspesifikpangkat/`;
export const API_URL_getspesifikjabatan = `${baseurl}/getspesifikjabatan/`;

export const API_URL_getpangkat = `${baseurl}/getpangkat/`;
export const API_URL_createpangkat = `${baseurl}/createpangkat/`;
export const API_URL_edelpangkat = `${baseurl}/edelpangkat/`;

export const API_URL_getjabatan = `${baseurl}/getjabatan/`;
export const API_URL_createjabatan = `${baseurl}/createjabatan/`;
export const API_URL_edeljabatan = `${baseurl}/edeljabatan/`;
// === end strata ===

// === gaji ===
export const API_URL_getspesifikgaji = `${baseurl}/getspesifikgaji/`;

export const API_URL_getgaji = `${baseurl}/getgaji/`;
export const API_URL_creategaji = `${baseurl}/creategaji/`;
export const API_URL_edelgaji = `${baseurl}/edelgaji/`;
// === end gaji ===

// === tunjangan ===
export const API_URL_getspesifiktunjangan = `${baseurl}/getspesifiktunjangan/`;

export const API_URL_gettunjangan = `${baseurl}/gettunjangan/`;
export const API_URL_createtunjangan = `${baseurl}/createtunjangan/`;
export const API_URL_edeltunjangan = `${baseurl}/edeltunjangan/`;
// === end tunjangan ===

// === potongan ===
export const API_URL_getspesifikpotongan = `${baseurl}/getspesifikpotongan/`;

export const API_URL_getpotongan = `${baseurl}/getpotongan/`;
export const API_URL_createpotongan = `${baseurl}/createpotongan/`;
export const API_URL_edelpotongan = `${baseurl}/edelpotongan/`;
// === end potongan ===

// === cabang ===
export const API_URL_getcabang = `${baseurl}/getcabang/`;
export const API_URL_createcabang = `${baseurl}/createcabang/`;
export const API_URL_edelcabang = `${baseurl}/edelcabang/`;
// === end cabang ===

// === cabang ===
export const API_URL_getkalender = `${baseurl}/getkalender/`;
export const API_URL_createkalender = `${baseurl}/createkalender/`;
// === end cabang ===

// === api ===
export const API_URL_createapiclient = `${baseurl}/createapiclient/`;
export const API_URL_changekey = `${baseurl}/changekey/`;
export const API_URL_edelapiclient = `${baseurl}/edelapiclient/`;
export const API_URL_getapiclient = `${baseurl}/getapiclient/`;
export const API_URL_getapiclientall = `${baseurl}/getapiclientall/`;
export const API_URL_gettypecallback = `${baseurl}/gettypecallback/`;
export const API_URL_getapiaccess = `${baseurl}/getapiaccess/`;
export const API_URL_getcallback = `${baseurl}/getcallback/`;
export const API_URL_createcallback = `${baseurl}/createcallback/`;
export const API_URL_edelcallback = `${baseurl}/edelcallback/`;
export const API_URL_createtugasclient = `${baseurl}/createtugasclient/`;
// === end api ===
