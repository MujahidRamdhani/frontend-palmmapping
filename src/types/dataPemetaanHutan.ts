export interface DataPemetaanHutan {
    IdTransaksiBlockchain: string;
    idHutan: string;
    namaHutan: string;
    nipSurveyor: string;
    namaSurveyor: string;
    longitude: string;
    latitude: string;
    luasHutan: string;
    waktuPemetaanHutan: string;
    updateWaktuPemetaanHutan: string;
}

export interface DataPemetaanHutanArray {
    data: DataPemetaanHutan[];
}
