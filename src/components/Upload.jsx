import { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import styles from "./upload.module.css";  // Import the CSS file

export default function Upload({ fetchImages }) {
    const [img, setImg] = useState(null);
    const storage = getStorage();

    const handleClick = async () => {
        if (img) {
            const imgRef = ref(storage, `file/${uuidv4()}`);
            try {
                await uploadBytes(imgRef, img);
                alert("Image uploaded successfully!");
                fetchImages();
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload image. Please try again.");
            }
        } else {
            alert("Please select an image to upload.");
        }
    };

    return (
        <div className={styles.uploadForm}>
            <h1>Upload Image</h1>
            <input type="file" onChange={(e) => setImg(e.target.files[0])} className={styles.uploadInput} />
            <button onClick={handleClick} className={styles.uploadButton}>Upload</button>
        </div>
    );
}
