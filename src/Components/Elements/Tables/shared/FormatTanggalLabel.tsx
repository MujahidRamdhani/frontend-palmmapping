import { HiCheck, HiX } from 'react-icons/hi';
import clsxm from '../table/clsxm';
import moment from 'moment';

type FormatTanggalLabelProps = {
    tanggal: Date | any;
};

const FormatTanggalLabel: React.FC<FormatTanggalLabelProps> = ({ tanggal }) => {
    return (
        <span
            className={clsxm(
                'inline-flex items-center gap-1 py-1 px-2 text-xs font-semibold',
            )}
        >
            <p>{moment(tanggal).format('D-MM-YYYY')}</p>
        </span>
    );
};

export default FormatTanggalLabel;
