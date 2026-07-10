import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dwhudpkbq",
  api_key: "771867698816852",
  api_secret: "woSyf7VPuLVhfD0PHW4BgpJ37wA",
});


const Cloudinary_File_Upload = async (localFilePath) => {
  try {
    if (!localFilePath) return null;


    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });


    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(` Successfully removed temporary local file: ${localFilePath}`);
    }

    return response;
  } catch (error) {

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(` Cleaned up temporary file after failed cloud upload: ${localFilePath}`);
    }
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

const deleteOnCloudinary = async (public_id, resource_type = "image") => {
  try {
    if (!public_id) {
      console.log(" Cloudinary Delete Skipped: No public_id provided");
      return false;
    }

    const response = await cloudinary.uploader.destroy(public_id, {
      resource_type: `${resource_type}`
    });
    if (response && response.result === 'ok') {
      console.log(` Successfully deleted asset from Cloudinary. Public ID: ${public_id}`);
      return true;
    } else {

      console.log(` Cloudinary structural status message: "${response?.result}" for ID: ${public_id}`);
      return false;
    }
  } catch (error) {
    console.error(" Delete on Cloudinary failed entirely:", error);
    return false;
  }
};



export { Cloudinary_File_Upload, deleteOnCloudinary };
