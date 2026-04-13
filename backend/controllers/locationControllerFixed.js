const Location = require("../models/location");
const fs = require("fs/promises");
const path = require("path");

const uploadsDir = path.join(__dirname, "..", "uploads");
const supportedImageMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const buildImageUrl = (req, fileName) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${fileName}`;
};

const saveBase64Image = async (req, imageValue) => {
  if (typeof imageValue !== "string" || !imageValue.trim()) {
    return { imageUrl: null, imageSource: null };
  }

  const trimmedImage = imageValue.trim();
  const dataUriMatch = trimmedImage.match(
    /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/
  );

  if (!dataUriMatch) {
    return {
      imageUrl: /^https?:\/\//i.test(trimmedImage) ? trimmedImage : null,
      imageSource: trimmedImage,
    };
  }

  const mimeType = dataUriMatch[1].toLowerCase();

  if (!supportedImageMimeTypes.has(mimeType)) {
    throw new Error("Unsupported image format");
  }

  const extensionMap = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  const fileName = `location-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${extensionMap[mimeType] || ".jpg"}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(filePath, Buffer.from(dataUriMatch[2], "base64"));

  return {
    imageUrl: buildImageUrl(req, fileName),
    imageSource: "base64",
  };
};

const normalizeLocation = async (req, item, uploadedFile) => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const name = item.name || item.title || item.placeName;
  const latValue = item.lat ?? item.latitude;
  const lngValue = item.lng ?? item.lon ?? item.longitude;
  const lat = latValue !== undefined ? Number(latValue) : undefined;
  const lng = lngValue !== undefined ? Number(lngValue) : undefined;

  if (!name || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  let imageUrl = null;
  let imageSource = null;

  if (uploadedFile?.filename) {
    imageUrl = buildImageUrl(req, uploadedFile.filename);
    imageSource = uploadedFile.originalname || "upload";
  } else if (item.image) {
    const imageData = await saveBase64Image(req, item.image);
    imageUrl = imageData.imageUrl;
    imageSource = imageData.imageSource;
  }

  return { name, lat, lng, imageUrl, imageSource };
};

exports.saveLocations = async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const locations = await Promise.all(
      payload.map((item, index) =>
        normalizeLocation(req, item, index === 0 ? req.file : null)
      )
    );

    if (locations.some((location) => !location)) {
      return res.status(400).json({
        message: "Valid location data is required",
        expectedBody: {
          single: {
            name: "string",
            lat: "number",
            lng: "number",
            image: "optional multipart file, image URL, or base64 data URI",
          },
          multiple: [
            {
              name: "string",
              lat: "number",
              lng: "number",
              image: "optional image URL or base64 data URI",
            },
          ],
        },
      });
    }

    const saved = await Location.insertMany(locations);

    return res.status(201).json({
      message: "Locations saved",
      count: saved.length,
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save locations",
      error: error.message,
    });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const data = await Location.find().sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch locations",
      error: error.message,
    });
  }
};
