import axios from "axios";
import { useState } from "react";
import "../../styles/profilePageStyles/editPfp.css";
import CloseEditPfpInterface from "./CloseEditPfpInterface";
import { USER_SERVICE_URL } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUserAvatar } from "../../config/userDataSlice";

const EditPfp = ({ setShowEditPfpInterface }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
            toast.error("File size exceeds 2 MB.");
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const accessToken = useSelector((state) => state.userDataSlice.accessToken);

    const handleUploadClick = async (e) => {
        if (!file) {
            toast.error("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        if (!accessToken) {
            toast.error("User not logged in");
            return;
        }

        try {
            const response = await axios.post(
                USER_SERVICE_URL + "/upload-image",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "access-token": accessToken
                    }
                }
            );
            toast.success("Image uploaded successfully!");
            const imageUrl = response.data.data;

            dispatch(updateUserAvatar(imageUrl));
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Image upload failed"
            );
        }
    };

    return (
        <div className="edit-pfp-interface">
            <CloseEditPfpInterface
                setShowEditPfpInterface={setShowEditPfpInterface}
            />
            <div className="edit-input-container">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {preview && (
                    <div className="pfp-container">
                        <img src={preview} alt="Preview" />
                    </div>
                )}
                <div>Upload the new image</div>
                <div>(Max. 2mb)</div>
            </div>
            <button onClick={handleUploadClick}>Upload</button>
        </div>
    );
};

export default EditPfp;
