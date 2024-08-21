import FormatTanggalJamLabel from "../Tables/table/FormatTanggalJamLabel";

interface TimelineProps {
    nama: string;
    waktuPengajuan: string;
    statusKonfirmator: string;
    namaKonfirmator: string;
    pesanKonfirmator?: string;
    idPemetaanKebun: string;
    statusVerifikator: string;
    namaSurveyor: string;
    namaVerifikator: string;
    pesanVerifikator?: string;
    nipPenerbitLegalitas: string;
    batas?: string;
}

const TimelineItem: React.FC<TimelineProps> = ({
    nama,
    waktuPengajuan,
    statusKonfirmator,
    namaKonfirmator,
    pesanKonfirmator,
    idPemetaanKebun,
    statusVerifikator,
    namaSurveyor,
    namaVerifikator,
    pesanVerifikator,
    nipPenerbitLegalitas,
    batas,
}) => {
    return (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-500 text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="8"
                    >
                        <path
                            fillRule="nonzero"
                            d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
                        />
                    </svg>
                </div>
                <div className="w-[calc(100%-3.2rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded border border-slate-200 shadow">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900 text-sm">
                            Mengajukan Legalitas
                        </div>
                    </div>
                    <div className="text-slate-500 text-sm">
                        {nama} mengajukan legalitas lahan pada{' '}
                        <FormatTanggalJamLabel tanggal={waktuPengajuan} />
                    </div>
                </div>
            </div>

            {statusKonfirmator !== 'False' && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    {statusKonfirmator === 'Disetujui' ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-500 text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <svg
                                className="fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="8"
                            >
                                <path
                                    fillRule="nonzero"
                                    d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
                                />
                            </svg>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-red-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    )}
                    <div className="w-[calc(100%-3.2rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded border border-slate-200 shadow">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900 text-sm">
                                Konfirmasi Pengajuan
                            </div>
                            <div
                                className={`font-caveat font-semibold ${statusKonfirmator === 'Disetujui' ? 'text-indigo-500' : 'text-red-500'} text-xs`}
                            >
                                {statusKonfirmator}
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm">
                            {namaKonfirmator} menerima Pengajuan legalitas pada{' '}
                            <FormatTanggalJamLabel tanggal={waktuPengajuan} />{' '}
                            {statusKonfirmator === 'Ditolak' &&
                                'dengan alasan penolakan ' + pesanKonfirmator}
                        </div>
                    </div>
                </div>
            )}

            {idPemetaanKebun !== 'Belum dipetakan' && batas !== 'konfirmasi' && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-500 text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <svg
                            className="fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="8"
                        >
                            <path
                                fillRule="nonzero"
                                d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
                            />
                        </svg>
                    </div>
                    <div className="w-[calc(100%-3.2rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded border border-slate-200 shadow">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900 text-sm">
                                Memetakan Lahan
                            </div>
                            <div className="font-caveat font-semibold text-indigo-500 text-xs">
                                Dipetakan
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm">
                            {namaSurveyor} memetakan lahan pada{' '}
                            <FormatTanggalJamLabel tanggal={waktuPengajuan} />
                        </div>
                    </div>
                </div>
            )}

            {(idPemetaanKebun !== 'Belum dipetakan' ||
                idPemetaanKebun !== undefined) &&
                (statusVerifikator === 'Disetujui' ||
                    statusVerifikator === 'Ditolak') && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        {statusVerifikator === 'Disetujui' ? (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-500 text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <svg
                                    className="fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="8"
                                >
                                    <path
                                        fillRule="nonzero"
                                        d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
                                    />
                                </svg>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-red-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        )}

                        <div className="w-[calc(100%-3.2rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded border border-slate-200 shadow">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-slate-900 text-sm">
                                    Dinas Memverifikasi Pemetaan
                                </div>
                                <div
                                    className={`font-caveat font-semibold ${statusVerifikator === 'Disetujui' ? 'text-indigo-500' : 'text-red-500'} text-xs`}
                                >
                                    {statusVerifikator}
                                </div>
                            </div>
                            <div className="text-slate-500 text-sm">
                                {namaVerifikator} memverifikasi pemetaan pada{' '}
                                <FormatTanggalJamLabel
                                    tanggal={waktuPengajuan}
                                />{' '}
                                {statusVerifikator === 'Ditolak' &&
                                    'dengan alasan penolakan ' +
                                        pesanVerifikator}
                            </div>
                        </div>
                    </div>
                )}

            {nipPenerbitLegalitas !== 'False' && batas !== 'konfirmasi' && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-500 text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <svg
                            className="fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="8"
                        >
                            <path
                                fillRule="nonzero"
                                d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
                            />
                        </svg>
                    </div>
                    <div className="w-[calc(100%-3.2rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded border border-slate-200 shadow">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900 text-sm">
                                Menerbitkan Legalitas Lahan
                            </div>
                            <div className="font-caveat font-medium text-indigo-500 text-xs">
                                Diterbitkan
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm">
                            {namaSurveyor} menerbitkan legalitas lahan pada{' '}
                            <FormatTanggalJamLabel tanggal={waktuPengajuan} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimelineItem;