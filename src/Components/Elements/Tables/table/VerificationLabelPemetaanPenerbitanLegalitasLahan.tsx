import { HiCheck, HiX } from 'react-icons/hi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import clsxm from './clsxm';

type VerificationLabelProps = {
    status?: string | any;
    statusPenerbitan?: string | any;
    statusPenerbitanSTDB?: string | any;
};

const VerificationLabelPemetaanKebun: React.FC<VerificationLabelProps> = ({
    status,
    statusPenerbitan,
    statusPenerbitanSTDB,
}) => {
    if (statusPenerbitan === 'False') {
        status = 'Belum Diterbitkan';
    } else {
        status = 'Sudah Diterbitkan';
    }

    return (
        <span
            className={clsxm(
                'inline-flex items-center gap-1 rounded-md border py-1 px-2 text-xs font-semibold',
                status === 'Diterima' ||
                    status === 'Sudah Diterbitkan' ||
                    status === 'Diterbitkan'
                    ? 'border-green-200 bg-green-200 text-green-900'
                    : status === 'ditolak' || status === 'didalam kawasan'
                      ? 'border-red-200 bg-red-200 text-red-900'
                      : status === 'diluar kawasan'
                        ? 'border-blue-200 bg-blue-200 text-blue-900'
                        : status === 'sebagian memasuki kawasan'
                          ? 'border-yellow-200 bg-yellow-200 text-yellow-900'
                          : 'border-slate-400 bg-slate-400 text-slate-900',
            )}
        >
            {(status === 'Diterima' ||
                status === 'Sudah Diterbitkan' ||
                status === 'Diterbitkan') && (
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
                status === 'Belum Diterbitkan') && (
                <>
                    {status} <AiOutlineLoading3Quarters />
                </>
            )}

            {(status === 'didalam kawasan' ||
                status === 'diluar kawasan' ||
                status === 'sebagian memasuki kawasan') && <>{status}</>}
        </span>
    );
};

export default VerificationLabelPemetaanKebun;
