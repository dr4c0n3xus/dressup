const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

async function uploadImage({ prompt, image }) {
  try {
    const data = new FormData();

    data.append("prompt", prompt);
    data.append("type", 0);
    data.append("myfile", fs.createReadStream(image));
    data.append("serveUrl", 3);

    const headers = {
      ...config.headers,
      ...data.getHeaders(),
    };

    const res = await axios.post(
      "https://access3.faceswapper.ai/api/FaceSwapper/UploadByClothAndEditor",
      data,
      { headers },
    );

    console.log("image uploaded...");
    return res.data.data?.code;
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

async function getImage(code) {
  try {
    const data = {
      code: code,
      type: 0,
      serveUrl: 3,
    };

    const res = await axios.post(
      "https://access3.faceswapper.ai/api/FaceSwapper/ClothAndEditorCheckStatus",
      data,
      config,
    );

    if (res.data.data.status === "waiting") {
      console.log("dressing up image...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return getImage(code);
    } else {
      return res.data.data.downloadUrls[0];
    }
  } catch (error) {
    console.error(
      "Error getting image status:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

async function init() {
  try {
    const args = process.argv.slice(2);

    if (args.length !== 2) {
      console.error(
        "Please provide a prompt and a image file path as arguments.",
      );
      process.exit(1);
    }

    const [prompt, imagePath] = args;

    if (!fs.existsSync(imagePath)) {
      console.error("File path do not exist.");
      process.exit(1);
    }
    const code = await uploadImage({
      prompt: prompt,
      image: imagePath,
    });

    if (code) {
      const image = await getImage(code);
      if (image) {
        const imageResponse = await axios.get(image, {
          responseType: "stream",
        });
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:.]/g, "");
        const filePath = path.join(
          __dirname,
          "data",
          `result_${timestamp}.jpg`,
        );
        imageResponse.data.pipe(fs.createWriteStream(filePath));
        console.log("image saved @", filePath);
      } else {
        console.error("No image URL returned.");
      }
    } else {
      console.error("Failed to get image code from upload.");
    }
  } catch (error) {
    console.error("Error in init function:", error.message);
  }
}

init();
