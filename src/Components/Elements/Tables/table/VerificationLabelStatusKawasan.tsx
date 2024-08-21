import { HiCheck, HiX } from 'react-icons/hi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import clsxm from './clsxm';

type VerificationLabelProps = {
    status?: string | any;
    idPemetaanKebun?: string | any;
    statusPenerbitanSTDB?: string | any;
    statusPemetaan?: string | any;
    statusKawasan?: string | any;
};

const VerificationLabelStatusKawasan: React.FC<VerificationLabelProps> = ({
    status,
    idPemetaanKebun,
    statusPenerbitanSTDB,
    statusKawasan,
}) => {
    return (
        <span
            className={clsxm(
                'inline-flex items-center gap-1 rounded-md border py-1 px-2 text-xs font-semibold',
                statusKawasan === 'hutan'
                    ? 'border-blue-500 bg-blue-500 text-green-900'
                    : statusKawasan === 'ditolak' ||
                        statusKawasan === 'didalam kawasan'
                      ? 'border-red-500 bg-red-500 text-slate-200'
                      : statusKawasan === 'diluar kawasan'
                        ? 'border-blue-500 bg-blue-500 text-slate-200'
                        : statusKawasan === 'sebagian memasuki kawasan'
                          ? 'border-yellow-500 bg-yellow-500 text-slate-200'
                          : 'border-slate-500 bg-slate-500 text-slate-900',
            )}
        >
            {statusKawasan}
        </span>
    );
};

export default VerificationLabelStatusKawasan;
