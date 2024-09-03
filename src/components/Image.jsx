import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";
import Upload from "./Upload";
import styles from "./image.module.css";
import HeaderLogin from "./HeaderLogin";
import Footer from "./Footer";

export default function Image({ role }) {
  const [imgUrl, setImgUrl] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const location = useLocation();
  const storage = getStorage();

  const fetchImages = () => {
    const listRef = ref(storage, "file");
    listAll(listRef)
      .then((result) => {
        const urls = result.items.map((itemRef) => getDownloadURL(itemRef));
        Promise.all(urls).then((urls) => setImgUrl(urls));
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  };

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      const filename = url.substring(url.lastIndexOf("/") + 1) || "image";
      const blobUrl = URL.createObjectURL(blob);

      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Ensure URL is revoked after download
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const downloadAllImagesAsZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("images");

    try {
      for (const url of imgUrl) {
        const response = await fetch(url);
        const blob = await response.blob();

        const filenameWithExtension = url.substring(url.lastIndexOf("/") + 1) || `image${uuidv4()}`;
        const extension = filenameWithExtension.split('.').pop();
        
        const validExtensions = ["jpg", "jpeg", "png", "gif"];
        const correctedFilename = validExtensions.includes(extension) ? filenameWithExtension : `${filenameWithExtension}.jpg`;

        folder.file(correctedFilename, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "images.zip");
    } catch (error) {
      console.error("Error generating zip file:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <HeaderLogin />
      <div className={styles.uploadContainer}>
        {role === 'President' && <Upload fetchImages={fetchImages} />}
        <div className={styles.imageGrid}>
          {imgUrl.map((url, index) => (
            <div
              key={index}
              className={`${styles.imageContainer} ${expandedIndex === index ? styles.expanded : ""}`}
              onClick={() => handleImageClick(index)}
            >
              <img src={url} alt="Uploaded" className={styles.image} />
              {expandedIndex === index && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating to parent div
                    downloadImage(url);
                  }}
                  className={styles.downloadButton}
                >
                  Download
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={downloadAllImagesAsZip}
          className={styles.downloadAllButton}
        >
          Download All as Zip
        </button>
      </div>
      <Footer />
    </>
  );
}
