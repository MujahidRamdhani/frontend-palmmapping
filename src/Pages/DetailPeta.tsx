import React, { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';
import { NavLink, useLocation } from 'react-router-dom';
import {
    MapContainer,
    TileLayer,
    Polygon,
    Popup,
    FeatureGroup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../Components/Elements/Navbar/Navbar';
import { LegalitasLahan } from '../types/legalitasLahan';
import { GetAllLegalitasLahan } from '../Services/legalitasLahanServices';
import { DataPemetaanKebun } from '../types/dataPemetaanKebun';
import { GetAllDataPemetaanKebun } from '../Services/pemetaanKebunServices';
import ParticlesComponent from '../Components/Elements/Particles/Particles';
import FormatTanggalJamLabel from '../Components/Elements/Tables/table/FormatTanggalJamLabel';
import TextKeterangan from '../Components/Elements/TextKeterangan/TextKeterangan';
const osm = {
    maptiler: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // OpenStreetMap tiles URL
        attribution: '© OpenStreetMap contributors',
    },
};
interface LatLngLiteral {
    lat: number;
    lng: number;
}

const pusat: [number, number] = [0.24041105296887577, 110.81003665924074];
const DetailPeta = () => {
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const location = useLocation();
    const [mapCenter, setMapCenter] = useState<LatLngLiteral>({
        lat: 0.934454024134,
        lng: 115.199035644999,
    });
    const mapContainerRef = useRef<any>(null);
    // const { nomorSTDB } = queryString.parse(location.search);
    const { nomorSTDB, statusKawasan, longitude, latitude } =
        location.state || {};
    // useEffect(() => {
    //     const getPeta = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/STDBS');
    //             setStdbs(response.data);
    //             console.log('Axios response:', response.data);
    //         } catch (error) {
    //             if (axios.isAxiosError(error)) {
    //                 console.error('Error fetching data:', error.message);
    //             } else {
    //                 console.error('Unexpected error:', error);
    //             }
    //         }
    //     };
    //     getPeta();
    // }, []);

    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);

    useEffect(() => {
        const fetchSTDBS = async () => {
            try {
                const data = await GetAllLegalitasLahan();
                setStdbs(data);
                console.log('data legalitas', data);
            } catch (error) {
                console.error('Failed to fetch STDBS:', error);
                setError('Failed to fetch data');
            }
        };

        fetchSTDBS();
    }, []);

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanKebun();
                setDataPemetaan(data);
                console.log('data pemetaan', data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        fetchDataPemetaanKebun();
    }, []);

    const mergeData = (
        stdbs: LegalitasLahan[],
        dataPemetaan: DataPemetaanKebun[],
    ) => {
        return stdbs.map((stdb) => {
            const matchingPemetaan = dataPemetaan.find(
                (pemetaan) => pemetaan.idPemetaanKebun === stdb.idPemetaanKebun,
            );
            return {
                ...stdb,
                ...matchingPemetaan,
            };
        });
    };

    const combinedData = mergeData(stdbs, dataPemetaan);

    const filterDataPenerbitan = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) => item.nomorSTDB === nomorSTDB,
        );
    };

    // Parse the latitude and longitude strings into arrays
    const latitudes = JSON.parse(latitude) as number[];
    const longitudes = JSON.parse(longitude) as number[];

    const coordinates = latitudes.map((lat, idx) => [lat, longitudes[idx]]) as [
        number,
        number,
    ][];

    useEffect(() => {
        const newCenter = { lat: latitudes[0], lng: longitudes[0] };
        setMapCenter(newCenter);
        if (mapContainerRef.current) {
            mapContainerRef.current.setView(newCenter);
        }
    }, []);

    let color = '';
    if (statusKawasan === 'didalam kawasan') {
        color = '#FF0000';
    } else if (statusKawasan === 'sebagian memasuki kawasan') {
        color = '#FFFF00';
    } else {
        color = '#0000FF';
    }

    return (
        <>
            <div className="w-full">
                <ParticlesComponent id="particles" />
                <div>
                    <Navbar />
                </div>

                <div className="flex flex-col  mx-auto justify-center md:w-11/12 lg:w-9/12 xl:w-8/12">
                    <div>
                        <div
                            className="leaflet-container"
                            style={{ height: '40vh', width: '100%' }}
                        >
                            <MapContainer
                                center={mapCenter}
                                zoom={14}
                                ref={mapContainerRef}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url={osm.maptiler.url}
                                    attribution={osm.maptiler.attribution}
                                />

                                <Polygon
                                    positions={coordinates}
                                    pathOptions={{ color: color }}
                                ></Polygon>
                            </MapContainer>
                        </div>

                        {filterDataPenerbitan(combinedData).map(
                            (stdb, index) => {
                                const {
                                    nomorSTDB,
                                    nik,
                                    nama,
                                    alamatKebun,
                                    statusKepemilikanLahan,
                                    nomorSertifikat,
                                    luasArealKebun,
                                    jenisTanaman,
                                    produksiPerHaPertahun,
                                    asalBenih,
                                    jumlahPohon,
                                    polaTanam,
                                    jenisPupuk,
                                    mitraPengolahan,
                                    jenisTanah,
                                    tahunTanam,
                                    usahaLainDikebun,
                                    statusKawasan,
                                    nikKonfirmator,
                                    namaKonfirmator,
                                    nikSurveyor,
                                    namaSurveyor,
                                    waktuPemetaanKebun,
                                    nipVerifikator,
                                    namaVerifikator,
                                    nipPenerbitLegalitas,
                                    namaPenerbitLegalitas,
                                    waktuPenerbitLegalitas,
                                    updateWaktuPenerbitLegalitas,
                                    waktuPengajuan,
                                    cidFotoKebun,
                                    luasKebun,
                                    waktuKonfirmator,
                                    updateWaktuKonfirmator,
                                    waktuUpdatePemetaanKebun,
                                    waktuVerifikator,
                                    waktuUpdateVerifikator,
                                } = stdb;

                                return (
                                    <div className="bg-white p-5 mt-2 rounded opacity-90">
                                        <h2 className="font-bold ml-1">
                                            A. Keterangan Pemilik :
                                        </h2>
                                        <div className="ml-5">
                                            <TextKeterangan
                                                nama={'1. Nama'}
                                                keterangan={nama}
                                            />
                                            <TextKeterangan
                                                nama={' 2. Nomor KTP'}
                                                keterangan={nik}
                                            />
                                        </div>
                                        <h2 className="font-bold ml-1">
                                            B. Keterangan STDB:
                                        </h2>
                                        <div className="ml-5">
                                            <TextKeterangan
                                                nama={'1. Nomor STDB'}
                                                keterangan={nomorSTDB}
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '2. Waktu Pengajuan Legalitas'
                                                }
                                                tanggal={waktuPengajuan}
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '3. Waktu Update Pengajuan Legalitas'
                                                }
                                                tanggal={waktuPengajuan}
                                            />
                                            <TextKeterangan
                                                nama={'4. Nik Konfirmator'}
                                                keterangan={nikKonfirmator}
                                            />
                                            <TextKeterangan
                                                nama={'5. Nama Konfirmator'}
                                                keterangan={namaKonfirmator}
                                            />
                                            <TextKeterangan
                                                nama={'6. Waktu konfirmator'}
                                                tanggal={waktuKonfirmator}
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '7. Waktu Update konfirmator'
                                                }
                                                tanggal={updateWaktuKonfirmator}
                                            />
                                            <TextKeterangan
                                                nama={'8. Nik Surverior'}
                                                keterangan={nikSurveyor}
                                            />
                                            <TextKeterangan
                                                nama={'9. Nama Surveyor'}
                                                keterangan={namaSurveyor}
                                            />
                                            <TextKeterangan
                                                nama={'10. waktu Pemetaan'}
                                                tanggal={waktuPemetaanKebun}
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '11. waktu Update Pemetaan'
                                                }
                                                tanggal={
                                                    waktuUpdatePemetaanKebun
                                                }
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '12. Nip Dinas Verifikator Pemetaan'
                                                }
                                                keterangan={nipVerifikator}
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '13. Nama Dinas Verifikator Pemetaan'
                                                }
                                                keterangan={namaVerifikator}
                                            />
                                            <TextKeterangan
                                                nama={'14. Waktu Verifikator'}
                                                tanggal={waktuVerifikator}
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '15. Waktu Update Verifikator'
                                                }
                                                tanggal={waktuUpdateVerifikator}
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '16. Nip Penerbit Legalitas'
                                                }
                                                keterangan={
                                                    nipPenerbitLegalitas
                                                }
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '17. Nama Penerbit Legalitas'
                                                }
                                                keterangan={
                                                    namaPenerbitLegalitas
                                                }
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '18. waktu Penerbit Legalitas'
                                                }
                                                tanggal={waktuPenerbitLegalitas}
                                            />
                                            <TextKeterangan
                                                nama={
                                                    '19. Waktu Update Penerbit Legalitas'
                                                }
                                                tanggal={
                                                    updateWaktuPenerbitLegalitas
                                                }
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <h2 className="font-bold ml-1 ">
                                                C. Data Kebun :
                                            </h2>
                                            <div className="ml-6">
                                                <TextKeterangan
                                                    nama={'1. Alamat Kebun'}
                                                    keterangan={alamatKebun}
                                                />
                                                <TextKeterangan
                                                    nama={
                                                        '2. Status Kepemilikan Lahan'
                                                    }
                                                    keterangan={
                                                        statusKepemilikanLahan
                                                    }
                                                />
                                                <TextKeterangan
                                                    nama={'3. Nomor Sertifikat'}
                                                    keterangan={nomorSertifikat}
                                                />
                                                <TextKeterangan
                                                    nama={'4. Luas Lahan Kebun'}
                                                    keterangan={jenisTanaman}
                                                />
                                                <TextKeterangan
                                                    nama={'5. Jenis Tanaman'}
                                                    keterangan={
                                                        statusKepemilikanLahan
                                                    }
                                                />
                                                <TextKeterangan
                                                    nama={
                                                        '6. Produksi per Hektar per Tahun'
                                                    }
                                                    keterangan={
                                                        produksiPerHaPertahun
                                                    }
                                                    span="Ton"
                                                />
                                                <TextKeterangan
                                                    nama={'7. Asal Benih'}
                                                    keterangan={asalBenih}
                                                />
                                                <TextKeterangan
                                                    nama={'8. Jumlah Pohon'}
                                                    keterangan={jumlahPohon}
                                                    span="Pohon"
                                                />
                                                <TextKeterangan
                                                    nama={'9. Pola Tanam'}
                                                    keterangan={polaTanam}
                                                />
                                                <TextKeterangan
                                                    nama={'10. Jenis Pupuk'}
                                                    keterangan={jenisPupuk}
                                                />
                                                <TextKeterangan
                                                    nama={
                                                        '11. Mitra Pengolahan'
                                                    }
                                                    keterangan={mitraPengolahan}
                                                />
                                                <TextKeterangan
                                                    nama={'12. Jenis Tanah'}
                                                    keterangan={jenisTanah}
                                                />
                                                <TextKeterangan
                                                    nama={'13. Tahun Tanam'}
                                                    keterangan={tahunTanam}
                                                />
                                                <TextKeterangan
                                                    nama={
                                                        '14. Usaha Lain di Lahan Kebun'
                                                    }
                                                    keterangan={
                                                        usahaLainDikebun
                                                    }
                                                />
                                                <TextKeterangan
                                                    nama={
                                                        '15. Status Kawasan Kebun'
                                                    }
                                                    keterangan={statusKawasan}
                                                />
                                                <TextKeterangan
                                                    nama={'16. Luas Kebun'}
                                                    keterangan={luasKebun}
                                                    span="Ha"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <h4 className="text-sm ml-6">
                                                    17. Foto Kebun
                                                    <span className="ml-46">
                                                        :
                                                    </span>
                                                    &nbsp;
                                                </h4>
                                                <div className="w-40 max-h-60">
                                                    <img
                                                        src={`https://ipfs.io/ipfs/${cidFotoKebun}`}
                                                        alt="Upload"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailPeta;
