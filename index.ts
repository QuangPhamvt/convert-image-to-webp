import fs from "fs";
import sharp from "sharp";
console.log(
  "Hello there! Please enter the path to the folder containing the images you want to convert to webp format",
);
const CONVERT_IMAGE_FOLDER = "./convert-image";
let dir = "";

// Function to convert image
async function convertImage(dir: string, name: string) {
  const path = `${dir}/${name}`;
  const image = sharp(fs.readFileSync(path));
  image.toFormat("webp", { quality: 75 });
  try {
    await image.toFile(`${CONVERT_IMAGE_FOLDER}/${name.split(".")[0]}.webp`);
    console.log(`Convert ${name} success`);
  } catch (e) {
    console.error(`Convert ${name} failed: ${e}`);
  }
}

console.write(`Path: `);
for await (const line of console) {
  dir = line;
  if (!fs.existsSync(dir)) {
    console.error(`Path does not exist: ${dir}`);
    continue;
  }

  // Check if exist convert folder then remove it
  if (fs.existsSync(CONVERT_IMAGE_FOLDER)) {
    fs.rmdirSync(CONVERT_IMAGE_FOLDER, { recursive: true });
    console.log("Remove convert-image folder");
  }

  // Create convert folder
  fs.mkdirSync(CONVERT_IMAGE_FOLDER);

  // Convert image
  const files = fs.readdirSync(dir);
  Promise.allSettled(files.map((file) => convertImage(dir, file)))
    .then(() => {
      console.log("Convert all images success");
    })
    .catch((e) => {
      console.error(e);
    });
  break;
}
