import { HiCheck, HiX } from 'react-icons/hi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import clsxm from './clsxm';

type VerificationLabelProps = {
    status?: string | any;
    statusPemetaan?: string | any;
    statusPenerbitanSTDB?: string | any;
    statusKonfirmasi?: string | any;
    statusVerifikator?: string | any;
};

const VerificationLabel: React.FC<VerificationLabelProps> = ({
    status,
    statusKonfirmasi,
    statusPemetaan,
    statusPenerbitanSTDB,
    statusVerifikator,
}) => {
    // if (
    //     statusVerifikator === null ||
    //     statusVerifikator === undefined ||
    //     statusVerifikator === 'Disetujui'
    // ) {
    //     status = 'Belum diKonfirmasi';
    // } else if (statusVerifikator === 'Diterima') {
    //     status = 'Diterima';
    // } else if (statusVerifikator === 'Ditolak') {
    //     status = 'Ditolak';
    // }

    if ( status === 'False'){
        status === 'Belum diKonfirmasi';
    }

    return (
        <span
            className={clsxm(
                'inline-flex items-center gap-1 rounded-md border py-1 px-2 text-xs font-semibold',
                status === 'Diterima' ||
                    status === 'Dipetakan' ||
                    status === 'Diterbitkan' ||
                    status === 'Disetujui'
                    ? 'border-green-200 bg-green-200 text-green-900'
                    : status === 'Ditolak' || status === 'didalam kawasan'
                      ? 'border-red-200 bg-red-200 text-red-900'
                      : status === 'diluar kawasan'
                        ? 'border-blue-200 bg-blue-200 text-blue-900'
                        : status === 'sebagian memasuki kawasan'
                          ? 'border-yellow-200 bg-yellow-200 text-yellow-900'
                          : 'border-slate-400 bg-slate-400 text-slate-900',
            )}
        >
            {(status === 'Diterima' ||
                status === 'Dipetakan' ||
                status === 'Diterbitkan' ||
                status === 'Disetujui') && (
                <>
                    {status} <HiCheck />
                </>
            )}
            {status === 'Ditolak' && (
                <>
                    {status} <HiX />
                </>
            )}
            {(status === 'False' ||
                status === 'Belum Dipetakan' ||
                status === 'Belum diKonfirmasi') && (
                <>
                    {status} <AiOutlineLoading3Quarters />
                </>
            )}

            {(status === 'didalam kawasan' ||
                status === 'diluar kawasan' ||
                status === 'sebagian memasuki kawasan') && <>{status}</>}

            {/* {status === 'dipetakan' && (
                <>
                    Dipetakan <HiCheck />
                </>
            )}
            {statusPenerbitanSTDB === 'diterima' && (
                <>
                Diteribitkan <HiCheck />
                </>
            )}

            {statusPenerbitanSTDB === 'False' && (
                <>
                Belum diterbitkan <HiCheck />
                </>
            )} */}
            
        </span>
    );
};

export default VerificationLabel;
