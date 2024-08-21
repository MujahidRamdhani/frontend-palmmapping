import { HiCheck, HiX } from 'react-icons/hi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import clsxm from './clsxm';

type LabelProps = {
    cidFotoKebun?: string;
    cidFileLegalitasKebun?: string;
};

const ImageLabel: React.FC<LabelProps> = ({
    cidFotoKebun,
    cidFileLegalitasKebun,
}) => {
    return (
        <div>
            {cidFileLegalitasKebun && (
                <a
                    href={`https://ipfs.io/ipfs/${cidFileLegalitasKebun}`}
                    download="LegalitasKebun.pdf"
                    className="font-medium text-blue-500"
                >
                    Download File Legalitas
                </a>
            )}

            {cidFotoKebun && (
                <div className="w-15 max-h-20">
                    <img
                        src={`https://ipfs.io/ipfs/${cidFotoKebun}`}
                        alt="Upload"
                    />
                </div>
            )}
        </div>
    );
};

export default ImageLabel;
