import React, {
    useState,
    useRef,
    ChangeEvent,
    MouseEvent,
    useEffect,
} from 'react';
// import "./style.css";

interface inputProps {
    register: any;
}

const ImageUpload: React.FC<inputProps> = ({ register }) => {
    const [image, setImage] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
        null,
    );
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imgname = file.name;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxSize = Math.max(img.width, img.height);
                    canvas.width = maxSize;
                    canvas.height = maxSize;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(
                            img,
                            (maxSize - img.width) / 2,
                            (maxSize - img.height) / 2,
                        );
                        canvas.toBlob(
                            (blob) => {
                                if (blob) {
                                    const newFile = new File([blob], imgname, {
                                        type: 'image/png',
                                        lastModified: Date.now(),
                                    });
                                    console.log(newFile);
                                    setImage(newFile);
                                }
                            },
                            'image/jpeg',
                            0.8,
                        );
                    }
                };
            };
        }
    };

    const handleUploadButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (image) {
            const myHeaders = new Headers();
            const token = 'adhgsdaksdhk938742937423';
            myHeaders.append('Authorization', `Bearer ${token}`);

            const formdata = new FormData();
            formdata.append('file', image);

            const requestOptions: RequestInit = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow',
            };

            fetch('https://trickuweb.com/upload/profile_pic', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    setUploadedImageUrl(result.img_url);
                })
                .catch((error) => console.log('error', error));
        }
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        hiddenFileInput.current?.click();
    };

    return (
        <div className="image-upload-container">
            <div className="box-decoration">
                <label className="mb-2.5 block text-black dark:text-white">
                    Masukan Foto Lahan <span className="text-meta-1">*</span>
                </label>
                <label
                    htmlFor="image-upload-input"
                    className="image-upload-label"
                >
                    {image ? image.name : ''}
                </label>
                <div
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                    className="max-w-40"
                >
                    {uploadedImageUrl ? (
                        <img
                            src={uploadedImageUrl}
                            alt="upload image"
                            className="img-display-after"
                        />
                    ) : image ? (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="upload image"
                            className="img-display-after"
                        />
                    ) : (
                        <img
                            src="/UploadImage.png"
                            alt="upload image"
                            className="img-display-before"
                        />
                    )}
                    <input
                        id="image-upload-input"
                        type="file"
                        onChange={handleImageChange}
                        ref={hiddenFileInput}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
